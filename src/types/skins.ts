import { BaseResponse } from "./helpers";

export type Skin = {
  id: number;
  champion_id: number;
  name: string;
  image_url: string;
  description?: string;
  // Unlock properties
  unlock_cost: number;
  is_unlocked_by_default: boolean;
  is_unlocked?: boolean;
  can_unlock?: boolean;
};

export type SkinsResponse = BaseResponse<{
    skins: Skin[];
}>;