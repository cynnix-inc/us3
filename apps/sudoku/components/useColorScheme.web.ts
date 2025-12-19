import { useTheme } from '@/src/ui/theme/ThemeProvider';

export function useColorScheme() {
  return useTheme().resolvedTheme;
}
