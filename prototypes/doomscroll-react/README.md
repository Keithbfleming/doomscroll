# DoomScroll — React Prototype

A high-fidelity mobile prototype exploring mindful social media consumption. Built as part of CS6750 (HCI) coursework.

The app wraps a simulated Instagram feed behind a **Pre-Session gate** (intention setting + earned time balance) and overlays real-time wellness nudges during scrolling. A **Dashboard** surfaces post-session analytics, mood tracking, and settings.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 19 (Vite 8) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite` plugin) |
| State | `useReducer` + React Context (`AppContext`) |
| Persistence | `localStorage` (`doomscroll_v1` key) |
| Build | Vite |

No external component libraries. No routing library (screen state lives in the global reducer).

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

### Install & Run

```bash
# From the repo root
cd prototypes/doomscroll-react

npm install
npm run dev
```

The dev server starts on **http://localhost:3901** (configured in `.claude/launch.json`).

Open in a browser. On desktop, the app renders inside a 390×844 px phone frame — designed for iPhone 15 Pro viewport.

### Other Scripts

```bash
npm run build    # Production build → dist/
npm run preview  # Serve the production build locally
npm run lint     # ESLint check
```

### Reset Demo Data

To reset the app to its seed state (wipe localStorage), run in the browser console:

```js
localStorage.removeItem('doomscroll_v1'); location.reload();
```

---

## Project Structure

```
src/
├── main.jsx                  # React DOM entry point
├── App.jsx                   # Root: PhoneFrame + Router + AppProvider
├── index.css                 # Tailwind base + custom utilities & animations
│
├── context/
│   └── AppContext.jsx         # Global state (useReducer), session timer, useApp() hook
│
├── lib/
│   ├── storage.js             # localStorage adapter: loadState, saveState, seed data
│   └── mockData.js            # Deterministic mock posts, stories, users, wellness facts
│
├── screens/                  # Full-screen views (routed by state.screen)
│   ├── PreSession.jsx         # Balance card + intention selector + confirm modal gate
│   ├── Feed.jsx               # Instagram-style infinite scroll feed
│   ├── Dashboard.jsx          # Analytics, mood, settings
│   ├── SessionPanel.jsx       # Slide-up session summary overlay (inside Feed)
│   └── MentalBreak.jsx        # 5-minute dark-mode break screen
│
└── components/               # Reusable UI pieces
    ├── index.js               # Barrel export
    ├── BalanceCard.jsx        # Earned minutes card on PreSession
    ├── ConfirmationModal.jsx  # Bottom-sheet modal (before entering feed)
    ├── DashboardShortcut.jsx  # Nav button → dashboard (used in PreSession header)
    ├── HealthIcon.jsx         # Floating health status button (blue→red, pulse when over time)
    ├── IntentionList.jsx      # Intention chip grid + custom text input
    ├── PostCard.jsx           # Instagram post (image/video, double-tap like, bookmark)
    ├── StoriesRow.jsx         # Horizontal stories strip with ring indicators
    └── Timebar.jsx            # Session progress bar (remaining time, fills to red)
```

---

## How It Works

### Screen Flow

```
PreSession ──────────────► Feed ──────► SessionPanel (overlay)
    │  (enablePreSession=false)              │
    │                                        ├──► MentalBreak
    └──────────────────────────────────────► Dashboard
```

1. **PreSession** — shown on app open. If `enablePreSession` is off in settings, the screen is bypassed automatically and the session starts immediately with the full earned balance.
2. **Feed** — simulated Instagram feed. Timer bar and health icon appear as overlays. Tapping the health icon opens **SessionPanel**.
3. **SessionPanel** — slide-up sheet showing time spent, scroll distance, opportunity costs, and a mood picker. Buttons navigate to Mental Break or Dashboard.
4. **MentalBreak** — 5-minute dark screen with a wellness fact. Returns to Feed automatically when the countdown ends.
5. **Dashboard** — analytics (weekly chart, goal ring, mood history) and settings panel.

### State Management

All app state lives in `AppContext.jsx` via `useReducer`. Key slices:

| Slice | Description |
|---|---|
| `screen` | Active screen: `'preSession'`, `'feed'`, `'dashboard'` |
| `session` | Running session data: elapsed seconds, post counts, timeGoal, mood |
| `persisted` | Data loaded from localStorage: balance, activities, weekly history |
| `intentions` | Selected intention chips (PreSession) |
| `showConfirmModal` | Whether the pre-session confirmation sheet is open |
| `showSessionPanel` | Whether the in-feed session panel is open |

To access state anywhere in the component tree:

```jsx
import { useApp } from '../context/AppContext';

function MyComponent() {
  const { state, dispatch } = useApp();
  // read from state, send actions with dispatch({ type: 'ACTION_TYPE', ...payload })
}
```

### Session Timer

The timer is driven by a `setInterval` inside `AppContext`. On `START_SESSION`, an interval fires a `TICK` action every second. On `END_SESSION`, the interval is cleared. Elapsed time is calculated from `Date.now()` deltas (not a simple counter) so it stays accurate even if the tab is backgrounded briefly.

### Data Persistence

`src/lib/storage.js` handles all localStorage reads/writes under the key `doomscroll_v1`.

On first load, the app seeds localStorage with realistic demo data:
- `earnedBalance`: 12 minutes
- `earningActivities`: 8 activities (Steps, Mindfulness, Reading, etc.)
- `weeklyGoal`: 120 minutes
- 7-day usage and mood history

### Mock Feed Data

`src/lib/mockData.js` generates deterministic fake Instagram posts using seeded randomization (`Math.sin`-based). Posts are consistent across reloads. The infinite scroll loads in batches of 8 with a 500ms simulated delay.

---

## Key Design Decisions

- **No routing library** — screen changes are reducer actions (`SET_SCREEN`), keeping the prototype self-contained without browser URL history complexity.
- **`absolute` overlays, not `fixed`** — all modals/overlays use `position: absolute` so they stay constrained inside the 390×844 phone frame (`overflow: hidden`). Using `fixed` would break out of the frame on desktop.
- **`h-full` on screens** — the phone frame has a fixed pixel height. Screens use `h-full` (not `min-h`) so content fills exactly the frame without creating scrollable overflow outside.
- **Barrel exports** — `src/components/index.js` uses direct `export { default as X }` re-exports (not import-then-re-export) to avoid Vite module graph cache confusion.

---

## Settings Reference

All settings are stored as part of the `persisted` object in localStorage.

| Key | Default | Description |
|---|---|---|
| `enablePreSession` | `true` | Show the intention + confirm gate before entering feed. When `false`, tapping "Open Instagram" jumps directly to the feed. |
| `enableOverlay` | `true` | Show timer bar + health icon during feed session |
| `weeklyGoal` | `120` | Weekly screen time budget in minutes |
| `earningActivities[n].enabled` | varies | Toggle which activities count toward earned balance |
