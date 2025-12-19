import type { ThemeName } from '@/src/ui/tokens';

import type { KeyValueStore } from './KeyValueStore';

export type TextSizeSetting = 'default' | 'large' | 'largest';

export type Settings = {
  theme: 'system' | ThemeName;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  textSize: TextSizeSetting;
  timerDefault: boolean;
  zenMode: boolean;
};

const SETTINGS_KEY = 'settings:v1';

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  soundEnabled: true,
  hapticsEnabled: true,
  textSize: 'default',
  timerDefault: true,
  zenMode: false,
};

export class SettingsStore {
  constructor(private readonly kv: KeyValueStore) {}

  async get(): Promise<Settings> {
    const raw = await this.kv.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    try {
      const parsed = JSON.parse(raw) as Partial<Settings>;
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  async set(next: Partial<Settings>): Promise<Settings> {
    const current = await this.get();
    const merged: Settings = { ...current, ...next };
    await this.kv.setItem(SETTINGS_KEY, JSON.stringify(merged));
    return merged;
  }

  async clear() {
    await this.kv.removeItem(SETTINGS_KEY);
  }
}
