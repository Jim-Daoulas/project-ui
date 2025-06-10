import { BaseResponse } from "./helpers";

export type User = {
    id: number;
    email: string;
    name: string;
    points?: number;
    unlocked_champions_count?: number;
    unlocked_skins_count?: number;
    unlocked_champion_ids?: number[];
    unlocked_skin_ids?: number[];
    created_at: string;
    updated_at: string;
}

export type LoginCredentials = {
    email: string;
    password: string;
};

export type RegisterCredentials = {
    name: string;
    email: string;
    password: string;
};

export type LoginResponse = BaseResponse<{
    token: string;
    user: User;
}>;

export type RegisterResponse = BaseResponse<{
    token: string;
    user: User;
}>;

export type UpdateResponse = BaseResponse<{
    user: User;
}>;