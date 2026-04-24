# DoomScroll — Refactor & Feature Plan

This document covers the planned refactor of the React prototype and a set of quality-of-life improvements. Everything here is designed to be executed incrementally — each phase can be shipped independently.

---

## Guiding Principles

- **Composition over monoliths** — every screen should be an assembly of focused components, not a single long file.
- **Single responsibility** — each component does one thing. Sub-components inside screen files should be extracted to `src/components/`.
- **Document at the source** — JSDoc on every exported function and component, inline comments on non-obvious logic. No separate doc files; the code is the documentation.
- **Explicit over implicit** — settings changes must be deliberate (require a save action), not fire-and-forget on toggle.

---

## Phase 1 — Documentation Pass

Before refactoring, document the existing codebase so intent is clear during restructuring.

### JSDoc Conventions

Every exported component and function gets a JSDoc block:

```js
/**
 * Displays the user's earned balance and a list of active earning activities.
 *
 * @param {object} props
 * @param {number} props.earnedBalance - Minutes earned today across all enabled activities.
 * @param {Array<{label: string, detail: string, minutes: number}>} props.activeActivities
 *   Filtered list of earning activities that are currently enabled.
 */
export default function BalanceCard({ earnedBalance, activeActivities }) { ... }
```

### Files to Document

| File | What to document |
|---|---|
| `AppContext.jsx` | JSDoc on `reducer` (each `case` gets an inline comment), `AppProvider`, `useApp`, and the initial state shape |
| `storage.js` | JSDoc on `loadState`, `saveState`, `addSessionMinutes`, `setTodayMood`, `getTodayIndex`; document the `SEED_DATA` object shape with inline field comments |
| `mockData.js` | JSDoc on `generatePost`, `seededRand`; comment the seeding strategy |
| All `components/*.jsx` | JSDoc on component + all props |
| All `screens/*.jsx` | JSDoc on the screen component + key handler functions |

### Inline Comment Guidelines

- Comment the **why**, not the **what**: `// lerp ensures smooth color transition without jarring jumps` not `// interpolate colors`.
- Mark intentional design choices: `// absolute (not fixed) — must stay inside the phone-frame overflow:hidden container`.
- Flag known quirks: `// setInterval fires TICK; elapsed is computed from Date.now() delta, not a counter, to avoid drift`.

---

## Phase 2 — Component Decomposition

### Current Problem

`Dashboard.jsx` and `SessionPanel.jsx` define private sub-components (e.g., `WeeklyChart`, `GoalRing`, `DonutChart`, `Toggle`) directly inside the screen file. This makes the files long, the sub-components untestable in isolation, and the screen component hard to read.

### Target Folder Structure

```
src/
├── components/
│   ├── ui/                         # Generic, app-agnostic primitives
│   │   ├── Toggle.jsx              # On/off switch (extracted from Dashboard)
│   │   ├── CollapsibleSection.jsx  # Animated expand/collapse wrapper
│   │   └── index.js
│   │
│   ├── dashboard/                  # Dashboard-specific display components
│   │   ├── WeeklyChart.jsx         # Bar chart of daily usage (extracted from Dashboard)
│   │   ├── GoalRing.jsx            # SVG circular progress ring (extracted from Dashboard)
│   │   ├── MoodHistory.jsx         # Mood emojis + insight recommendation (redesigned)
│   │   ├── SessionHighlights.jsx   # Longest session, count, average (extracted)
│   │   ├── ContentBreakdown.jsx    # DonutChart + category bars (extracted)
│   │   ├── SettingsPanel.jsx       # Collapsible settings section (extracted)
│   │   └── index.js
│   │
│   ├── session/                    # SessionPanel sub-components
│   │   ├── StatGrid.jsx            # Time / posts / video / photo grid (extracted)
│   │   ├── OpportunityCosts.jsx    # Distance + time metaphors (extracted)
│   │   ├── MoodPicker.jsx          # 5-emoji mood selector (extracted)
│   │   └── index.js
│   │
│   ├── feed/                       # Feed sub-components
│   │   ├── FeedHeader.jsx          # Instagram top bar (extracted from Feed)
│   │   └── BottomNav.jsx           # Bottom tab bar (extracted from Feed)
│   │
│   # existing flat components remain (PostCard, StoriesRow, etc.)
│   ├── BalanceCard.jsx
│   ├── ConfirmationModal.jsx
│   ├── DashboardShortcut.jsx
│   ├── HealthIcon.jsx
│   ├── IntentionList.jsx
│   ├── PostCard.jsx
│   ├── StoriesRow.jsx
│   ├── Timebar.jsx
│   └── index.js                   # Re-exports everything (flat + subdirectories)
```

