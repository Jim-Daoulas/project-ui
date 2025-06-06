import { BaseResponse } from "./helpers";

export type Comment = {
  id: number;
  rework_id: number;
  user_id: number;
  content: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    name: string;
    email?: string;
  };
}

export type CommentsResponse = BaseResponse<{
    comments: Comment[];
}>;
