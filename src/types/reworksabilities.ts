import { BaseResponse } from "./helpers";

export type ReworkAbility = {
  id: number;
  rework_id: number;
  name: string;
  key: string;
  description: string;
  image_url: string | null;
  video_url?: string | null;
  details: Record<string, any> | null;
}

export type ReworkAbilitiesResponse = BaseResponse<{
    creworksAbilities: ReworkAbility[];
}>;
