# Cursor Rules Summary

This document summarizes the Cursor rules for **Sudoku v1** and how they’re intended to be applied.

## Formatting

**File**: `formatting.mdc`  
**Strategy**: `always`

- Prettier is the canonical formatter.
- ESLint is the canonical linter.
- LF line endings enforced via `.gitattributes`.

## Type safety

**File**: `typesafety.mdc`  
**Strategy**: `always`

- TypeScript strict mode must stay enabled.
- DTOs must be typed at boundaries (SQLite persistence, Supabase queries, Edge Function payloads).

## Versioning

**File**: `versioning.mdc`  
**Strategy**: `always`

- Node pinned via `.nvmrc`.
- Expo SDK pinned minor line; React/RN versions must align to Expo.
- Supabase JS client pinned minor.

## Architecture & layering

**Files**: `architecture.mdc`, `controllers.mdc`, `services.mdc`, `dal.mdc`, `console.mdc`  
**Strategy**: `always` + `targeted`

- UI is thin and delegates.
- Domain/engine is pure TypeScript.
- Storage encapsulates persistence.
- Edge Functions validate and enforce leaderboard rules.

## Frontend conventions

**File**: `frontend.mdc`  
**Strategy**: `targeted`

- Expo Router routes in `app/**` stay thin.
- NativeWind `className` + a token layer for consistency.
- Accessibility (including web keyboard support for the grid) is required.

## Design system

**File**: `design_system_rules.mdc`  
**Strategy**: `targeted`

- Tokens in `src/theme/tokens.ts` (recommended).
- Avoid one-off colors/typography in components.

## Testing

**File**: `testing.mdc`  
**Strategy**: `targeted`

- High coverage for engine + eligibility logic.
- No real network calls in unit tests.
- Web E2E via Playwright; mobile E2E via a single chosen tool (Maestro recommended).

## Infrastructure

**File**: `infra.mdc`  
**Strategy**: `always`

- CI stages: lint → test → build.
- Pin GitHub Action versions.
- Keep Supabase schema changes in migrations; do not rely on manual dashboard edits.
