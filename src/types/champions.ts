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
  avatar_url?: string | null; 
  stats?: Record<string, any> | null;
  abilities?: Ability[];
  skins?: Skin[];
  rework?: Rework | null;
  created_at?: string;
  updated_at?: string;
}

export type ChampionsResponse = BaseResponse<Champion[]>;