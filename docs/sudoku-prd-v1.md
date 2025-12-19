### Master Requirements Document (PRD) — Sudoku v1 (Web + Mobile)

## Executive summary

- **Product**: Classic **9x9 Sudoku** game for **Web + cross-platform mobile** (single codebase for iOS/Android).
- **Core experiences**: **Daily puzzle** (same for everyone, offline-capable) + **Free Play** (local puzzle generation) + **Adaptive mode**.
- **Accounts**: **Optional sign-in** enabling sync and leaderboard participation.
- **Monetization**: **Out of scope for v1** (design should remain extensible for future monetization).

## Goals

- Deliver a fast, reliable, offline-capable Sudoku experience with high-quality puzzle generation.
- Support cross-device continuity via optional accounts + sync.
- Provide fair daily competition with leaderboards and basic integrity checks.
- Provide accessible, modern UI with strong assist features.

## Non-goals (v1)

- Sudoku variants (Killer/Thermo/etc.) or non-9x9 sizes.
- Notifications.
- Screenshot blocking (instead: hide board on pause/background).
- Strong anti-cheat (server-authoritative time/proofs).
- Public profiles and broad user discovery.

## Target platforms & support policy

- **Mobile**: cross-platform app for iOS + Android.
- **Web**: responsive web app with keyboard support.
- **Support matrix**: **Modern-only** (latest OS + browser versions; exact versions defined at release).

## Product scope (v1)

### Modes

- **Daily puzzle**
  - Same puzzle for all players each day.
  - Resets at **local midnight** (device/account timezone).
  - **Archive**: last 30-days of past daily puzzles.
- **Free Play**
  - Choose difficulty (Easy/Medium/Hard/Expert/Master/Extreme) or use Adaptive.
  - Infinite supply via local puzzle generation.
- **Adaptive mode**
  - Explainable, banded difficulty adjustments (see Adaptive spec below).
- **Game types (placeholder)**
  - The Play experience should include a non-interactive placeholder for additional game types with “Coming soon!” messaging.
  - v1 supports classic Sudoku only; no alternate types are playable in v1.

### Difficulty system

- **Fixed difficulties**: **Easy, Medium, Hard, Expert, Master, Extreme**
- **Adaptive**: optional additional mode.

## Core game rules (classic Sudoku)

- 9x9 grid with 3x3 sub-boxes.
- Each row, column, and box must contain digits 1–9 exactly once.
- Every puzzle must have a **unique solution**.
- Completion occurs when the grid is fully filled and matches the solution.

## Puzzle sourcing & generation

### Strategy (v1)

- **Daily puzzle**: locally generated but deterministic by date so it is consistent for all players and works offline.
- **Free Play**: locally generated on-device.

### Puzzle quality requirements (Free Play) — required

- **Unique solution validation**.
- **Symmetry preference** for clue layout (best-effort).
- **Clue-count ranges** enforced per difficulty.
- **Solver-based difficulty rating** (technique/solver-driven, not just clue count).

## Gameplay UX & input

### Input methods

- **Tap cell + on-screen number pad** (mobile + web).
- **Web keyboard support**
  - Digits 1–9 to enter
  - Delete/backspace clears cell
  - Arrow keys move selection
  - Exact shortcut mapping finalized in UX spec.
- **In-game numpad controls (mobile + web)**
  - **Numpad digit lock**: toggle button near the numpad that can be turned on/off during gameplay.
    - When enabled, the currently selected digit on the numpad is “locked”.
    - While locked, tapping an empty cell **immediately places** the locked digit (no extra numpad tap required).
    - Changing the selected digit updates the locked digit; unlocking returns to normal tap-to-enter behavior.
- **Numpad completion behavior** (mobile + web)
  - When a digit is fully completed on the board (**all 9 placements are correct**, including prefilled + user entries), disable that digit’s on-screen numpad button.
  - If a correct placement is undone/cleared such that fewer than 9 correct placements remain, re-enable the digit button.
  - For keyboard entry, the UI should still indicate completion (e.g., disabled/dim state), but physical keypresses are not blocked.

### Autosave & resume