### Extraction Plan

#### `Dashboard.jsx`

Current file contains ~300+ lines with four private sub-components. After extraction, `Dashboard.jsx` becomes a layout compositor:

```jsx
// Dashboard.jsx — after refactor (illustrative, not final code)
import WeeklyChart from '../components/dashboard/WeeklyChart';
import GoalRing from '../components/dashboard/GoalRing';
import MoodHistory from '../components/dashboard/MoodHistory';
import SessionHighlights from '../components/dashboard/SessionHighlights';
import ContentBreakdown from '../components/dashboard/ContentBreakdown';
import SettingsPanel from '../components/dashboard/SettingsPanel';

export default function Dashboard() {
  const { state, dispatch } = useApp();
  // ...
  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
      <DashboardHeader />
      <GoalRing ... />
      <WeeklyChart ... />
      <MoodHistory ... />
      <SessionHighlights ... />
      <ContentBreakdown ... />
      <SettingsPanel ... />
    </div>
  );
}
```

#### `SessionPanel.jsx`

Current file is a single large JSX return (~120 lines). After extraction:

```jsx
// SessionPanel.jsx — after refactor
import StatGrid from '../components/session/StatGrid';
import OpportunityCosts from '../components/session/OpportunityCosts';
import MoodPicker from '../components/session/MoodPicker';

export default function SessionPanel({ onClose, onBreak, onDashboard }) {
  const { state } = useApp();
  return (
    <div ...>
      <StatGrid session={state.session} />
      <OpportunityCosts session={state.session} />
      <MoodPicker onSelect={mood => dispatch({ type: 'SET_MOOD', mood })} />
      <ActionButtons onBreak={onBreak} onDashboard={onDashboard} />
    </div>
  );
}
```

#### `Feed.jsx`

Extract the Instagram header and bottom nav — they have no logic dependencies and are pure layout:

```jsx
// FeedHeader.jsx — Instagram-style top bar
// BottomNav.jsx  — 5-icon bottom tab strip
```

#### `Toggle.jsx` (new ui primitive)

The `Toggle` component defined inside `Dashboard.jsx` is generic enough to live in `components/ui/`. It should accept `value`, `onChange`, and optionally a `label` prop, so it can be reused in settings contexts everywhere.

---

## Phase 3 — Quality of Life Fixes

### Fix 1 — End-of-Session Timer Reliability

**Problem:** The session timer (`setInterval` in `AppContext`) sometimes fails to start or starts with a delay.

**Root cause:** The interval is created inside a `useEffect` that depends on `session.running`. If `START_SESSION` dispatches and React batches the state update, the effect may not fire in the same tick as expected. Additionally, if a previous session's `clearInterval` races with the new `START_SESSION`, the new interval can be skipped.

**Fix:**
- Move the interval ref (`intervalRef`) and its setup/teardown into a dedicated `useEffect` that only watches `session.running`.
- Guard against double-start: check `intervalRef.current` before creating a new interval.
- On `END_SESSION`, ensure `clearInterval` is called synchronously before the state updates.

