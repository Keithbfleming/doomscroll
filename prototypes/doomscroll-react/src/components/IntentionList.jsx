import { useApp } from '../context/AppContext';

/** Preset intention options shown as tappable chips. */
const INTENTIONS = [
  'Check on a friend',
  'Post something',
  'Kill time',
  'Look up something',
];

/**
 * Intention selector shown on the PreSession screen.
 * Lets users pick one or more preset reasons for opening Instagram,
 * or type a freeform custom intention.
 * State lives in AppContext (intentions array + customIntention string).
 */
export default function IntentionList() {
  const { state, dispatch } = useApp();
  const { intentions, customIntention } = state;

  return (
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
      {/* Freeform fallback for intentions not covered by the presets */}
      <input
        type="text"
        placeholder="Something else..."
        value={customIntention}
        onChange={e => dispatch({ type: 'SET_CUSTOM', val: e.target.value })}
        className="w-full py-3 px-4 rounded-xl bg-gray-50 border-2 border-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-300"
      />
    </div>
  );
}
