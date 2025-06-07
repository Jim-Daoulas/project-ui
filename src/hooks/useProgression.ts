// src/hooks/useProgression.ts
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { 
  UserProgress, 
  AvailableUnlocks, 
  DailyBonusResult,
  UserProgressResponse,
  AvailableUnlocksResponse,
  DailyBonusResponse 
} from '../types/progression';
import { useAuth } from '../context/AuthContext';

export const useProgression = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [availableUnlocks, setAvailableUnlocks] = useState<AvailableUnlocks | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user progress
  const fetchProgress = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await axiosInstance.get<UserProgressResponse>('/users/user/progress');
      if (response.data.success) {
        setProgress(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch progress');
      console.error('Progress fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available unlocks
  const fetchAvailableUnlocks = async () => {
    if (!user) return;
    
    try {
      const response = await axiosInstance.get<AvailableUnlocksResponse>('/users/user/unlocks');
      if (response.data.success) {
        setAvailableUnlocks(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch unlocks');
      console.error('Unlocks fetch error:', err);
    }
  };

  // Claim daily bonus
  const claimDailyBonus = async (): Promise<DailyBonusResult | null> => {
    if (!user) return null;
    
    try {
      const response = await axiosInstance.post<DailyBonusResponse>('/users/user/daily-bonus');
      if (response.data.success) {
        // Refresh progress after claiming bonus
        await fetchProgress();
        return response.data;
      }
    } catch (err) {
      setError('Failed to claim daily bonus');
      console.error('Daily bonus error:', err);
    }
    return null;
  };

  // Unlock champion
  const unlockChampion = async (championId: number): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const response = await axiosInstance.post(`/users/user/unlock/champion/${championId}`);
      if (response.data.success) {
        // Refresh data
        await Promise.all([fetchProgress(), fetchAvailableUnlocks()]);
        return true;
      }
    } catch (err) {
      setError('Failed to unlock champion');
      console.error('Champion unlock error:', err);
    }
    return false;
  };

  // Unlock skin
  const unlockSkin = async (skinId: number): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const response = await axiosInstance.post(`/users/user/unlock/skin/${skinId}`);
      if (response.data.success) {
        // Refresh data
        await Promise.all([fetchProgress(), fetchAvailableUnlocks()]);
        return true;
      }
    } catch (err) {
      setError('Failed to unlock skin');
      console.error('Skin unlock error:', err);
    }
    return false;
  };

  // Track champion view
  const trackChampionView = async (championId: number) => {
    if (!user) return;
    
    try {
      await axiosInstance.post('/users/user/track/champion-view', {
        champion_id: championId
      });
    } catch (err) {
      console.error('Champion view tracking error:', err);
    }
  };

  // Track comment
  const trackComment = async () => {
    if (!user) return;
    
    try {
      await axiosInstance.post('/users/user/track/comment');
    } catch (err) {
      console.error('Comment tracking error:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProgress();
      fetchAvailableUnlocks();
    }
  }, [user]);

  return {
    progress,
    availableUnlocks,
    loading,
    error,
    fetchProgress,
    fetchAvailableUnlocks,
    claimDailyBonus,
    unlockChampion,
    unlockSkin,
    trackChampionView,
    trackComment,
    // Helper computed values
    canClaimDailyBonus: progress?.can_claim_daily_bonus || false,
    totalProgress: progress ? 
      ((progress.unlocked_champions_count + progress.unlocked_skins_count) / 
       (progress.total_champions + progress.total_skins)) * 100 : 0
  };
};