```js
// In AppContext.jsx
useEffect(() => {
  if (!state.session.running) return;

  // Clear any existing interval before starting a new one
  if (intervalRef.current) clearInterval(intervalRef.current);

  intervalRef.current = setInterval(() => {
    dispatch({ type: 'TICK', now: Date.now() });
  }, 1000);

  return () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };
}, [state.session.running]);
```

---

### Fix 2 — Mental Break: Confirm Before Returning to Feed

**Problem:** "Return early" exits the mental break immediately with no friction, which defeats the purpose.

**Fix:** When the user taps "Return early", show the existing `ConfirmationModal` with a time input asking how many more minutes they want to stay on break. The input defaults to 15 minutes. Confirming resets the countdown to the entered value rather than ending the break immediately.

```jsx
// MentalBreak.jsx — updated logic
const [showConfirm, setShowConfirm] = useState(false);
const [extraMins, setExtraMins] = useState(15);

function handleExtend() {
  setRemaining(extraMins * 60); // reset the countdown
  setShowConfirm(false);
}

// Replace direct onReturn() call:
<button onClick={() => setShowConfirm(true)}>Return early</button>

{showConfirm && (
  <ConfirmationModal
    title="Need more time?"
    onCancel={() => setShowConfirm(false)}
    onContinue={handleExtend}
    continueLabel="Extend break"
    cancelLabel="Return to feed"
    // cancelLabel triggers onReturn() — swap the roles so "cancel" = go back
  >
    <p>How many more minutes would you like?</p>
    <input
      type="number"
      value={extraMins}
      onChange={e => setExtraMins(parseInt(e.target.value) || 15)}
      min="1" max="60"
      className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm text-center"
    />
  </ConfirmationModal>
)}
```

> Note: In this flow, "Return to feed" (cancel) ends the break immediately, while "Extend break" (continue) resets the timer. `ConfirmationModal` will need `continueLabel` and `cancelLabel` props to override its default button text. A `title` prop also needs to be added to replace the hardcoded "Before you dive in" heading.

---

### Fix 3 — Mental Break: "Close App" → Fake iPhone Homescreen

**Problem:** There is no way for a user to "exit" the app during a mental break. The prototype should simulate closing the app.

**Plan:**
1. Add a "Close app" button to `MentalBreak.jsx`.
2. Dispatch `{ type: 'SET_SCREEN', screen: 'homescreen' }` when tapped.
3. Add a `HomeScreen` screen component that renders a minimal fake iPhone homescreen.
4. Add the `'homescreen'` case to the `Router` in `App.jsx`.

**HomeScreen component spec:**
- Dark wallpaper (blurred gradient or solid dark color).
- A 4×6 grid of fake app icons (just colored circles with emoji labels).
- Time displayed at the top (real clock from `new Date()`).
- The Instagram app icon — rendered with the real Instagram gradient logo — is included in the grid. Tapping it returns to the `'preSession'` screen (or skips to `'feed'` if `enablePreSession` is off), simulating re-opening the app.
- No other tappable icons — all other grid icons are decorative placeholders.
- No back button — the only re-entry point is the Instagram icon.

---

### Fix 4 — Dashboard: Settings Collapsed by Default

**Problem:** The settings panel is always open, making the Dashboard feel overwhelming on load.

**Fix:**
- Add local state `const [settingsOpen, setSettingsOpen] = useState(false)` to `Dashboard.jsx` (or to the new `SettingsPanel.jsx` component).
- Render a tappable header bar ("Settings ▾") that toggles `settingsOpen`.
- Wrap the settings content in the new `CollapsibleSection` component with a smooth `max-height` CSS transition.

**`CollapsibleSection` spec:**
```jsx
/**
 * Animated expand/collapse wrapper.
 * Uses max-height transition for smooth open/close without layout jumps.
 *
 * @param {object} props
 * @param {boolean} props.open - Whether the content is expanded.
 * @param {React.ReactNode} props.children
 */
export default function CollapsibleSection({ open, children }) {
  return (
    <div
      className="overflow-hidden transition-all duration-300"
      style={{ maxHeight: open ? '2000px' : '0px' }}
    >
      {children}
    </div>
  );
}
```

