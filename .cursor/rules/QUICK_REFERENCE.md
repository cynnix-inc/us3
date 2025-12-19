# Cursor Rules Quick Reference

## Rule Files at a Glance

| File                      | Purpose                                             | Strategy   | Applies To (high level)                    |
| ------------------------- | --------------------------------------------------- | ---------- | ------------------------------------------ | ------ | -------- | -------- |
| `project.mdc`             | Global governance, workflow, security, docs         | `always`   | All files                                  |
| `formatting.mdc`          | Formatting + EOL policy (Prettier/ESLint guidance)  | `always`   | All files                                  |
| `typesafety.mdc`          | TypeScript strictness + DTO boundary rules          | `always`   | TS/TSX + app/src/supabase                  |
| `versioning.mdc`          | Toolchain and dependency pinning                    | `always`   | package.json/lockfiles/.nvmrc/eas/supabase |
| `infra.mdc`               | CI/CD + Expo/Supabase workflows                     | `always`   | .github, eas/app config, supabase, scripts |
| `architecture.mdc`        | Module boundaries and dependency direction          | `always`   | app/src/supabase                           |
| `controllers.mdc`         | UI layer rules (screens/components/routes)          | `targeted` | app/**, components/**, \*_/_.tsx           |
| `services.mdc`            | Domain/services/orchestration rules                 | `targeted` | src/domain                                 | engine | services | usecases |
| `dal.mdc`                 | Storage rules (SQLite + Supabase migrations)        | `targeted` | src/storage, supabase/\*_/_.sql            |
| `console.mdc`             | Scripts + Supabase Edge Function rules              | `targeted` | scripts/**, supabase/functions/**          |
| `frontend.mdc`            | Expo + TypeScript + NativeWind frontend conventions | `targeted` | app/src/ts/tsx + configs                   |
| `design_system_rules.mdc` | Tokens + accessibility for consistent UI            | `targeted` | TSX + theme + components                   |
| `testing.mdc`             | Unit/component/E2E testing rules                    | `targeted` | tests + e2e + supabase                     |

## Stack Versions (Must Match)

- **Node.js**: 20.x LTS (via `.nvmrc`)
- **Expo SDK**: pinned minor line in `package.json`
- **React / React Native**: aligned to Expo SDK
- **TypeScript**: strict

## Core workflow rules

- TDD-first by default: specs → tests → implement → verify → review → commit
- No secrets committed; use `.env.example` templates only
- Prefer SDKs (Supabase client) over ad-hoc HTTP

## Product docs to follow

- `docs/sudoku-prd-v1.md`
- `docs/sudoku-master-stack-v1.md`
- `docs/sudoku-screens-and-menus-v1.md`
- `docs/sudoku-settings-v1.md`
