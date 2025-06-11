import { BaseResponse } from "./helpers";

export type Skin = {
  id: number;
  champion_id: number;
  name: string;
  image_url: string;
  description?: string;
  unlock_cost: number;
  is_unlocked_by_default: boolean;
  is_locked?: boolean; // Computed property από backend
  created_at?: string;
  updated_at?: string;
};

export type SkinsResponse = BaseResponse<{
    skins: Skin[];
}>;

export type SkinUnlockResponse = BaseResponse<{
    skin: {
        id: number;
        name: string;
        champion_name: string;
        is_locked: boolean;
    };
    user_points: number;
}>;