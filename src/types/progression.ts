// src/types/progression.ts
import { BaseResponse } from "./helpers";

export type UserProgress = {
  total_points: number;
  can_claim_daily_bonus: boolean;
  unlocked_champions_count: number;
  unlocked_skins_count: number;
  total_champions: number;
  total_skins: number;
  champion_cost: number;
  skin_cost: number;
};

export type UnlockableChampion = {
  id: number;
  name: string;
  image_url: string | null;
  cost: number;
  can_afford: boolean;
};

export type UnlockableSkin = {
  id: number;
  name: string;
  champion_name: string;
  image_url: string | null;
  cost: number;
  can_afford: boolean;
};

export type AvailableUnlocks = {
  champions: UnlockableChampion[];
  skins: UnlockableSkin[];
};

export type DailyBonusResult = {
  success: boolean;
  points_earned?: number;
  message: string;
};

// API Response types
export type UserProgressResponse = BaseResponse<UserProgress>;
export type AvailableUnlocksResponse = BaseResponse<AvailableUnlocks>;
export type DailyBonusResponse = DailyBonusResult;

// Updated Champion and Skin types to include unlock status
export type ChampionWithUnlock = {
  id: number;
  name: string;
  title: string;
  role: string;
  region: string;
  description: string;
  image_url: string | null;
  stats?: Record<string, any> | null;
  abilities?: any[];
  skins?: SkinWithUnlock[];
  rework?: any | null;
  is_unlocked: boolean;
  created_at?: string;
  updated_at?: string;
};

export type SkinWithUnlock = {
  id: number;
  champion_id: number;
  name: string;
  image_url: string;
  is_unlocked: boolean;
};