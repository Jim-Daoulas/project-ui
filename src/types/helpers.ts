export type BaseResponse<T> = {
    data: T;
    message: string;
    success: boolean;
};