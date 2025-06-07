import React from 'react';
import { useProgression } from '../hooks/useProgression';

interface SimpleProgressProps {
  compact?: boolean;
}

const SimpleProgress = ({ compact = false }: SimpleProgressProps) => {
  const { progress, claimDailyBonus, canClaimDailyBonus } = useProgression();

  if (!progress) {
    return (
      <div className={`${compact ? 'p-2' : 'p-4'} bg-gray-800 rounded-lg animate-pulse`}>
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-2 bg-gray-700 rounded"></div>
      </div>
    );
  }

  const handleDailyBonus = async () => {
    const result = await claimDailyBonus();
    if (result && result.points_earned) {
      console.log('Daily bonus claimed:', result);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-1 text-sm">
          <span className="text-blue-400">⭐</span>
          <span className="text-white font-bold">{progress.total_points}</span>
        </div>
        <div className="text-xs text-gray-400">
          {progress.unlocked_champions_count}/{progress.total_champions} Champions
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">Your Progress</h3>
          <p className="text-gray-400 text-sm">Collect points to unlock content</p>
        </div>
        {canClaimDailyBonus && (
          <button 
            onClick={handleDailyBonus}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 animate-pulse"
          >
            🎁 Daily Bonus (+5)
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-700/50 rounded-lg">
          <div className="text-blue-400 text-lg font-bold">⭐</div>
          <div className="text-white font-bold text-lg">{progress.total_points}</div>
          <div className="text-gray-400 text-xs">Total Points</div>
        </div>
        
        <div className="text-center p-3 bg-gray-700/50 rounded-lg">
          <div className="text-purple-400 text-lg font-bold">⚔️</div>
          <div className="text-white font-bold text-lg">
            {progress.unlocked_champions_count}/{progress.total_champions}
          </div>
          <div className="text-gray-400 text-xs">Champions</div>
        </div>
        
        <div className="text-center p-3 bg-gray-700/50 rounded-lg">
          <div className="text-yellow-400 text-lg font-bold">🎨</div>
          <div className="text-white font-bold text-lg">
            {progress.unlocked_skins_count}/{progress.total_skins}
          </div>
          <div className="text-gray-400 text-xs">Skins</div>
        </div>

        <div className="text-center p-3 bg-gray-700/50 rounded-lg">
          <div className="text-green-400 text-lg font-bold">📈</div>
          <div className="text-white font-bold text-lg">
            {Math.round(((progress.unlocked_champions_count + progress.unlocked_skins_count) / 
             (progress.total_champions + progress.total_skins)) * 100)}%
          </div>
          <div className="text-gray-400 text-xs">Complete</div>
        </div>
      </div>

      {/* Unlock Info */}
      <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
        <h4 className="text-white font-semibold mb-2">Unlock Costs</h4>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300 flex items-center gap-1">
            <span>⚔️</span>
            <span>Champions:</span>
          </span>
          <span className="text-blue-400 font-bold">{progress.champion_cost} points</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <span className="text-gray-300 flex items-center gap-1">
            <span>🎨</span>
            <span>Skins:</span>
          </span>
          <span className="text-blue-400 font-bold">{progress.skin_cost} points</span>
        </div>
      </div>

      {/* How to earn points */}
      <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
        <h4 className="text-white font-semibold mb-2">Earn Points</h4>
        <div className="space-y-1 text-sm text-gray-300">
          <div>🌅 Daily login: +5 points</div>
          <div>👁️ View champion: +2 points (once per day)</div>
          <div>💬 Add comment: +1 point</div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProgress;