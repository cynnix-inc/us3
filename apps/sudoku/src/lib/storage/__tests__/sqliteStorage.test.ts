import type { SqlDatabase, SqlParam, SqlStatement } from '../sqlite/SqlDatabase';
import { SqliteStorage } from '../sqlite/SqliteStorage';

type PuzzleRow = {
  puzzle_id: string;
  kind: string;
  difficulty: string;
  seed: string;
  created_at_ms: number;
  updated_at_ms: number;
};

type PuzzleStateRow = {
  puzzle_id: string;
  board: string;
  notes: string;
  elapsed_ms: number;
  status: string;
  updated_at_ms: number;
};

class FakeStatement implements SqlStatement {
  private cursor = -1;
  private rows: Record<string, unknown>[] = [];

  constructor(
    private readonly getRows:
      | Record<string, unknown>[]
      | ((params: SqlParam[]) => Record<string, unknown>[]),
  ) {
    if (Array.isArray(getRows)) this.rows = getRows;
  }

  bind(params: SqlParam[]) {
    if (typeof this.getRows === 'function') {
      this.rows = this.getRows(params);
      this.cursor = -1;
    }
  }

  step() {
    this.cursor += 1;
    return this.cursor < this.rows.length;
  }

  getAsObject() {
    return this.rows[this.cursor] ?? {};
  }

  free() {
    // No-op: fake statement doesn't hold native resources.
  }
}

class FakeDb implements SqlDatabase {
  userVersion = 0;

  puzzles = new Map<string, PuzzleRow>();
  puzzleStates = new Map<string, PuzzleStateRow>();

  prepare(sql: string): SqlStatement {
    const s = sql.trim();

    if (/^PRAGMA\s+user_version;?$/i.test(s)) {
      return new FakeStatement([{ user_version: this.userVersion }]);
    }

    if (
      /SELECT\s+COUNT\(\*\)\s+AS\s+c\s+FROM\s+puzzle_states\s+WHERE\s+status\s*=\s*'in_progress'/i.test(
        s,
      )
    ) {
      const c = Array.from(this.puzzleStates.values()).filter(
        (r) => r.status === 'in_progress',
      ).length;
      return new FakeStatement([{ c }]);
    }

    if (
      /SELECT\s+board,\s*notes,\s*elapsed_ms,\s*status\s+FROM\s+puzzle_states\s+WHERE\s+puzzle_id\s*=\s*\?/i.test(
        s,
      )
    ) {
      return new FakeStatement((params) => {
        const puzzleId = params[0];
        if (typeof puzzleId !== 'string') return [];
        const row = this.puzzleStates.get(puzzleId);
        if (!row) return [];
        return [
          {
            board: row.board,
            notes: row.notes,
            elapsed_ms: row.elapsed_ms,
            status: row.status,
          },
        ];
      });
    }

    return new FakeStatement([]);
  }

  run(sql: string, params: SqlParam[] = []) {
    const s = sql.trim();

    if (/^BEGIN$/i.test(s) || /^COMMIT$/i.test(s) || /^ROLLBACK$/i.test(s)) return;

    const setVersion = /^PRAGMA\s+user_version\s*=\s*(\d+);?$/i.exec(s);
    if (setVersion) {
      this.userVersion = Number(setVersion[1]);
      return;
    }

    // DDL in migrations: no-op for fake DB.
    if (/^CREATE\s+TABLE/i.test(s) || /^CREATE\s+INDEX/i.test(s)) return;

    if (/UPDATE\s+puzzles\s+SET\s+updated_at_ms\s*=\s*\?\s+WHERE\s+puzzle_id\s*=\s*\?/i.test(s)) {
      const [updated_at_ms, puzzle_id] = params as [number, string];
      const existing = this.puzzles.get(puzzle_id);
      if (!existing) return;
      this.puzzles.set(puzzle_id, { ...existing, updated_at_ms });
      return;
    }

    if (/INSERT\s+OR\s+REPLACE\s+INTO\s+puzzles/i.test(s)) {
      const [puzzle_id, kind, difficulty, seed, , created_at_ms, updated_at_ms] = params as [
        string,
        string,
        string,
        string,
        string,
        number,
        number,
      ];

      const existing = this.puzzles.get(puzzle_id);
      this.puzzles.set(puzzle_id, {
        puzzle_id,
        kind,
        difficulty,
        seed,
        created_at_ms: existing?.created_at_ms ?? created_at_ms,
        updated_at_ms,
      });
      return;
    }

    if (/INSERT\s+OR\s+REPLACE\s+INTO\s+puzzle_states/i.test(s)) {
      // startInProgressPuzzle path (COALESCE-heavy insert) uses 5 params.
      if (params.length === 5) {
        const [puzzle_id, , , , updated_at_ms] = params as [string, string, string, string, number];
        const existing = this.puzzleStates.get(puzzle_id);
        this.puzzleStates.set(puzzle_id, {
          puzzle_id,
          board: existing?.board ?? '',
          notes: existing?.notes ?? '',
          elapsed_ms: existing?.elapsed_ms ?? 0,
          status: 'in_progress',
          updated_at_ms,
        });
        return;
      }

      // savePuzzleState path uses 6 params.
      const [puzzle_id, board, notes, elapsed_ms, status, updated_at_ms] = params as [
        string,
        string,
        string,
        number,
        string,
        number,
      ];
      this.puzzleStates.set(puzzle_id, {
        puzzle_id,
        board,
        notes,
        elapsed_ms,
        status,
        updated_at_ms,
      });
    }
  }
}

describe('SqliteStorage (offline persistence)', () => {
  let db: FakeDb;
  let storage: SqliteStorage;

  beforeEach(() => {
    db = new FakeDb();
    storage = new SqliteStorage(db);
  });

  it('applies migrations idempotently', async () => {
    await storage.migrate();
    await storage.migrate();

    expect(db.userVersion).toBe(1);
  });

  it('persists and restores puzzle state (autosave/resume)', async () => {
    await storage.migrate();

    await storage.startInProgressPuzzle({
      puzzleId: 'p1',
      kind: 'daily',
      difficulty: 'easy',
      seed: '2025-12-19',
    });

    await storage.savePuzzleState('p1', {
      board: '...serialized-board...',
      notes: '...serialized-notes...',
      elapsedMs: 1234,
      status: 'in_progress',
    });

    const restored = await storage.loadPuzzleState('p1');
    expect(restored).toEqual({
      board: '...serialized-board...',
      notes: '...serialized-notes...',
      elapsedMs: 1234,
      status: 'in_progress',
    });
  });

  it('enforces the 3 in-progress limit', async () => {
    await storage.migrate();

    await storage.startInProgressPuzzle({
      puzzleId: 'p1',
      kind: 'daily',
      difficulty: 'easy',
      seed: 's1',
    });
    await storage.startInProgressPuzzle({
      puzzleId: 'p2',
      kind: 'freePlay',
      difficulty: 'medium',
      seed: 's2',
    });
    await storage.startInProgressPuzzle({
      puzzleId: 'p3',
      kind: 'freePlay',
      difficulty: 'hard',
      seed: 's3',
    });

    await expect(
      storage.startInProgressPuzzle({
        puzzleId: 'p4',
        kind: 'freePlay',
        difficulty: 'expert',
        seed: 's4',
      }),
    ).rejects.toThrow(/in-progress/i);
  });
});
