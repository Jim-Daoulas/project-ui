import { Skin } from "./skins";
import { BaseResponse } from "./helpers";
import { Ability } from "./abilities";
import { Rework } from "./reworks";

export type Champion = {
  id: number;
  name: string;
  title: string;
  role: string;
  region: string;
  description: string;
  image_url: string | null;
  stats?: Record<string, any> | null;
  // Unlock properties
  unlock_cost: number;
  is_unlocked_by_default: boolean;
  is_unlocked?: boolean;
  can_unlock?: boolean;
  user_has_unlocked?: boolean;
  user_can_unlock?: boolean;
  // Relations
  abilities?: Ability[];
  skins?: Skin[];
  rework?: Rework | null;
  created_at?: string;
  updated_at?: string;
}

export type ChampionsResponse = BaseResponse<Champion[]>;