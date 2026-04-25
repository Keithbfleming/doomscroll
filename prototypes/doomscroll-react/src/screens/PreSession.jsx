import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { saveState } from '../lib/storage';
import { BalanceCard, IntentionList, DashboardShortcut, ConfirmationModal } from '../components';

/**
 * Pre-session screen that prompts users to set an intention and review their
 * earned balance before opening the Instagram feed.
 *
 * If the user has disabled the pre-session nudge (enablePreSession = false),
 * this screen skips itself and fires START_SESSION immediately, using the
 * earnedBalance as the time goal.
 */
export default function PreSession() {
  const { state, dispatch } = useApp();
  const { persisted, intentions, customIntention, showConfirmModal } = state;

  const enablePreSession = persisted?.enablePreSession;

  // Auto-skip to feed if pre-session nudge is disabled in settings
  useEffect(() => {
    if (persisted && !enablePreSession) {
      dispatch({ type: 'START_SESSION', timeGoal: persisted.earnedBalance, persisted });
    }
  }, [persisted, enablePreSession]);

  // Show a spinner while state is loading or while auto-skip is in progress
  if (!persisted || !enablePreSession) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent spin-slow" />
      </div>
    );
  }

  const { earnedBalance, earningActivities } = persisted;
  const activeActivities = earningActivities.filter(a => a.enabled);

  /** Opens the time-goal confirmation modal. */
  function handleOpenInstagram() {
    dispatch({ type: 'SHOW_CONFIRM' });
  }

  /**
   * Persists the selected intention and starts the session with the given time goal.
   * Called by ConfirmationModal when the user taps "Continue".
   *
   * @param {number} timeGoal - Minutes the user plans to spend (from modal input or balance fallback).
   */
  function handleContinue(timeGoal) {
    const newPersisted = {
      ...persisted,
      lastIntention: intentions[0] || customIntention,
      sessionTimeGoal: timeGoal,
    };
    saveState(newPersisted);
    dispatch({ type: 'START_SESSION', timeGoal, persisted: newPersisted });
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">DoomScroll</h1>
          <p className="text-xs text-gray-400 mt-0.5">Mindful social media</p>
        </div>
        <DashboardShortcut />
      </div>

      {/* Balance card — shows earned minutes and contributing activities */}
      <BalanceCard
        earnedBalance={earnedBalance}
        activeActivities={activeActivities}
        onManageActivities={() =>
          dispatch({ type: 'SET_SCREEN', screen: 'dashboard', focus: 'earningActivities' })
        }
      />

      {/* Intention chip selector + freeform input */}
      <IntentionList />

      <div className="flex-1" />

      {/* Call to action */}
      <div className="px-5 pb-10">
        <button
          onClick={handleOpenInstagram}
          className="w-full py-4 rounded-2xl bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-200 active:scale-95 transition-transform"
        >
          Open Instagram
        </button>
        <p className="text-xs text-center text-gray-400 mt-3">
          Using {earnedBalance} min of earned time
        </p>
      </div>

      {/* Time-goal confirmation modal */}
      {showConfirmModal && (
        <ConfirmationModal
          balance={earnedBalance}
          activitiesCount={activeActivities.length}
          onCancel={() => dispatch({ type: 'HIDE_CONFIRM' })}
          onContinue={handleContinue}
        >
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            You've completed <strong>{activeActivities.length} activities</strong> today, worth{' '}
            <strong>{earnedBalance} minutes</strong>. Are you comfortable spending that time now?
          </p>
        </ConfirmationModal>
      )}
    </div>
  );
}
