### Sudoku v1 — Screens & Menus (Detailed)

## References

- Master requirements (PRD): `docs/sudoku-prd-v1.md`
- Settings (detailed): `docs/sudoku-settings-v1.md`

## Notes

- This is a **unified** screen list for web + mobile; platform-specific differences are called out per screen.
- Friends/social screens are **out of scope for v1** (see PRD “Future phase placeholders”).

## Global navigation (v1)

- Primary destinations:
  - **Home**
  - **Play**
  - **Leaderboard**
  - **Settings/Profile**
- Common/global UI elements:
  - Top app bar (title, back, optional overflow menu)
  - Offline indicator + sync status (where applicable)
  - Toasts/snackbars for confirmations and errors

## 1) Launch & onboarding

### 1.1 Splash / Launch

- App logo/wordmark
- Loading indicator (if needed)

### 1.2 First-run onboarding (light)

- Welcome header + short tips (1–3)
- CTA: Start playing (guest)
- Secondary: Sign in
- Links: Privacy policy

## 2) Home (Daily-first)

### 2.1 Home screen

- Daily card (primary):
  - Date
  - Status: not started / in progress / completed
  - CTA: Start / Continue / View results
  - Entry point for **Competitive Daily** (leaderboard-eligible flow)
- Streak summary (current streak, best streak optional)
- Continue module (list up to 3 in-progress puzzles)
- Quick play:
  - New Free Play
  - Adaptive
- “View Daily archive” entry

### 2.2 Daily Archive screen

- Month/date navigation
- List/grid of daily entries with:
  - Date
  - Completion status
  - Best time
  - Assisted/unassisted indicator
- Archive note:
  - Today’s leaderboard submission is only for today’s Daily.

### 2.3 Daily mode chooser (modal/screen)

- “Play Competitive” CTA (forces Competitive Daily preset; see settings doc)
- “Play Casual” CTA
- Eligibility explanation tooltip/help

## 3) Play (Free Play + Adaptive + Coming soon)

### 3.1 Play screen

- Free Play difficulty cards:
  - Easy / Medium / Hard / Expert / Master / Extreme
- Adaptive entry:
  - Start Adaptive
  - Display current adaptive band/rating
- Game types placeholder:
  - “Coming soon!” (non-interactive)

### 3.2 New puzzle confirm (modal)

- Selected mode/difficulty
- Optional quick toggles (as allowed by v1 settings)
- CTA: Start

## 4) Game (core gameplay)

### 4.1 Game screen

- Top bar:
  - Back (with Save & exit confirmation)
  - Puzzle label (Daily/Free Play + difficulty/date)
  - Timer
  - Pause
- Status strip (as applicable):
  - Lives (∞ or number)
  - Zen mode indicator
  - Competitive indicator (for Competitive Daily)
- Sudoku grid:
  - Prefilled styling
  - Selection highlight
  - Row + column + 3x3 box highlighting on selection (prefilled or empty)
  - Same-number highlighting when selected cell has a value
  - Notes display (pencil marks)
- Numpad:
  - Digits 1–9
  - Digit disabled when fully completed on the board (all 9 correct placements)
  - Clear/erase
  - Undo/redo
  - Notes mode toggle (if implemented as in-game control)
  - **Digit lock toggle** (locks selected digit so tapping an empty cell places it)
- Action buttons (row or overflow):
  - Hints
  - Check/validate
  - (Optional) in-game settings shortcut

### 4.2 Hints menu (modal/sheet)

- Hint categories/types (see settings doc):
  - Direct number placement
  - Logic-based guidance
  - Highlight candidates / safe numbers
  - Escalating assistance
- “Marks run assisted” disclosure (where applicable)

### 4.3 Check solution menu (modal/sheet)

- Check selected cell / check whole board (if supported)
- “Marks run assisted” disclosure

### 4.4 Pause overlay/menu

- Board hidden
- Resume
- Restart (confirm)
- Quit to Home (confirm autosave)
- Settings shortcut (optional)

### 4.5 Completion screen (modal/full-screen)

- Outcome: Completed (or Failed if lives hit 0)
- Stats: time, difficulty, date (if daily), assisted/unassisted, hint usage summary
- CTAs:
  - Back to Home
  - New Free Play
  - View Leaderboard (if eligible)

### 4.6 Competitive eligibility banner (in-game)

- If competitive requirements are violated (pause used or an assist enabled):
  - Banner: “Leaderboard eligibility lost”
  - Tooltip shows which setting/action caused it

## 5) Leaderboard (Daily)

### 5.1 Leaderboard screen

- Today’s date
- Ranked list: rank, avatar, name, time
- Highlight “You” row (if present)
- Submit CTA shown only when:
  - user is signed in
  - daily is completed
  - run is eligible

### 5.2 Submission modal

- Eligibility summary
- Submit action + success/failure states

## 6) Settings / Profile

### 6.1 Profile landing

- Display name + avatar
- Edit profile
- Sync status summary
- Stats summary tiles (top-level)

### 6.2 Stats screens

- Overview:
  - Games played, wins, losses, win rate
  - Current/best daily streak
  - Assisted vs unassisted counts
- By difficulty table:
  - games played, wins, win%, best time, avg time
- Time distribution graph:
  - filter by difficulty
- Daily history:
  - list/calendar of daily results (time + assisted/unassisted)

### 6.3 Settings categories list

- Link-out into categories in `docs/sudoku-settings-v1.md`:
  - Appearance, Audio & haptics, Accessibility, Gameplay, Assists, Hints & checking, Input, Idle behavior, Board sizing, Competitive Daily, Account, Privacy & data

### 6.4 Account screens

- Sign in / sign out
- Linked providers
- Error states and re-auth flows

### 6.5 Privacy & data screens

- Analytics opt-out (where feasible)
- Export data
- Delete account (confirmations)
- Clear local data (confirmations)

## 7) System & error states

- Offline banner + “Working offline”
- Sync error banner + retry
- Generic error screen (unexpected error)
- Web route not found (if applicable)
