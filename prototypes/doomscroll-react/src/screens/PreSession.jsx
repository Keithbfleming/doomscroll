import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { saveState } from '../lib/storage';

const INTENTIONS = [
  'Check on a friend',
  'Post something',
  'Kill time',
  'Look up something',
];

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
  const hasSelection = intentions.length > 0 || customIntention.trim().length > 0;

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
        <button
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'dashboard' })}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>

      {/* Balance Card */}
      <div className="mx-5 mb-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Available Time</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-blue-700">{earnedBalance}</span>
              <span className="text-lg text-blue-500 font-medium">min</span>
            </div>
          </div>
          <div className="bg-blue-500 rounded-full p-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          {activeActivities.map(a => (
            <div key={a.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-xs text-blue-700">{a.label}</span>
                <span className="text-xs text-blue-400">{a.detail}</span>
              </div>
              <span className="text-xs font-semibold text-blue-600">+{a.minutes} min</span>
            </div>
          ))}
        </div>
      </div>

      {/* Intention selector */}
      {enablePreSession && (
        <div className="px-5 mb-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">What's bringing you here?</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {INTENTIONS.map(intent => {
              const active = intentions.includes(intent);
              return (
                <button
                  key={intent}
                  onClick={() => dispatch({ type: 'TOGGLE_INTENTION', val: intent })}
                  className={`py-3 px-4 rounded-xl text-sm font-medium text-left transition-all ${
                    active
                      ? 'bg-blue-50 border-2 border-blue-400 text-blue-700'
                      : 'bg-gray-50 border-2 border-transparent text-gray-600'
                  }`}
                >
                  {intent}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            placeholder="Something else..."
            value={customIntention}
            onChange={e => dispatch({ type: 'SET_CUSTOM', val: e.target.value })}
            className="w-full py-3 px-4 rounded-xl bg-gray-50 border-2 border-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-300"
          />
        </div>
      )}

      <div className="flex-1" />

      {/* CTA */}
      <div className="px-5 pb-10">
        {enablePreSession && !hasSelection && (
          <p className="text-xs text-center text-gray-400 mb-3">Set an intention to get started</p>
        )}
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
