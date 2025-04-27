import {createContext, useContext, useEffect, useState} from "react";
import { LoginResponse, User } from "../types/user";
import axiosInstance from "../api/axiosInstance";


//το createContext ειναι ενα object που περιεχει διαφορες πληροφοριες που θελουμε να τα μοιρασουσε στα παδια το auth    provider

const AuthContext = createContext<{
    user: User | undefined,
    token:string | null,
    login:(credentials: {email:string; password: string}) => void
}>({
    user:undefined,
    token:null,
    login: (credentials: {email:string; password: string}) => null,
});

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState<User>();
    const [token, setToken] = useState < string | null > (localStorage.getItem("token"));

    useEffect(() => {
        if (token) {
            axiosInstance.get("/users/user/me")
            .then((response) => {
                console.log(respone);
            });
        }
    },[]);

    const login = ({email, password}: {email:string; password: string}) => {
            axiosInstance.post<LoginResponse>
            ("/users/auth/login",
            {email, password})
            .then(response => {
               const data = response.data.data;
               setUser(data.user);
               setToken(data.token);
               localStorage.setItem("token", data.token);
            })
        };

    return (
        <AuthContext.Provider value={{user, token , login}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
