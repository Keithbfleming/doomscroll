import { useState } from 'react';

/**
 * Bottom-sheet modal used for confirmation prompts throughout the app.
 * Renders as `position: absolute` so it stays inside the phone-frame
 * overflow:hidden container — never use `position: fixed` here.
 *
 * @param {object} props
 * @param {function} props.onCancel - Called when the user taps the cancel button or the backdrop.
 * @param {function} props.onContinue - Called when the user confirms.
 *   Receives the parsed timeGoal integer (or the fallback balance value) when showTimeInput is true.
 *   Receives no arguments when showTimeInput is false.
 * @param {number} [props.balance] - Fallback minutes value shown as the time-input placeholder.
 * @param {string} [props.title='Before you dive in'] - Header text.
 * @param {string} [props.continueLabel='Continue'] - Label for the primary (confirm) button.
 * @param {string} [props.cancelLabel='Cancel'] - Label for the secondary (cancel) button.
 * @param {boolean} [props.showTimeInput=true] - Whether to render the time-goal input block.
 *   Pass false from MentalBreak's extension modal (it has its own input in children).
 * @param {React.ReactNode} [props.children] - Extra content rendered between the title and the input.
 */
export default function ConfirmationModal({
  onCancel,
  onContinue,
  balance,
  children,
  title = 'Before you dive in',
  continueLabel = 'Continue',
  cancelLabel = 'Cancel',
  showTimeInput = true,
}) {
  const [timeGoal, setTimeGoal] = useState('');
  const [goalSet, setGoalSet] = useState(false);

  function handleContinue() {
    if (showTimeInput) {
      // Pass the explicit goal if set, otherwise fall back to earned balance
      onContinue(goalSet && timeGoal ? parseInt(timeGoal) : balance);
    } else {
      onContinue();
    }
  }

  return (
    // absolute (not fixed) — must stay inside the phone-frame overflow:hidden container
    <div className="absolute inset-0 z-50 flex items-end justify-center fade-in">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full bg-white rounded-t-2xl p-6 slide-up">
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

        {children}

        {showTimeInput && (
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
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-medium text-sm"
          >
            {continueLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
