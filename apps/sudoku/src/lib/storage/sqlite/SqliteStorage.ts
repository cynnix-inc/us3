import type { SqlDatabase, SqlParam } from './SqlDatabase';

export type PuzzleKind = 'daily' | 'freePlay';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'master' | 'extreme' | 'adaptive';
export type PuzzleStatus = 'in_progress' | 'completed' | 'failed' | 'abandoned';

export type StartPuzzleInput = {
  puzzleId: string;
  kind: PuzzleKind;
  difficulty: Difficulty;
  /** For Daily: ISO date; for Free Play: RNG seed */
  seed: string;
};

export type PuzzleState = {
  board: string;
  notes: string;
  elapsedMs: number;
  status: PuzzleStatus;
};

const MIGRATIONS: Array<{ version: number; sql: string }> = [
  {
    version: 1,
    sql: `
CREATE TABLE IF NOT EXISTS puzzles (
  puzzle_id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  seed TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS puzzle_states (
  puzzle_id TEXT PRIMARY KEY,
  board TEXT NOT NULL,
  notes TEXT NOT NULL,
  elapsed_ms INTEGER NOT NULL,
  status TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  FOREIGN KEY (puzzle_id) REFERENCES puzzles(puzzle_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_puzzle_states_status ON puzzle_states(status);
    `.trim(),
  },
];

export class SqliteStorage {
  constructor(private readonly db: SqlDatabase) {}

  query<T extends Record<string, unknown>>(sql: string, params: SqlParam[] = []): T[] {
    const stmt = this.db.prepare(sql);
    try {
      stmt.bind(params);
      const rows: T[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject() as T);
      }
      return rows;
    } finally {
      stmt.free();
    }
  }

  run(sql: string, params: SqlParam[] = []) {
    this.db.run(sql, params);
  }

  async migrate() {
    const current =
      this.query<{ user_version: number }>('PRAGMA user_version;')[0]?.user_version ?? 0;

    for (const m of MIGRATIONS) {
      if (m.version > current) {
        this.db.run('BEGIN');
        try {
          this.db.run(m.sql);
          this.db.run(`PRAGMA user_version = ${m.version};`);
          this.db.run('COMMIT');
        } catch (e) {
          this.db.run('ROLLBACK');
          throw e;
        }
      }
    }
  }

  async startInProgressPuzzle(input: StartPuzzleInput) {
    const inProgress = this.query<{ c: number }>(
      "SELECT COUNT(*) AS c FROM puzzle_states WHERE status = 'in_progress'",
    )[0]?.c;

    if ((inProgress ?? 0) >= 3) {
      throw new Error('In-progress limit reached (max 3).');
    }

    const now = Date.now();

    this.run(
      `INSERT OR REPLACE INTO puzzles (puzzle_id, kind, difficulty, seed, created_at_ms, updated_at_ms)
       VALUES (?, ?, ?, ?, COALESCE((SELECT created_at_ms FROM puzzles WHERE puzzle_id = ?), ?), ?);`,
      [input.puzzleId, input.kind, input.difficulty, input.seed, input.puzzleId, now, now],
    );

    // Ensure there is a row so resume works even before first move.
    this.run(
      `INSERT OR REPLACE INTO puzzle_states (puzzle_id, board, notes, elapsed_ms, status, updated_at_ms)
       VALUES (?, COALESCE((SELECT board FROM puzzle_states WHERE puzzle_id = ?), ''), COALESCE((SELECT notes FROM puzzle_states WHERE puzzle_id = ?), ''), COALESCE((SELECT elapsed_ms FROM puzzle_states WHERE puzzle_id = ?), 0), 'in_progress', ?);`,
      [input.puzzleId, input.puzzleId, input.puzzleId, input.puzzleId, now],
    );
  }

  async savePuzzleState(puzzleId: string, state: PuzzleState) {
    const now = Date.now();

    // Puzzle must exist for FK consistency.
    this.run(`UPDATE puzzles SET updated_at_ms = ? WHERE puzzle_id = ?;`, [now, puzzleId]);

    this.run(
      `INSERT OR REPLACE INTO puzzle_states (puzzle_id, board, notes, elapsed_ms, status, updated_at_ms)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [puzzleId, state.board, state.notes, state.elapsedMs, state.status, now],
    );
  }

  async loadPuzzleState(puzzleId: string): Promise<PuzzleState | null> {
    const rows = this.query<{
      board: string;
      notes: string;
      elapsed_ms: number;
      status: PuzzleStatus;
    }>(`SELECT board, notes, elapsed_ms, status FROM puzzle_states WHERE puzzle_id = ?;`, [
      puzzleId,
    ]);

    const r = rows[0];
    if (!r) return null;

    return {
      board: r.board,
      notes: r.notes,
      elapsedMs: r.elapsed_ms,
      status: r.status,
    };
  }
}
