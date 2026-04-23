export default function BalanceCard({ earnedBalance, activeActivities }) {

    return (
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
                {activeActivities.map(activity => (
                    <div key={activity.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span className="text-xs text-blue-700">{activity.label}</span>
                            <span className="text-xs text-blue-400">{activity.detail}</span>
                        </div>
                        <span className="text-xs font-semibold text-blue-600">+{activity.minutes} min</span>
                    </div>
                ))}
            </div>
        </div>
    );
}