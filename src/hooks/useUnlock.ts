import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { UserProgress, AvailableUnlocks, LockedItems, UnlockResult } from '../types/unlocks';
import { useAuth } from '../context/AuthContext';

export const useUnlock = () => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user progress
  const fetchUserProgress = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await axiosInstance.get('/unlocks/progress');
      if (response.data.success) {
        setUserProgress(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch user progress');
      console.error('Error fetching user progress:', err);
    } finally {
      setLoading(false);
    }
  };

  // Unlock champion
  const unlockChampion = async (championId: number): Promise<UnlockResult> => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/unlocks/unlock/champion/${championId}`);
      
      if (response.data.success) {
        // Ενημέρωση local state
        await fetchUserProgress();
      }
      
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to unlock champion';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Unlock skin
  const unlockSkin = async (skinId: number): Promise<UnlockResult> => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/unlocks/unlock/skin/${skinId}`);
      
      if (response.data.success) {
        // Ενημέρωση local state
        await fetchUserProgress();
      }
      
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to unlock skin';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Get available unlocks
  const fetchAvailableUnlocks = async (): Promise<AvailableUnlocks | null> => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/unlocks/available-unlocks');
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (err) {
      setError('Failed to fetch available unlocks');
      console.error('Error fetching available unlocks:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get locked items
  const fetchLockedItems = async (): Promise<LockedItems | null> => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/unlocks/locked-items');
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (err) {
      setError('Failed to fetch locked items');
      console.error('Error fetching locked items:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add points (για testing)
  const addPoints = async (amount: number): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/unlocks/add-points', { amount });
      
      if (response.data.success) {
        await fetchUserProgress();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to add points');
      console.error('Error adding points:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const isChampionUnlocked = (championId: number): boolean => {
    return userProgress?.unlocked_champion_ids.includes(championId) || false;
  };

  const isSkinUnlocked = (skinId: number): boolean => {
    return userProgress?.unlocked_skin_ids.includes(skinId) || false;
  };

  const canAfford = (cost: number): boolean => {
    return (userProgress?.points || 0) >= cost;
  };

  // Auto-fetch user progress when user changes
  useEffect(() => {
    if (user) {
      fetchUserProgress();
    } else {
      setUserProgress(null);
    }
  }, [user]);

  return {
    userProgress,
    loading,
    error,
    fetchUserProgress,
    unlockChampion,
    unlockSkin,
    fetchAvailableUnlocks,
    fetchLockedItems,
    addPoints,
    isChampionUnlocked,
    isSkinUnlocked,
    canAfford,
    clearError: () => setError(null)
  };
};