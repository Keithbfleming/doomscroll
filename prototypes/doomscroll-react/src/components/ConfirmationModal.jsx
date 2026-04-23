import { useState } from 'react';

export default function ConfirmationModal({ onCancel, onContinue, balance, children }) {
    const [timeGoal, setTimeGoal] = useState('');
    const [goalSet, setGoalSet] = useState(false);

    return (
        <div className="absolute inset-0 z-50 flex items-end justify-center fade-in">
            <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
            <div className="relative w-full bg-white rounded-t-2xl p-6 slide-up">
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Before you dive in</h3>
                {children}
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