import type { KeyValueStore } from './KeyValueStore';

export class MemoryKeyValueStore implements KeyValueStore {
  private readonly map = new Map<string, string>();

  async getItem(key: string) {
    return this.map.get(key) ?? null;
  }

  async setItem(key: string, value: string) {
    this.map.set(key, value);
  }

  async removeItem(key: string) {
    this.map.delete(key);
  }
}
