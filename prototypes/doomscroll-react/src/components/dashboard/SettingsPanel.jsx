import { useState } from 'react';
import { Toggle } from '../ui';
import { CollapsibleSection } from '../ui';

/**
 * Collapsible settings panel rendered as a card inside the Dashboard.
 * Settings changes are held in-memory (via UPDATE_SETTING dispatch) until
 * the user explicitly taps "Save Settings", which dispatches COMMIT_SETTINGS.
 * This avoids partial saves and gives users a clear confirmation step.
 *
 * @param {object} props
 * @param {object} props.persisted - Current in-memory persisted state (may have unsaved changes).
 * @param {function} props.dispatch - AppContext dispatch function.
 */
export default function SettingsPanel({ persisted, dispatch }) {
  const [open, setOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [saved, setSaved] = useState(false); // drives the toast

  const {
    enablePreSession,
    enableTimerBar,
    enableHealthIcon,
    mentalBreakMins,
    weeklyGoal,
    earningActivities,
    earnedBalance,
  } = persisted;

  /**
   * Commits all in-memory settings changes to localStorage and shows a toast.
   * The toast auto-dismisses after 2 seconds.
   */
  function handleSave() {
    dispatch({ type: 'COMMIT_SETTINGS' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const enabledCount = earningActivities.filter(a => a.enabled).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Collapsible header — chevron rotates when open */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <span className="font-semibold text-gray-900 text-sm">⚙️  Settings</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Animated expand/collapse — keeps the DOM mounted so form state is preserved */}
      <CollapsibleSection open={open}>
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100">

          {/* Pre-session nudge */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-sm font-medium text-gray-800">Pre-session nudge</p>
              <p className="text-xs text-gray-400">Set intentions before opening Instagram</p>
            </div>
            <Toggle
              value={enablePreSession}
              onChange={v => dispatch({ type: 'UPDATE_SETTING', key: 'enablePreSession', value: v })}
              label="Toggle pre-session nudge"
            />
          </div>

          {/* In-session timer bar (split from old enableOverlay) */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">In-session timer bar</p>
              <p className="text-xs text-gray-400">Shows remaining time progress at the top</p>
            </div>
            <Toggle
              value={enableTimerBar}
              onChange={v => dispatch({ type: 'UPDATE_SETTING', key: 'enableTimerBar', value: v })}
              label="Toggle in-session timer bar"
            />
          </div>

          {/* In-session health icon (split from old enableOverlay) */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">In-session health icon</p>
              <p className="text-xs text-gray-400">Floating status button and break access</p>
            </div>
            <Toggle
              value={enableHealthIcon}
              onChange={v => dispatch({ type: 'UPDATE_SETTING', key: 'enableHealthIcon', value: v })}
              label="Toggle in-session health icon"
            />
          </div>

          {/* Mental break duration stepper */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Mental break duration</p>
              <p className="text-xs text-gray-400">Minutes for the wellness break countdown</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch({ type: 'UPDATE_SETTING', key: 'mentalBreakMins', value: Math.max(1, mentalBreakMins - 1) })}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold"
              >−</button>
              <span className="text-sm font-semibold w-6 text-center">{mentalBreakMins}</span>
              <button
                onClick={() => dispatch({ type: 'UPDATE_SETTING', key: 'mentalBreakMins', value: Math.min(60, mentalBreakMins + 1) })}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold"
              >+</button>
            </div>
          </div>

          {/* Weekly goal stepper */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Weekly goal</p>
              <p className="text-xs text-gray-400">Total minutes per week</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch({ type: 'UPDATE_SETTING', key: 'weeklyGoal', value: Math.max(15, weeklyGoal - 15) })}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold"
              >−</button>
              <span className="text-sm font-semibold w-10 text-center">{weeklyGoal}</span>
              <button
                onClick={() => dispatch({ type: 'UPDATE_SETTING', key: 'weeklyGoal', value: Math.min(600, weeklyGoal + 15) })}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold"
              >+</button>
            </div>
          </div>

          {/* Earning activities — collapsible sub-section, collapsed by default */}
          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={() => setActivitiesOpen(o => !o)}
              className="w-full flex items-center justify-between"
            >
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Earning Activities
              </p>
              <div className="flex items-center gap-2">
                {/* Summary shown when collapsed */}
                {!activitiesOpen && (
                  <span className="text-xs text-gray-400">
                    {enabledCount} enabled · {earnedBalance} min earned
                  </span>
                )}
                <svg
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${activitiesOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            <CollapsibleSection open={activitiesOpen}>
              <div className="space-y-2 mt-3">
                {earningActivities.map(a => (
                  <div key={a.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-800">{a.label}</p>
                      <p className="text-xs text-gray-400">{a.detail} · +{a.minutes} min</p>
                    </div>
                    <Toggle
                      value={a.enabled}
                      onChange={() => dispatch({ type: 'TOGGLE_ACTIVITY', id: a.id })}
                      label={`Toggle ${a.label}`}
                    />
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold mt-2"
          >
            Save Settings
          </button>

          {/* Toast confirmation — absolute so it doesn't shift layout */}
          {saved && (
            <div className="text-center">
              <span className="inline-block bg-gray-900 text-white text-xs px-4 py-1.5 rounded-full">
                Settings saved ✓
              </span>
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );
}
