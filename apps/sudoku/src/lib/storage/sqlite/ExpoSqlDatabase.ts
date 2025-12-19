import * as SQLite from 'expo-sqlite';
import type { SQLiteDatabase } from 'expo-sqlite';

import type { SqlDatabase, SqlParam, SqlStatement } from './SqlDatabase';

class ExpoStatement implements SqlStatement {
  private rows: Array<Record<string, unknown>> = [];
  private cursor = -1;

  constructor(
    private readonly db: SQLiteDatabase,
    private readonly sql: string,
  ) {}

  bind(params: SqlParam[]) {
    // expo-sqlite supports variadic bind params.
    const all = this.db.getAllSync<Record<string, unknown>>(this.sql, ...(params as any[]));
    this.rows = all;
    this.cursor = -1;
  }

  step() {
    this.cursor += 1;
    return this.cursor < this.rows.length;
  }

  getAsObject() {
    return this.rows[this.cursor] ?? {};
  }

  free() {
    // No-op: getAllSync wraps prepare/execute/finalize internally.
  }
}

export class ExpoSqlDatabase implements SqlDatabase {
  constructor(private readonly db: SQLiteDatabase) {}

  prepare(sql: string): SqlStatement {
    return new ExpoStatement(this.db, sql);
  }

  run(sql: string, params: SqlParam[] = []) {
    if (params.length === 0) {
      // Supports running multi-statement migrations.
      this.db.execSync(sql);
      return;
    }

    this.db.runSync(sql, ...(params as any[]));
  }
}

export function openSudokuDbSync(databaseName: string = 'sudoku.db'): ExpoSqlDatabase {
  const db = SQLite.openDatabaseSync(databaseName);
  return new ExpoSqlDatabase(db);
}
