import { BaseResponse } from "./helpers.ts";

export type User = {

    id:number;
    email: string;
    name: string;
    create_at: string
    uptade_at:string;
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