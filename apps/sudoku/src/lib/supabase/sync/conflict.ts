export type LwwRecord<T> = {
  value: T;
  updatedAtMs: number;
};

/**
 * Last-write-wins merge.
 * If timestamps tie, remote wins to ensure convergence.
 */
export function mergeLww<T>(
  local: LwwRecord<T> | null,
  remote: LwwRecord<T> | null,
): LwwRecord<T> | null {
  if (!local) return remote;
  if (!remote) return local;

  if (remote.updatedAtMs >= local.updatedAtMs) return remote;
  return local;
}
