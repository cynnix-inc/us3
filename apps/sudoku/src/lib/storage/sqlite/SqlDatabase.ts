export type SqlParam = string | number | null;

export interface SqlStatement {
  bind(params: SqlParam[]): void;
  step(): boolean;
  getAsObject(): Record<string, unknown>;
  free(): void;
}

export interface SqlDatabase {
  prepare(sql: string): SqlStatement;
  run(sql: string, params?: SqlParam[]): void;
}
