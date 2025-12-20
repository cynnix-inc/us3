# Ultimate Sudoku Guidelines (Figma Make → Expo)

This document exists to keep **Figma Make output** and **implementation work** compatible with this repo’s stack and architecture.

Figma Make is the **visual source of truth**. Treat generated code as a **starting point** (layout + tokens), not a drop-in runtime dependency.

## Technologies & stack (this repo)

- **Runtime**: Node **20.x**
- **App framework**: **Expo** (React Native) + **Expo Router** (file-based routes in `apps/sudoku/app/**`)
- **Language**: **TypeScript** (strict)
- **Targets**: iOS / Android / Web (via `react-native-web`)

### Styling

- **NativeWind** (Tailwind-style `className` on React Native components)
- **Tailwind CSS v3** (NativeWind compatibility)
- **Dark mode**: `darkMode: 'class'` (see `apps/sudoku/tailwind.config.js`)
- **Global CSS exists** (for web/Tailwind base layers): `apps/sudoku/global.css` (imported by `apps/sudoku/app/_layout.tsx`)

Rules of thumb:

- Prefer **NativeWind `className`** for layout/spacing/typography.
- Prefer **semantic tokens** over one-off hex values (see “Design tokens” below).

### UI primitives

- Use **React Native primitives**: `View`, `Text`, `Pressable`, `ScrollView`, `TextInput`, `Modal`, etc.
- Do **not** use HTML elements (`div`, `button`, `span`, `p`, `h1`, …). This is not a React DOM app.
- Avoid direct DOM APIs (`document`, `window`) unless guarded for web-only behavior.

### Icons

- **Primary**: `@expo/vector-icons` (already used in the repo)
- If you need an icon set not covered, prefer an Expo/RN-compatible option; avoid web-only packages (e.g., `lucide-react`).

### State management

- Prefer **React hooks + context** for small, local concerns (e.g., theme/settings).
- When game/app state grows, the project’s v1 stack recommends **Zustand** (see `docs/sudoku-master-stack-v1.md`), but it may not be installed yet—don’t assume it exists.

### Persistence

- Do **not** call `localStorage` directly.
- Use repo abstractions where they exist, for example:
  - Settings/theme storage flows through `apps/sudoku/src/lib/storage/settings/**` (which uses AsyncStorage and safely handles web/SSR).
- Storage options in this repo:
  - **AsyncStorage** (`@react-native-async-storage/async-storage`) for simple key/value
  - **SecureStore** (`expo-secure-store`) for sensitive values
  - **SQLite** (`expo-sqlite`) for durable structured data

## Architecture rules (must follow)

These mirror the repo rules (`.cursor/rules/controllers.mdc`, `services.mdc`) and prevent painful rewrites.

- **UI stays thin**:
  - Rendering, input handling, accessibility, and delegating to services/stores
  - Avoid persistence or network calls in render paths
- **Business logic stays out of UI**:
  - Sudoku rules/generation/solver/difficulty rating
  - Competitive eligibility + assisted/unassisted determination
  - Autosave/resume policy decisions
- **Put logic in the right place**:
  - Sudoku engine is under `apps/sudoku/src/lib/sudoku/**`
  - Storage is under `apps/sudoku/src/lib/storage/**`
  - Shared UI primitives belong under `apps/sudoku/src/ui/**` or `apps/sudoku/components/**`

## Accessibility + web keyboard support (required)

Web keyboard support is a **PRD requirement** (see `docs/sudoku-prd-v1.md` and `docs/sudoku-master-stack-v1.md`).

Minimum keyboard behavior for the Sudoku grid on web:

- **Digits 1–9**: enter the digit for the selected cell
- **Backspace/Delete**: clear the selected cell
- **Arrow keys**: move selection

Accessibility requirements:

- Never rely on color alone to convey state (selection, conflicts, highlights).
- All interactive elements must have accessible labels.
- Ensure focus management works on web (a predictable tab order; clear focus target for the grid).

## Sudoku engine

- Do **not** add external Sudoku libraries.
- Engine and types live under `apps/sudoku/src/lib/sudoku/**` and should remain **pure TypeScript** (platform-agnostic, testable).

## Design tokens (preferred)

- Source of truth: the Figma Make file referenced in `docs/sudoku-master-stack-v1.md`.
- Token usage:
  - Prefer semantic tokens (e.g., “app background”, “accent”, “danger”) rather than raw hex strings.
  - Existing token starting point: `apps/sudoku/src/ui/tokens.ts`
  - Existing Tailwind semantic colors: `apps/sudoku/tailwind.config.js`

## Patterns & examples (compatible with this repo)

### Component structure (RN primitives + NativeWind)

```tsx
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = {
  title: string;
  onPrimaryPress: () => void;
};

export function SimpleCard({ title, onPrimaryPress }: Props) {
  return (
    <View className="gap-3 rounded-xl border border-appBorder-light bg-appCard-light p-4 dark:border-appBorder-dark dark:bg-appCard-dark">
      <Text className="text-base text-appFg-light dark:text-appFg-dark">{title}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Primary action"
        onPress={onPrimaryPress}
        className="items-center justify-center rounded-lg bg-appAccent-light px-4 py-3 dark:bg-appAccent-dark"
        style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
      >
        <Text className="text-base text-white">Continue</Text>
      </Pressable>
    </View>
  );
}
```

Notes:

- If you use NativeWind interaction variants, verify they work with our NativeWind version; prefer `Pressable`’s `style` callback for pressed feedback when in doubt.

### Settings persistence (use existing stores, not ad-hoc storage calls in UI)

When reading/writing settings (theme, toggles), prefer the existing store/provider flows under:

- `apps/sudoku/src/lib/storage/settings/**`
- `apps/sudoku/src/ui/settings/SettingsProvider.tsx`
- `apps/sudoku/src/ui/theme/ThemeProvider.tsx`

Keep screens/components presentational: they should call a typed hook/provider method, not write AsyncStorage directly.

## Figma Make usage (to minimize rewrite during import)

When prompting Figma Make, require:

- **Expo + React Native + TypeScript**
- **NativeWind `className`** styling
- **No HTML / no CSS Modules / no shadcn**
- **Presentational-first components**:
  - Accept props and callbacks
  - No direct persistence/network calls inside UI components
  - Business rules live under `apps/sudoku/src/lib/**`

## Repo file organization (actual)

```
apps/sudoku/
  app/                 # Expo Router routes (screens)
  components/          # Shared UI components (UI-only)
  src/
    ui/                # UI primitives/providers/tokens
    lib/
      sudoku/          # Engine (pure TS)
      storage/         # Persistence adapters (AsyncStorage/SQLite/etc.)
      supabase/        # Auth/sync/leaderboard client code
      telemetry/       # Sentry init and related utilities
```


