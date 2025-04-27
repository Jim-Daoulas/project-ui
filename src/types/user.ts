export type User = {

    id:number;
    email: string;
    name: string;
    create_at: string
    uptade_at:string;
}

export type LoginResponse = {
    data: {
        token:string;
        user:User;
    };
    message: string;
    success: boolean;
}