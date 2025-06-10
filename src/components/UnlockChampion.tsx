import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { Champion } from '../types/champions';

interface UnlockChampionProps {
    champion: Champion;
    onUnlock?: (champion: Champion) => void;
}

const UnlockChampion = ({ champion, onUnlock }: UnlockChampionProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Default values με optional chaining
    const unlockCost = champion.unlock_cost ?? 30;
    const userPoints = user?.points ?? 0;

    const handleUnlock = async () => {
        if (!user) {
            setError('You must be logged in to unlock champions');
            return;
        }

        setIsUnlocking(true);
        setError(null);
        setSuccess(null);

        try {
            console.log('Attempting to unlock champion:', champion.id);
            console.log('Request URL:', `/unlocks/champion/${champion.id}`);
            
            const response = await axiosInstance.post(`/unlocks/champion/${champion.id}`);
            
            console.log('Unlock response:', response.data);
            
            if (response.data.success) {
                setSuccess(response.data.message);
                if (onUnlock) {
                    await onUnlock(champion);
                }
                // Navigate to champion detail instead of champions list
                setTimeout(() => {
                    navigate(`/champions/${champion.id}`, { replace: true });
                }, 1500);
            } else {
                setError(response.data.message || 'Failed to unlock champion');
            }
        } catch (err: any) {
            console.error('Unlock error:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);
            
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 404) {
                setError('Unlock endpoint not found. Please check API configuration.');
            } else if (err.response?.status === 401) {
                setError('Authentication required. Please log in again.');
            } else {
                setError('Failed to unlock champion. Please try again.');
            }
        } finally {
            setIsUnlocking(false);
        }
    };

    // Αν δεν είναι user logged in
    if (!user) {
        return (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-400 text-center">
                    Please log in to unlock champions
                </p>
            </div>
        );
    }

    // Αν είναι ήδη unlocked
    if (!champion.is_locked) {
        return null;
    }

    return (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
            <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-white mb-2">
                    Champion Locked
                </h3>
                <p className="text-gray-300 mb-4">
                    Unlock {champion.name} to view their details, abilities, and skins.
                </p>
                
                <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Unlock Cost:</span>
                        <span className="text-yellow-400 font-bold">
                            {unlockCost} points
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                        <span className="text-gray-400">Your Points:</span>
                        <span className="text-white font-bold">
                            {userPoints} points
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 mb-4">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-900/30 border border-green-500 rounded-lg p-3 mb-4">
                        <p className="text-green-400 text-sm">{success}</p>
                    </div>
                )}

                <button
                    onClick={handleUnlock}
                    disabled={isUnlocking || userPoints < unlockCost}
                    className={`
                        px-6 py-3 rounded-lg font-semibold transition-all duration-200
                        ${isUnlocking
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : userPoints >= unlockCost
                            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    {isUnlocking ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            Unlocking...
                        </div>
                    ) : userPoints >= unlockCost ? (
                        `Unlock for ${unlockCost} points`
                    ) : (
                        `Need ${unlockCost - userPoints} more points`
                    )}
                </button>

                <p className="text-xs text-gray-500 mt-3">
                    You can earn points by logging in daily and commenting on reworks
                </p>
            </div>
        </div>
    );
};

export default UnlockChampion;