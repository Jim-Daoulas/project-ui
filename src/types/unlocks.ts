import { BaseResponse } from "./helpers";
import { Champion } from "./champions";
import { Skin } from "./skins";

export type UserProgress = {
  points: number;
  unlocked_champions_count: number;
  unlocked_skins_count: number;
  unlocked_champion_ids: number[];
  unlocked_skin_ids: number[];
};

export type UnlockResult = {
  success: boolean;
  message: string;
  data?: {
    champion_id?: number;
    champion_name?: string;
    skin_id?: number;
    skin_name?: string;
    cost: number;
    user_points: number;
  };
};

export type AvailableUnlocks = {
  user_points: number;
  available_champions: Champion[];
  available_skins: Skin[];
};

export type LockedItems = {
  user_points: number;
  locked_champions: Champion[];
  locked_skins: Skin[];
};

export type UserProgressResponse = BaseResponse<UserProgress>;
export type UnlockResponse = BaseResponse<UnlockResult>;
export type AvailableUnlocksResponse = BaseResponse<AvailableUnlocks>;
export type LockedItemsResponse = BaseResponse<LockedItems>;

// Ενημερωμένα types για Champion και Skin με unlock properties
export type ChampionWithUnlock = Champion & {
  unlock_cost: number;
  is_unlocked_by_default: boolean;
  is_unlocked?: boolean;
  can_unlock?: boolean;
};

export type SkinWithUnlock = Skin & {
  unlock_cost: number;
  is_unlocked_by_default: boolean;
  is_unlocked?: boolean;
  can_unlock?: boolean;
};