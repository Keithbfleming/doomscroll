import { useApp } from '../context/AppContext';
import { getTodayIndex } from '../lib/storage';
import { DAY_NAMES } from '../lib/mockData';
import {
  WeeklyChart,
  GoalRing,
  MoodHistory,
  SessionHighlights,
  ContentBreakdown,
  SettingsPanel,
} from '../components/dashboard';

/**
 * Usage statistics and settings screen.
 * Acts as a thin compositor — all heavy UI is delegated to focused sub-components.
 * Can be reached from PreSession (shortcut) or from SessionPanel (end session).
 */
export default function Dashboard() {
  const { state, dispatch } = useApp();
  const { persisted } = state;

  // Render nothing while persisted state is still loading from localStorage
  if (!persisted) return null;

  const { weeklyData, weeklyGoal, moodHistory, sessionHistory } = persisted;
  const todayIndex = getTodayIndex();
  const totalUsed = weeklyData.reduce((a, b) => a + b, 0);

  /**
   * Navigates back to the appropriate previous screen.
   * If the user came from the feed (session active), go back there.
   * Otherwise fall back to the pre-session screen.
   */
  function handleBack() {
    if (state.prevScreen === 'feed') {
      dispatch({ type: 'GO_BACK' });
    } else {
      dispatch({ type: 'SET_SCREEN', screen: 'preSession' });
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-white border-b border-gray-200">
        <button onClick={handleBack} className="text-blue-500 flex items-center gap-1 text-sm font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-lg font-bold text-gray-900 flex-1">Dashboard</h1>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-10 px-4 pt-4 space-y-4">
        {/* Settings — collapsed by default (Fix 4) */}
        <SettingsPanel persisted={persisted} dispatch={dispatch} />
        
        {/* Goal ring — separate card from the weekly chart (Fix 8) */}
        <GoalRing
          used={totalUsed}
          goal={weeklyGoal}
          onGoalChange={val =>
            dispatch({ type: 'UPDATE_SETTING', key: 'weeklyGoal', value: val })
          }
        />

        {/* Weekly bar chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">Weekly Usage</p>
              <p className="text-xs text-gray-400">{totalUsed} min this week</p>
            </div>
          </div>
          <WeeklyChart weeklyData={weeklyData} weeklyGoal={weeklyGoal} todayIndex={todayIndex} />
          <div className="flex items-center gap-2 mt-3">
            <div className="w-2.5 h-2.5 rounded bg-blue-500" />
            <span className="text-[11px] text-gray-400">Today</span>
            <div className="w-2.5 h-2.5 rounded bg-gray-300 ml-3" />
            <span className="text-[11px] text-gray-400">Past days</span>
            <div className="w-2.5 h-2.5 rounded bg-red-400 ml-3" />
            <span className="text-[11px] text-gray-400">Over daily avg</span>
          </div>
        </div>

        {/* Mood history with recommendation callout (Fix 8) */}
        <MoodHistory
          moodHistory={moodHistory}
          weeklyData={weeklyData}
          dayNames={DAY_NAMES}
        />

        {/* Session highlights */}
        <SessionHighlights sessionHistory={sessionHistory} />

        {/* Content breakdown (donut + category bars) */}
        <ContentBreakdown sessionHistory={sessionHistory} />

      </div>
    </div>
  );
}