- Always autosave puzzle progress.
- Resume to the last state after restart/crash.

### In-progress limits

- Up to **3** in-progress puzzles at once (including Daily if started).

## Assist features (v1)

### Included assist mechanics

- **Notes/pencil marks** per cell (multi-candidate).
- **Undo/redo**.
- **Auto-remove notes** (remove candidates from peers when a value is placed).
- **Highlighting** (row/column/box + same numbers).
  - Selecting any cell (empty or **prefilled**) highlights:
    - The selected cell’s **row**
    - The selected cell’s **column**
    - The selected cell’s **3x3 box**
    - All other occurrences of the selected value on the grid (when the selected cell has a value)
- **Conflict highlighting** (shows duplicates; entry still allowed when enabled).
- **Check solution / validate** during play.
- **Timer** (toggleable).
- **Reveal solution / give up**.
- **Hints** (all types supported)
  - Reveal cell value
  - Show candidates for selected cell
  - Highlight next logical move
  - Explain technique (at least basic; expandable)

### Error prevention modes (v1)

- **Duplicates-only**: blocks row/col/box duplicates.
- **Strict-vs-solution**: blocks any value that differs from the puzzle solution.

### Difficulty-based assist policy (required capability)

- Assist availability and hint quantities are configurable per difficulty/mode.
- Example allowed policy: **Extreme may offer no hints**.
- Hint usage and assists are tracked for stats and penalties.

## Timer, pause, and board hiding

- Timer supports:
  - **Manual pause**
  - **Auto-pause** when app backgrounded or tab hidden
- When paused/backgrounded:
  - **Hide the game board** quickly (privacy + basic anti-cheat)

## Daily streaks

- **Streak increments on Daily completion** (assisted or unassisted).
- Streak surfaced in profile/stats.

## Leaderboards (Daily)

### Submission eligibility

- **Sign-in required** to submit/appear on leaderboards.
- Only **unassisted runs** can submit.

### Definition: assisted vs unassisted

A Daily run is **ASSISTED** if any of the following occur during the run:

- Any hint usage (of any kind)
- Any “check solution/validate” usage
- Any error prevention enabled (duplicates-only or strict-vs-solution)
- Conflict highlighting enabled
- Auto candidates enabled
- Auto-remove notes enabled
- Zen mode enabled
- Lives set to any value other than Infinity
- Manual pause used

Unassisted runs must avoid all assisted triggers.

### Competitive Daily preset (leaderboard submission path)

- Daily leaderboard submission requires starting the Daily puzzle in **Competitive Daily** mode.
- Competitive Daily forces the following:
  - Assists: Hints **OFF**, Check solution **OFF**, Error prevention **OFF**, Conflict highlighting **OFF**, Auto-remove notes **OFF**, Auto candidates **OFF**
  - Pressure settings: Zen mode **OFF**, Lives **Infinity**
  - Idle behavior: Auto-pause on idle **OFF**
- If the player changes any of the above settings during the run, or pauses manually, the run becomes **non-submittable** (but may still be completed normally).

### Archive + submission rule

- Archive is playable, but leaderboard submission rules apply (v1 default):
  - Leaderboard is for **today’s Daily** only.
  - (If later expanded to archived submissions, must define season/dated boards.)

### Anti-cheat level (v1): Medium

- Server validates puzzle identity/date, completion validity, and sanity-checks time.
- Client time is accepted but flagged for anomalies.

## Identity & profiles

### Display identity

- Auto-generated default display name.
- User can set nickname.
- Optional avatar color/icon.

### Visibility

- **Minimal public**
  - Leaderboards: display name + avatar + completion time.
  - No public/browsable profiles.

## Accounts & authentication (v1)

- Optional sign-in; guest play supported.
- Supported auth methods:
  - **Sign in with Apple**
  - **Sign in with Google**
  - **Email magic link**
- Account linking supported (recommended).

## Sync & offline

### Offline requirements

- Fully playable offline (Daily + Free Play + autosave).
- Sync resumes automatically when online.

### Sync scope (must sync)

- Settings
- In-progress puzzle state (board, notes, timer state)
- History & stats
- Progression/unlocks (if present)
- Favorites/bookmarks

