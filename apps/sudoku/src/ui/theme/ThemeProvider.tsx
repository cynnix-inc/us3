import * as React from 'react';
import { Appearance, Platform } from 'react-native';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

import type { ThemeName } from '@/src/ui/tokens';

import { getDefaultSettingsStore } from '@/src/lib/storage/settings/defaultSettingsStore';

export type UserThemeSetting = 'system' | ThemeName;

export type ThemeContextValue = {
  hydrated: boolean;
  userTheme: UserThemeSetting;
  resolvedTheme: ThemeName;
  setUserTheme: (next: UserThemeSetting) => Promise<void>;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getWebSystemTheme(): ThemeName {
  if (globalThis.window === undefined) return 'light';
  return globalThis.window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function useSystemTheme(): ThemeName {
  const [theme, setTheme] = React.useState<ThemeName>('light');

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      const media = globalThis.window?.matchMedia?.('(prefers-color-scheme: dark)');
      const apply = () => setTheme(getWebSystemTheme());

      apply();

      if (!media) return;

      // Best-effort system theme sync on web.
      if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', apply);
        return () => media.removeEventListener('change', apply);
      }

      return;
    }

    const apply = () => {
      const next = Appearance.getColorScheme();
      setTheme(next === 'dark' ? 'dark' : 'light');
    };

    apply();

    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });

    return () => sub.remove();
  }, []);

  return theme;
}

export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const systemTheme = useSystemTheme();
  const nativewind = useNativeWindColorScheme();

  const [hydrated, setHydrated] = React.useState(false);
  const [userTheme, setUserThemeState] = React.useState<UserThemeSetting>('system');

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const store = await getDefaultSettingsStore();
        const settings = await store.get();
        if (cancelled) return;
        setUserThemeState(settings.theme);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const resolvedTheme: ThemeName = userTheme === 'system' ? systemTheme : userTheme;

  React.useEffect(() => {
    // Keep NativeWind `dark:` variants in sync with the chosen theme.
    const desired: 'light' | 'dark' | 'system' = userTheme === 'system' ? 'system' : resolvedTheme;
    if (nativewind.colorScheme !== desired) nativewind.setColorScheme(desired);
  }, [nativewind, resolvedTheme, userTheme]);

  const setUserTheme = React.useCallback(async (next: UserThemeSetting) => {
    setUserThemeState(next);
    const store = await getDefaultSettingsStore();
    await store.set({ theme: next });
  }, []);

  const value: ThemeContextValue = React.useMemo(
    () => ({ hydrated, userTheme, resolvedTheme, setUserTheme }),
    [hydrated, userTheme, resolvedTheme, setUserTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (ctx) return ctx;
  return {
    hydrated: false,
    userTheme: 'system' as const,
    resolvedTheme: 'light' as const,
    setUserTheme: async () => {},
  } satisfies ThemeContextValue;
}
