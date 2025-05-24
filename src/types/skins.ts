import { BaseResponse } from "./helpers";

export type Skin = {
  id: number;
  champion_id: number;
  name: string;
  image_url: string;
};

export type CategoriesResponse = BaseResponse<{
    skins: Skin[];
}>;