## Player stats & history (v1)

### Definitions

- **Game played**: a puzzle is started (Daily or Free Play).
- **Win**: a puzzle is completed successfully.
- **Loss**: a puzzle ends in failure (e.g., lives reaches 0 when lives are limited).
- **Abandoned**: a puzzle is started but not finished (tracked separately; does not count as a loss unless explicitly failed).
- **Win rate**: wins / (wins + losses). (Abandoned is excluded from the denominator.)

### Stats to track (minimum)

- **Overall**
  - Games played, wins, losses, win rate
  - Daily streak (current, best)
  - Total time played
  - Assisted vs unassisted counts (and percent)
- **By difficulty** (Easy/Medium/Hard/Expert/Master/Extreme)
  - Games played
  - Wins, losses, win rate
  - Best time
  - Average time and median time
  - Hint usage rate (avg hints per game; percent of games with hints)
- **Daily results**
  - Per day status: not started / in progress / completed
  - Completion time
  - Assisted vs unassisted
  - Competitive eligible vs not eligible (for today’s daily)

### Stats visualizations (v1)

- **Difficulty table**: row per difficulty with games played, wins, win%, best time, average time
- **Time distribution graph**: histogram or density plot of completion times, filterable by difficulty
- **Daily history**: list/calendar-style history of daily outcomes + times

### Conflict policy

- **Last write wins** for conflicts (with careful record design to avoid puzzle state corruption).

## Favorites/bookmarks

- Favorite puzzles (daily or free play) and sync favorites across devices.

## Analytics, crash reporting, and privacy

### Telemetry stance (v1)

- **Analytics + crash reporting enabled**.

### Required privacy controls (in-app)

- Analytics opt-out (where feasible)
- Request data export
- Delete account (and cloud data)
- Clear local data

## Accessibility (v1)

- Color-blind safe highlighting (never color-only).
- Text scaling support.
- Sound/haptics toggles.

## Localization & compliance

- English only (v1).
- North America focus; privacy policy required plus in-app controls above.

## App structure & primary screens (v1)

### Navigation (recommended)

- **Home** (Daily + Continue + quick start)
- **Play** (Free Play + Adaptive)
- **Leaderboard** (Daily)
- **Settings/Profile**

### Home emphasis

- **Daily first**, then Continue, then Free Play.

### Onboarding

- Play-first guest flow.
- Prompt sign-in after first value moment (first completion or when using sync/leaderboards).
- Light contextual tips + Help screen (no forced tutorial puzzle).

## Screens, menus, and settings (v1)

- **Screens & menus (detailed)**: `docs/sudoku-screens-and-menus-v1.md`
- **Settings (detailed)**: `docs/sudoku-settings-v1.md`

The PRD defines functional requirements and policies; detailed UI inventories live in the docs above to keep requirements modular and cross-referenced.

## Non-functional requirements (v1 targets — moderate)

### Performance

- **Mobile cold start → Home interactive**: p50 ≤ **2.0s**, p95 ≤ **5.0s**
- **Web initial load → interactive**: p50 ≤ **2.5s**, p95 ≤ **6.0s**
- **Gameplay input → UI update**: p95 ≤ **50ms**
- **Free Play puzzle generation**: p50 ≤ **300ms**, p95 ≤ **1.5s**
  - If slower: show non-blocking loading and allow cancel/back.

### Reliability & durability

- Autosave persists latest action within **≤ 1s**.
- No progress loss after restart/crash (restore last autosave).

### Offline & sync

- Typical sync completion within **≤ 10s** after reconnect.
- Robust retry/backoff and safe conflict handling.

### Stability

- **Crash-free sessions** ≥ **99.5%** per release.

### Backend availability (if/when used)

- Monthly uptime target **99.9%**
- Leaderboard submission API: p95 ≤ **500ms** (excluding client network variability)

### Privacy on pause/background

- Board hidden within **≤ 200ms** of pause/background event.

## Future phase placeholders (explicit)

- Monetization.
- Additional Sudoku variants/sizes.
- Notifications.
- Strong anti-cheat.
- Friends / social features.
- Public profiles and broader social discovery.
