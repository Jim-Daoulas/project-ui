import React from 'react';
import { useUnlock } from '../hooks/useUnlock';
import { useAuth } from '../context/AuthContext';

const PointsDisplay: React.FC = () => {
  const { user } = useAuth();
  const { userProgress } = useUnlock();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-purple-600 rounded-full text-white text-sm">
      <span className="text-yellow-300">💰</span>
      <span className="font-semibold">
        {userProgress?.points ?? user.points ?? 0}
      </span>
      <span className="text-purple-200">points</span>
    </div>
  );
};

export default PointsDisplay;