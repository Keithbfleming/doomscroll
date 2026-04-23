import { useApp } from '../context/AppContext';
import { saveState } from '../lib/storage';
import { BalanceCard, IntentionList, DashboardShortcut, ConfirmationModal } from '../components';


export default function PreSession() {
  const { state, dispatch } = useApp();
  const { persisted, intentions, customIntention, showConfirmModal } = state;

  if (!persisted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent spin-slow" />
      </div>
    );
  }

  const { earnedBalance, earningActivities, enablePreSession } = persisted;
  const activeActivities = earningActivities.filter(a => a.enabled);

  function handleOpenInstagram() {
    if (!enablePreSession) {
      dispatch({ type: 'START_SESSION', timeGoal: earnedBalance, persisted });
      return;
    }
    dispatch({ type: 'SHOW_CONFIRM' });
  }

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

      {/* Balance Card */}
      <BalanceCard earnedBalance={earnedBalance} activeActivities={activeActivities} />

      {/* Intention selector */}
      <IntentionList />

      <div className="flex-1" />

      {/* CTA */}
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

      {/* Confirm Modal */}
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
