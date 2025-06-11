import { BaseResponse } from "./helpers";

export interface Skin {
  id: number;
  champion_id: number;
  name: string;
  image_url: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  
  // ✅ Unlock properties (ίδια δομή με champions)
  unlock_cost: number;  // ✅ Required, όχι optional
  is_unlocked_by_default: boolean;  // ✅ Required
  is_locked: boolean;  // ✅ Required, ίδια λογική με champions
  
  // ✅ Optional champion info
  champion?: {
    id: number;
    name: string;
  };
}

export type SkinsResponse = BaseResponse<{
  skins: Skin[];
}>;

export interface SkinsApiResponse {
  success: boolean;
  data: Skin[];
  champion?: string;
  message: string;
}

export interface UnlockSkinResponse {
  success: boolean;
  message: string;
  remaining_points?: number;
  data?: any;
}

export interface SingleSkinResponse {
  success: boolean;
  data: Skin;
  message: string;
}