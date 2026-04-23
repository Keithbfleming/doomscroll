import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { saveState } from '../lib/storage';
import { BalanceCard, IntentionList, DashboardShortcut } from '../components';


function ConfirmModal({ onCancel, onContinue, balance, activitiesCount }) {
  const [timeGoal, setTimeGoal] = useState('');
  const [goalSet, setGoalSet] = useState(false);

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center fade-in">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full bg-white rounded-t-2xl p-6 slide-up">
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Before you dive in</h3>
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          You've completed <strong>{activitiesCount} activities</strong> today, worth{' '}
          <strong>{balance} minutes</strong>. Are you comfortable spending that time now?
        </p>

        <div className="bg-blue-50 rounded-xl p-4 mb-5">
          <p className="text-sm font-medium text-gray-700 mb-3">
            How long are you planning to spend?
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder={`${balance}`}
              value={timeGoal}
              onChange={e => { setTimeGoal(e.target.value); setGoalSet(true); }}
              className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm text-center"
              min="1"
              max="120"
            />
            <span className="text-sm text-gray-500">minutes (optional)</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onContinue(goalSet && timeGoal ? parseInt(timeGoal) : balance)}
            className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-medium text-sm"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

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
      {enablePreSession && (
        <IntentionList />
      )}

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
        <ConfirmModal
          balance={earnedBalance}
          activitiesCount={activeActivities.length}
          onCancel={() => dispatch({ type: 'HIDE_CONFIRM' })}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