---

### Fix 5 — Split In-Session Overlay Into Two Toggles

**Problem:** The single `enableOverlay` setting controls both the timer bar and the health icon together. Users may want to disable the countdown timer (to reduce anxiety) while keeping the health icon for access to mental breaks.

**Storage changes:**
- Add `enableTimerBar: true` (replaces/supplements `enableOverlay` for the timer bar).
- Add `enableHealthIcon: true` (separate toggle for the floating health icon).
- Keep `enableOverlay` for backward compatibility, or migrate it as the default for both.

**Settings UI changes (in `SettingsPanel.jsx`):**
```
[ ] In-session timer bar      — shows remaining time progress
[ ] In-session health icon    — floating status button + mental break access

Mental break duration: [  5  ] minutes   (stepper, min 1 – max 60)
```

The mental break duration stepper mirrors the weekly goal stepper pattern already in the settings panel. The stored value (`mentalBreakMins`) is read by `MentalBreak.jsx` to set its initial countdown instead of the current hardcoded `5 * 60`.

**Feed.jsx changes:**
- Conditionally render `<TimerBar />` based on `persisted.enableTimerBar`.
- Conditionally render `<HealthIcon />` based on `persisted.enableHealthIcon`.

**AppContext changes:**
- Update `SAVE_SETTINGS` action to handle both new keys.
- Update `SEED_DATA` in `storage.js` to include both flags.

---

### Fix 6 — Earning Activities: Collapsible, Hidden by Default

**Problem:** The earning activities list (8 toggles) is visible by default in settings, adding visual weight before users are invested in that feature.

**Options (choose one):**
- **Option A** — Keep it inside `SettingsPanel` but wrap in a `CollapsibleSection` with its own "Earning Activities ▾" subheader.
- **Option B** — Give it a dedicated collapsible section outside of settings (between the balance card and the main settings block), so it feels more like a feature section than a configuration option.

**Recommended: Option A** for now, since it keeps settings grouped. The collapsible header should show a summary when collapsed: "8 activities enabled · 12 min earned".

---

### Fix 7 — Settings: Explicit Save Flow

**Problem:** Settings changes (toggles, goal edits) currently save to localStorage immediately on each change. This means there's no way to cancel, and the UX gives no confirmation that a change persisted.

**Fix:**
1. Remove the `saveState()` call from `TOGGLE_ACTIVITY`, `SAVE_SETTINGS`, and any other action that writes on every interaction.
2. Keep all settings changes in the reducer's in-memory `persisted` state only until the user explicitly saves.
3. Add a "Save Settings" button at the bottom of the settings panel.
4. On save, dispatch `{ type: 'COMMIT_SETTINGS' }` which calls `saveState(persisted)` and shows a confirmation toast.

**Toast spec:**
- Small pill at the bottom of the phone frame: "Settings saved ✓"
- Auto-dismisses after 2 seconds.
- Implement as local state in `SettingsPanel.jsx` — no need for global state.

**New action: `COMMIT_SETTINGS`**
```js
case 'COMMIT_SETTINGS':
  saveState(state.persisted); // write to localStorage
  return state; // no state change — just the side effect
```

> Note: With this change, settings changes that haven't been saved are lost if the user navigates away. That's intentional — add a "discard changes?" guard if that becomes a problem.

---

### Fix 8 — Dashboard: Redesigned Mood History with Recommendations

**Problem:** The current mood row is a static list of emoji circles with no insight. The reference screenshots show:
1. A **Mood After Sessions** card: emoji per day, duration shown below each, highlighted border on today, with a recommendation callout if mood is trending down.
2. A **Weekly Goal** ring and bar as a separate card from the weekly breakdown bar chart.

**`MoodHistory.jsx` spec:**

