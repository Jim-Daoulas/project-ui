import { Skin } from "./skins";
import { BaseResponse } from "./helpers";
import { Ability } from "./abilities";
import { Rework } from "./reworks";

export type Champion = {
  id: number;
  name: string;
  title: string;
  role: string;
  secondary_role: string;
  region: string;
  description: string;
  image_url: string | null;
  stats?: Record<string, any> | null;
  abilities?: Ability[];
  skins?: Skin[];
  rework?: Rework | null;
  created_at?: string;
  updated_at?: string;
  
  unlock_cost?: number;
  is_unlocked_by_default?: boolean;
  is_locked?: boolean;
}

export type ChampionsResponse = BaseResponse<{
    champions: Champion[];
}>;