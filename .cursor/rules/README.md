# Cursor Rules Overview

This folder defines layered rule configurations used by Cursor to guide edits and reviews for **Sudoku v1**.

- **Scope**: controlled by `globs` per rule file
- **Precedence**: more specific rule files (narrower `globs`) take precedence over broader ones

## Rule files by category

### Core architecture & layering

1. **architecture.mdc** — High-level boundaries and dependency direction (`always`)
2. **controllers.mdc** — UI layer (Expo Router routes + screens/components) (`targeted`)
3. **services.mdc** — Domain/services/orchestration (`targeted`)
4. **dal.mdc** — Storage (SQLite + Supabase migrations) (`targeted`)
5. **console.mdc** — Scripts + Supabase Edge Functions (`targeted`)

### Frontend & design

6. **frontend.mdc** — Expo (React Native + RN Web) + TypeScript + NativeWind conventions (`targeted`)
7. **design_system_rules.mdc** — Token + accessibility guidance for consistent UI (`targeted`)

### Testing

8. **testing.mdc** — TypeScript tests + web/mobile E2E guidance (`targeted`)

### Project-wide & tooling

9. **project.mdc** — Global governance, workflow, security, docs (`always`)
10. **formatting.mdc** — Prettier + ESLint + EOL policy (`always`)
11. **typesafety.mdc** — TypeScript strictness and DTO boundaries (`always`)
12. **versioning.mdc** — Toolchain/dependency pinning (`always`)
13. **infra.mdc** — CI/CD + Expo/Supabase workflow guidance (`always`)

## Stack alignment (this repo)

- Expo (React Native + React Native Web)
- TypeScript (strict)
- NativeWind
- SQLite (offline-first)
- Supabase (Auth + DB + Edge Functions)

## Change management

- Keep rule docs aligned to `docs/sudoku-*.md`.
- Prefer SDKs over ad-hoc HTTP.
- Keep rules minimal and high-signal; avoid duplicating the same rule across multiple files.