```
┌─────────────────────────────────────┐
│  Mood After Sessions                │
│                                     │
│  😐  😑  😐  😑  😶  😟           │
│ Tue Wed Thu Fri Sat Today           │
│ 15m 52m 19m 38m 26m 88m            │
│                                     │
│  ╔══════════════════════════════╗   │
│  ║ 📉 Your mood after sessions  ║   │
│  ║    has been dipping —        ║   │
│  ║    shorter sessions might    ║   │
│  ║    help.                     ║   │
│  ╚══════════════════════════════╝   │
└─────────────────────────────────────┘
```

**Recommendation logic** (inside `MoodHistory.jsx`):
```js
/**
 * Derives a recommendation string from the last 7 mood scores.
 * Returns null if there's not enough data to draw a conclusion.
 *
 * @param {Array<number|null>} moodHistory - 7-element array, 1=worst, 5=best, null=no entry
 * @param {Array<number>} weeklyData - Minutes per day (parallel to moodHistory)
 * @returns {string|null}
 */
function getMoodInsight(moodHistory, weeklyData) { ... }
```

Possible recommendations:
- Mood trending down over last 3 days → "Your mood after sessions has been dipping — shorter sessions might help."
- Mood consistently high → "You seem to be managing your screen time well this week."
- Mood low on days with high usage → "Your mood dips on heavier-use days — try setting a lower daily limit."
- Not enough data → `null` (hide the callout entirely)

**`GoalRing` as a standalone card:**

Separate the goal ring from the weekly chart. The goal card should show:
- The SVG ring (% of weekly goal used).
- "330 min used of 120 min/week" text.
- An "Edit goal" link that expands the stepper inline (collapses the settings panel's goal control — they should not duplicate).

---

## Phase 4 — State Shape Updates

All of the above features require changes to the `SEED_DATA` / persisted state shape in `storage.js`. Coordinate these changes together to avoid multiple migrations:

| New key | Type | Default | Needed for |
|---|---|---|---|
| `enableTimerBar` | `boolean` | `true` | Fix 5 |
| `enableHealthIcon` | `boolean` | `true` | Fix 5 |
| `mentalBreakMins` | `number` | `5` | Fix 5 + Fix 2 |

Remove or deprecate:
| Old key | Action |
|---|---|
| `enableOverlay` | Replace with `enableTimerBar` + `enableHealthIcon`. Set both to `true` if `enableOverlay` was `true`. |

Since this is a prototype with a known seed key (`doomscroll_v1`), a simple migration is sufficient: in `loadState()`, after reading from localStorage, check for the old key and backfill the new ones if missing.

```js
// In loadState(), after parsing:
if (parsed.enableOverlay !== undefined && parsed.enableTimerBar === undefined) {
  parsed.enableTimerBar = parsed.enableOverlay;
  parsed.enableHealthIcon = parsed.enableOverlay;
}
```

---

## Implementation Order

Suggested order to minimize merge conflicts and keep the app in a working state throughout:

1. **Documentation pass** (Phase 1) — no behavior changes, safe to do first.
2. **Timer reliability fix** (Fix 1) — high-impact, isolated to `AppContext.jsx`.
3. **`CollapsibleSection` + `Toggle` UI primitives** — needed by several later fixes.
4. **Settings: collapsed by default** (Fix 4) + **explicit save** (Fix 7) — do together since both touch `SettingsPanel`.
5. **Split overlay toggles** (Fix 5) + **earning activities collapsible** (Fix 6) — do together, same settings block.
6. **Mental break confirmation** (Fix 2) — isolated to `MentalBreak.jsx`.
7. **HomeScreen + close app** (Fix 3) — adds a new screen; touches `App.jsx` router.
8. **Dashboard component extraction** (Phase 2) — refactor only, no new behavior.
9. **Redesigned mood + goal cards** (Fix 8) — requires `MoodHistory.jsx` and updated `GoalRing.jsx`.
