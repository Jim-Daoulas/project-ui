import { BaseResponse } from "./helpers";

export type Ability = {
  id: number;
  champion_id: number;
  name: string;
  key: string;
  description: string;
  image_url: string;
  video_url?: string;
  details: string;
}

export type CategoriesResponse = BaseResponse<{
    categories: Ability[];
}>;
