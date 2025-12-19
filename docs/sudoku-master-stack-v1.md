## Sudoku v1 — Master Tech Stack (Web + iOS/Android)

### Purpose

Define the **single codebase** tech stack we’ll use for Sudoku v1 (per PRD), why it fits, and what the major architectural boundaries are—before scaffolding.

### Source requirements

- PRD: `docs/sudoku-prd-v1.md`
- Screens & menus: `docs/sudoku-screens-and-menus-v1.md`
- Settings: `docs/sudoku-settings-v1.md`

---

## PRD requirements this stack must satisfy

- **Platforms**: responsive **Web** + cross-platform **iOS/Android**
- **Offline-first**: Daily + Free Play playable offline; autosave/resume; sync when online
- **Performance**: fast input latency; reasonable puzzle generation time
- **Accessibility**: keyboard support (web), screen reader semantics, text scaling, color-safe highlights
- **Optional accounts**: sign-in enables sync + leaderboards; guest mode supported
- **Daily leaderboard**: only “Competitive Daily” eligible; basic integrity checks (v1 “medium”)

---

## Recommended stack (v1)

### App framework

- **Expo (React Native) + Expo Router**
- **React Native Web** for web target
- **TypeScript** everywhere

**Why**: best fit for “single codebase” across mobile + web while keeping shared logic (Sudoku engine, persistence, eligibility rules) and a reliable path to strong offline support.

### UI + styling

- **NativeWind (Tailwind for React Native)** for consistent styling on iOS/Android/Web
- A small **design-token layer** (colors/typography/spacing/radii) derived from the Figma Make design

#### Figma Make integration policy

- The Figma Make UI is treated as the **visual source of truth**, not a drop-in runtime dependency.
- We will **extract tokens and component patterns** and implement screens/components using RN primitives (`View`, `Text`, `Pressable`) for cross-platform behavior.
- Outcome: consistent UI parity without fighting DOM/CSS-only assumptions.

#### Figma Make file (v1)

- UI/UX source of truth (Figma Make): `https://www.figma.com/make/BXuIw8tGSZMaJcMeF439WT/Dark-Themed-Sudoku-UI-UX?t=Cn2IvBm76IroVvni-1`

#### Policy: missing design elements in Figma

- If a required v1 feature/screen exists in PRD/docs but is missing in Figma, **flag the gap** and treat it as a product/design decision.
- Do not “invent” UI/UX beyond what is specified in PRD/docs without explicit approval; keep any stopgap UI minimal and clearly temporary.

### State management

- **Zustand** for local UI + game state
- **TanStack Query** for server state (sync, leaderboard, profile)

### Offline persistence (autosave/resume)

- **SQLite** (`expo-sqlite`) for durable structured data:
  - puzzles (daily/freeplay metadata)
  - puzzle states (board/notes/timer/settings snapshot)
  - runs/results (assisted/unassisted flags, competitive eligibility)
  - stats/history (either aggregates or event logs)
- **AsyncStorage** for small preferences/settings when SQLite isn’t necessary
- **SecureStore** (`expo-secure-store`) for sensitive secrets/session material

### Backend (optional accounts + sync + leaderboards)

- **Supabase**
  - **Auth**: Apple, Google, Email magic link
  - **Postgres**: leaderboards and stats queries fit naturally
  - **Edge Functions**: leaderboard submission validation + sanity checks

#### Backend responsibility boundaries

- **Client-authoritative gameplay** (v1): puzzle play + timer run locally.
- **Server validation (v1 “medium”)**:
  - validates puzzle identity/date
  - validates completion (proof that final grid matches the puzzle’s solution)
  - sanity checks time submissions
  - enforces “today only” leaderboard rule

### Crash reporting / telemetry

- **Sentry** for crash reporting (supports web + RN)
- Analytics provider can be added later; v1 must support opt-out where feasible.

### Testing (minimum)

- **Unit tests**: Sudoku engine (generator/solver), competitive eligibility rules, persistence adapters
- **Light integration tests**: key screens rendering and store wiring

---

## Architecture overview (high-level)

### Modules

- **UI layer**: screens + reusable components (token-driven)
- **Game engine**: Sudoku generation/solver/difficulty rating (pure TS; no UI dependencies)
- **Persistence**: storage adapters (SQLite/AsyncStorage) + autosave policy
- **Eligibility rules**: assisted/unassisted + competitive preset enforcement (pure functions)
- **Sync**: local-first replication boundaries; last-write-wins policy

### Data flow (offline-first)

- App reads/writes local state immediately (fast UI + durability).
- When signed in and online, a sync layer uploads changes and pulls remote updates.
- Conflict strategy: **last write wins**, with record design to prevent puzzle state corruption.

---

## Decisions mapped to PRD requirements

### Web + cross-platform mobile (single codebase)

- **Decision**: Expo (React Native) + React Native Web.
- **PRD fit**: Meets “Web + cross-platform mobile (single codebase for iOS/Android)” while keeping responsive web and shared features.

### Offline Daily + Free Play + autosave/resume

- **Decision**: SQLite as durable store + deterministic daily generation + local puzzle generation.
- **PRD fit**: “Fully playable offline (Daily + Free Play + autosave)” and “no progress loss after restart/crash”.

### Competitive Daily eligibility + assisted/unassisted rules

- **Decision**: Eligibility computed locally via pure functions from settings/actions; persisted with each run.
- **PRD fit**: Enforces the explicit assisted triggers list and supports “Leaderboard eligibility lost” state in-game.

### Leaderboards with medium anti-cheat

- **Decision**: Supabase Postgres + Edge Function for submission validation.
- **PRD fit**: Validates puzzle identity/date and sanity-checks time; keeps v1 anti-cheat appropriately scoped.

### Accessibility

- **Decision**: RN accessibility props + web focus/keyboard handling designed into the grid.
- **PRD fit**: Keyboard support on web, screen-reader friendly interaction model, text scaling, and non-color-only highlighting.

### Sync (optional)

- **Decision**: Supabase for auth/sync + local-first replication and automatic resume.
- **PRD fit**: Optional sign-in; sync settings + in-progress state + history/stats; “sync resumes automatically when online”.

---

## Key implementation decisions (locked unless revisited)

- **Single universal Expo app** (not separate web + native apps).
- **Supabase** as the initial backend for auth/sync/leaderboards.
- **SQLite** as the durable source of truth for puzzle/run history.
- **Figma Make used for tokens and layout reference**, not direct DOM/CSS reuse.

---

## Risks / watch-outs

- **Figma Make portability**: generated DOM/CSS won’t map 1:1 to RN; token-first approach avoids churn.
- **Keyboard + grid accessibility**: must be designed intentionally (focus management and cell semantics on web).
- **Timer integrity**: v1 accepts client time with sanity checks; avoid backend overreach early.

---

## Out of scope for v1 (per PRD)

- Monetization
- Variants / non-9x9
- Strong anti-cheat (server authoritative play)
- Notifications and broad social features
