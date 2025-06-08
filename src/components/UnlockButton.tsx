import React, { useState } from 'react';
import { useUnlock } from '../hooks/useUnlock';
import { useAuth } from '../context/AuthContext';

interface UnlockButtonProps {
  type: 'champion' | 'skin';
  id: number;
  name: string;
  cost: number;
  isUnlockedByDefault?: boolean;
  isUnlocked?: boolean;        // ✅ NEW: Direct unlock status from API
  canUnlock?: boolean;         // ✅ NEW: Can unlock status from API
  className?: string;
  onSuccess?: () => void;
}

const UnlockButton: React.FC<UnlockButtonProps> = ({
  type,
  id,
  name,
  cost,
  isUnlockedByDefault = false,
  isUnlocked,                  // ✅ NEW: Use this instead of hook
  canUnlock,                   // ✅ NEW: Use this instead of calculating
  className = '',
  onSuccess
}) => {
  const { user } = useAuth();
  const { 
    userProgress, 
    unlockChampion, 
    unlockSkin, 
    canAfford,
    loading 
  } = useUnlock();
  
  const [unlocking, setUnlocking] = useState(false);
  const [message, setMessage] = useState<string>('');

  // Αν δεν είναι logged in
  if (!user) {
    return (
      <button 
        disabled 
        className={`btn btn-disabled ${className}`}
      >
        Login to Unlock
      </button>
    );
  }

  // Αν είναι unlocked by default
  if (isUnlockedByDefault) {
    return (
      <div className={`badge badge-success ${className}`}>
        Free
      </div>
    );
  }

  // ✅ UPDATED: Use the new props instead of hooks
  const isAlreadyUnlocked = isUnlocked || isUnlockedByDefault;

  if (isAlreadyUnlocked) {
    return (
      <div className={`badge badge-success ${className}`}>
        ✓ Unlocked
      </div>
    );
  }

  // ✅ UPDATED: Use canUnlock prop from API + local canAfford check
  const canBuy = canUnlock && canAfford(cost);
  
  const handleUnlock = async () => {
    setUnlocking(true);
    setMessage('');
    
    try {
      const result = type === 'champion' 
        ? await unlockChampion(id)
        : await unlockSkin(id);
      
      setMessage(result.message);
      
      // Αν το unlock ήταν επιτυχές, καλούμε το callback
      if (result.success && onSuccess) {
        onSuccess();
      }
      
      // Καθαρισμός μηνύματος μετά από 3 δευτερόλεπτα
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('An error occurred');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleUnlock}
        disabled={!canBuy || unlocking || loading}
        className={`
          btn
          ${canBuy ? 'btn-primary' : 'btn-disabled'} 
          ${unlocking ? 'loading' : ''}
          ${className}
        `}
      >
        {unlocking ? 'Unlocking...' : `Unlock (${cost} points)`}
      </button>
      
      {/* User points display */}
      <div className="text-xs text-gray-500">
        You have: {userProgress?.points || 0} points
      </div>
      
      {/* Message display */}
      {message && (
        <div className={`
          text-xs text-center max-w-xs
          ${message.includes('Success') ? 'text-green-600' : 'text-red-600'}
        `}>
          {message}
        </div>
      )}
      
      {/* Cannot afford message */}
      {!canBuy && !isAlreadyUnlocked && (
        <div className="text-xs text-red-500 text-center">
          {!canUnlock ? 'Cannot unlock this item' : 
           `Need ${cost - (userProgress?.points || 0)} more points`}
        </div>
      )}
    </div>
  );
};

export default UnlockButton;