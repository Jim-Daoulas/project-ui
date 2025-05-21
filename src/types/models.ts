// Ορισμός τύπων για τα μοντέλα

export interface Champion {
  id: number;
  name: string;
  title: string;
  role: string;
  region: string;
  description: string;
  image_url: string | null;
  stats: Record<string, any> | null;
  abilities?: Ability[];
  skins?: Skin[];
  rework?: Rework | null;
  created_at?: string;
  updated_at?: string;
}

export interface Ability {
  id: number;
  champion_id: number;
  name: string;
  key: string;
  description: string;
  image_url: string | null;
  video_url?: string | null;
  details: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
}

export interface Skin {
  id: number;
  champion_id: number;
  name: string;
  image_url: string | null;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Rework {
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

export interface ReworkAbility {
  id: number;
  rework_id: number;
  name: string;
  key: string;
  description: string;
  image_url: string | null;
  video_url?: string | null;
  details: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
}

export interface Comment {
  id: number;
  rework_id: number;
  user_id: number;
  content: string;
  user?: User;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

// Τύποι για τις API απαντήσεις
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}