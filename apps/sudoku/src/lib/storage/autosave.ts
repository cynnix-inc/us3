export type AutosaveController<T> = {
  enqueue: (next: T) => void;
  flush: () => Promise<void>;
  cancel: () => void;
};

/**
 * Debounced autosave with a hard upper bound.
 * Guarantees that once `enqueue()` is called, `save()` will run within `maxDelayMs`.
 */
export function createAutosave<T>(opts: {
  save: (value: T) => Promise<void> | void;
  debounceMs?: number;
  maxDelayMs?: number;
}): AutosaveController<T> {
  const debounceMs = opts.debounceMs ?? 250;
  const maxDelayMs = opts.maxDelayMs ?? 1000;

  let latest: T | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let maxTimer: ReturnType<typeof setTimeout> | null = null;

  const cancel = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (maxTimer) clearTimeout(maxTimer);
    debounceTimer = null;
    maxTimer = null;
  };

  const flush = async () => {
    if (latest === null) return;
    const toSave = latest;
    latest = null;
    cancel();
    await opts.save(toSave);
  };

  const enqueue = (next: T) => {
    latest = next;

    // First enqueue starts the max-delay timer.
    if (!maxTimer) {
      maxTimer = setTimeout(() => {
        void flush();
      }, maxDelayMs);
    }

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      void flush();
    }, debounceMs);
  };

  return { enqueue, flush, cancel };
}
