export type ThemeName = 'light' | 'dark';

export const tokens = {
  colors: {
    appBg: { light: '#FFFFFF', dark: '#0B0F17' },
    appFg: { light: '#0B0F17', dark: '#EAF0FF' },
    card: { light: '#F6F7FB', dark: '#121A2A' },
    border: { light: '#E5E7EB', dark: '#22304D' },
    accent: { light: '#3B82F6', dark: '#6EA8FF' },
    danger: { light: '#EF4444', dark: '#FF6B6B' },
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    // Keep this minimal until we pull exact values from Figma Make.
    title: 20,
    body: 16,
    caption: 13,
  },
} as const;
