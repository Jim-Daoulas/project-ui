import { BaseResponse } from "./helpers";

export type User = {
    id: number;
    email: string;
    name: string;
    points: number; // Προσθήκη points
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