import { BaseResponse } from "./helpers";
import { ReworkAbility } from "./reworksabilities";
import { Comment } from "./comments";

export type Rework = {
  id: number;
  champion_id: number;
  user_id: number;
  title: string;
  summary: string;
  stats: Record<string, any> | null;
  abilities?: ReworkAbility[];
  comments?: Comment[];
  created_at?: string;
  updated_at?: string;
}

export type ReworksResponse = BaseResponse<{
    reworks: Rework[];
}>;