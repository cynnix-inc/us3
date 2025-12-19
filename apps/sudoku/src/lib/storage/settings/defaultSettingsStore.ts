import { MemoryKeyValueStore } from './MemoryKeyValueStore';
import { SettingsStore } from './SettingsStore';

let cached: SettingsStore | null = null;

export async function getDefaultSettingsStore(): Promise<SettingsStore> {
  if (cached) return cached;

  // On web SSR / static prerender there is no window/localStorage. Use in-memory defaults.
  if (typeof window === 'undefined') {
    cached = new SettingsStore(new MemoryKeyValueStore());
    return cached;
  }

  // Client environments can use AsyncStorage (web polyfills to localStorage; native uses platform storage).
  const { AsyncStorageKeyValueStore } = await import('./AsyncStorageKeyValueStore');

  cached = new SettingsStore(new AsyncStorageKeyValueStore());
  return cached;
}
