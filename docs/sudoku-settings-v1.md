### Sudoku v1 — Settings (Detailed)

## References

- Master requirements (PRD): `docs/sudoku-prd-v1.md`
- Screens & menus: `docs/sudoku-screens-and-menus-v1.md`

## Requirements (apply to all settings)

- Every setting must include an in-UI **tooltip/help text** with simple, clear explanations.
- Settings changes apply immediately unless otherwise noted.
- Any setting that impacts Daily leaderboard eligibility must clearly indicate whether it is required for **Competitive Daily**.

## Appearance

- **Theme**: System / Light / Dark

## Audio & haptics

- **Sound**: On/Off
- **Haptics**: On/Off

## Accessibility

- **Text size override**: Default / Larger / Largest (or a bounded slider)

## Gameplay

- **Timer default**: On/Off
- **Show timer**: On/Off (if timer enabled)
- **Zen mode**: On/Off
  - Definition (v1): Zen mode removes “pressure” mechanics (e.g., intended to be played without competition constraints) and disables Daily leaderboard submission.
- **Lives**: 0–10 or Infinity (slider)
  - Definition (v1): Lives represent allowed incorrect placements against the solution; when lives are limited, incorrect placements decrement lives. Infinity tracks mistakes without failing the run.

## Assists

- **Highlighting**: On/Off
- **Conflict highlighting**: On/Off
- **Auto-remove notes**: On/Off
- **Auto candidates**: On/Off
  - Definition (v1): auto-update pencil marks/candidates dynamically after every placement.
- **Error prevention**: Off / Duplicates-only / Strict-vs-solution

## Hints & checking

- **Hints enabled**: On/Off (availability may vary by difficulty, including Extreme)
- **Hint type selector** (controls which hint actions are offered and/or their ordering):
  - Direct number placement
  - Logic-based guidance
  - Highlight candidates / safe numbers
  - Escalating assistance (progressively stronger help if the user repeats hints)
- **Check solution enabled**: On/Off

## Input

- **Notes input behavior**: Notes mode toggle vs long-press for notes
- **Auto-advance after keyboard entry**: On/Off (web; may also apply to external keyboards on mobile)
- **Left-handed mode**: On/Off (keypad placement/reachability)

## Idle behavior

- **Auto-pause on idle**: On/Off
- **Idle timeout**: 30s–10m (slider; enabled only when Auto-pause on idle is On)
- Note: Competitive Daily forces Auto-pause on idle Off.

## Game board sizing

- **Grid size**: slider (with preview)
- **Input number size**: slider (with preview)
- **Notes size**: slider (with preview)
- **Preview**: 3x3 preview grid showing the effect of sizing changes

## Competitive Daily

- **Competitive Daily preset**: On/Off
  - Definition (v1): one-tap preset that forces leaderboard-eligible settings when starting the Daily puzzle.

## Account

- Sign in / Sign out
- Linked providers: Apple / Google / Email magic link
- Sync status (read-only): last sync time / errors

## Privacy & data

- Analytics opt-out (where feasible)
- Export my data
- Delete account (and cloud data)
- Clear local data
