import { createAutosave } from '../autosave';

describe('createAutosave', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debounces rapid updates', async () => {
    const saves: number[] = [];
    const autosave = createAutosave({
      save: (v: number) => {
        saves.push(v);
      },
      debounceMs: 250,
      maxDelayMs: 1000,
    });

    autosave.enqueue(1);
    autosave.enqueue(2);
    autosave.enqueue(3);

    // Not yet.
    expect(saves).toEqual([]);

    jest.advanceTimersByTime(249);
    expect(saves).toEqual([]);

    jest.advanceTimersByTime(1);
    expect(saves).toEqual([3]);
  });

  it('guarantees save within maxDelayMs', async () => {
    const saves: number[] = [];
    const autosave = createAutosave({
      save: (v: number) => {
        saves.push(v);
      },
      debounceMs: 900,
      maxDelayMs: 1000,
    });

    autosave.enqueue(1);

    // Keep nudging before debounce triggers.
    jest.advanceTimersByTime(800);
    autosave.enqueue(2);

    // Max delay should force a save at ~1000ms from first enqueue.
    jest.advanceTimersByTime(200);
    expect(saves).toEqual([2]);
  });
});
