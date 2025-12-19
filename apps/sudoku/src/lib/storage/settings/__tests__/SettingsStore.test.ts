import { MemoryKeyValueStore } from '../MemoryKeyValueStore';
import { SettingsStore } from '../SettingsStore';

describe('SettingsStore', () => {
  it('returns defaults when empty', async () => {
    const store = new SettingsStore(new MemoryKeyValueStore());
    await expect(store.get()).resolves.toMatchObject({
      theme: 'system',
      soundEnabled: true,
      hapticsEnabled: true,
      textSize: 'default',
      timerDefault: true,
      zenMode: false,
    });
  });

  it('persists settings updates', async () => {
    const kv = new MemoryKeyValueStore();
    const store = new SettingsStore(kv);

    await store.set({
      theme: 'dark',
      timerDefault: false,
      soundEnabled: false,
      hapticsEnabled: false,
      textSize: 'largest',
    });
    await expect(store.get()).resolves.toMatchObject({
      theme: 'dark',
      timerDefault: false,
      soundEnabled: false,
      hapticsEnabled: false,
      textSize: 'largest',
    });
  });

  it('clears settings', async () => {
    const kv = new MemoryKeyValueStore();
    const store = new SettingsStore(kv);

    await store.set({ theme: 'light' });
    await store.clear();
    await expect(store.get()).resolves.toMatchObject({
      theme: 'system',
      soundEnabled: true,
      hapticsEnabled: true,
      textSize: 'default',
    });
  });
});
