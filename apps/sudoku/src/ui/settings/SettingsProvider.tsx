import * as React from 'react';

import { getDefaultSettingsStore } from '@/src/lib/storage/settings/defaultSettingsStore';
import type { Settings, TextSizeSetting } from '@/src/lib/storage/settings/SettingsStore';

export type SettingsContextValue = {
  hydrated: boolean;
  settings: Settings;
  setSettings: (next: Partial<Settings>) => Promise<void>;
};

const SettingsContext = React.createContext<SettingsContextValue | null>(null);

function getFallbackSettings(): Settings {
  // Note: `SettingsStore` merges defaults, but we need a synchronous fallback here.
  return {
    theme: 'system',
    soundEnabled: true,
    hapticsEnabled: true,
    textSize: 'default',
    timerDefault: true,
    zenMode: false,
  };
}

export function SettingsProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [hydrated, setHydrated] = React.useState(false);
  const [settings, setSettingsState] = React.useState<Settings>(getFallbackSettings);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const store = await getDefaultSettingsStore();
      const next = await store.get();
      if (cancelled) return;
      setSettingsState(next);
      setHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setSettings = React.useCallback(async (next: Partial<Settings>) => {
    const store = await getDefaultSettingsStore();
    const merged = await store.set(next);
    setSettingsState(merged);
  }, []);

  const value: SettingsContextValue = React.useMemo(
    () => ({ hydrated, settings, setSettings }),
    [hydrated, settings, setSettings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = React.useContext(SettingsContext);
  if (ctx) return ctx;
  return {
    hydrated: false,
    settings: getFallbackSettings(),
    setSettings: async () => {},
  } satisfies SettingsContextValue;
}

export function textSizeToScale(textSize: TextSizeSetting): number {
  if (textSize === 'largest') return 1.25;
  if (textSize === 'large') return 1.12;
  return 1;
}
