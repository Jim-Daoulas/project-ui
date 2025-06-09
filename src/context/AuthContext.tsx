import { createContext, useContext, useEffect, useState } from "react";
import { LoginResponse, User } from "../types/user";
import axiosInstance from "../api/axiosInstance";
import { ReactNode } from 'react';



//το createContext ειναι ενα object που περιεχει διαφορες πληροφοριες που θελουμε να τα μοιρασουσε στα παδια το auth    provider

const AuthContext = createContext<{
    user: User | undefined,
    token: string | null,
    login: (credentials: {email: string; password: string}) => Promise<any>,
    register: (userData: {name: string; email: string; password: string}) => Promise<any>,
    logout: () => Promise<void>
}>({
    user: undefined,
    token: null,
    login: () => Promise.resolve(),
    register: () => Promise.resolve(),
    logout: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<User>();
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    useEffect(() => {
    if (token) {
        console.log("Token exists:", token);
        console.log("Making request to /users/user/me");
        
        // ✅ ΠΡΟΣΘΕΣΕ EXPLICIT HEADERS:
        axiosInstance.get("/users/user/me", {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            console.log("✅ SUCCESS - Raw user data response:", response);
            console.log("✅ SUCCESS - User data response:", response.data);
            
            if (response.data && response.data.success && response.data.data) {
                console.log("✅ Setting user:", response.data.data);
                setUser(response.data.data);
            } else {
                console.error("❌ Unexpected user response format:", response.data);
            }
        })
        .catch(error => {
            console.error("❌ ERROR fetching user data:", error);
            console.error("❌ ERROR response:", error.response);
            
            if (error.response?.status === 401) {
                console.log("❌ Token invalid, clearing...");
                setToken(null);
                localStorage.removeItem("token");
            }
        });
    } else {
        console.log("❌ No token found");
    }
}, [token]);

    const login = ({ email, password }: { email: string; password: string }) => {
    return axiosInstance.post<LoginResponse>("/users/auth/login", { email, password })
    .then(response => {
        console.log("Login response:", response.data);
        const data = response.data.data;
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        
        // ✅ ΠΡΟΣΘΕΣΕ ΑΥΤΟ:
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        return data;
    });
};

const register = ({ name, email, password }: { name: string; email: string; password: string }) => {
    return axiosInstance.post("/users/auth/register", { name, email, password })
    .then(response => {
        console.log("Register response:", response.data);
        const data = response.data.data;
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        
        // ✅ ΠΡΟΣΘΕΣΕ ΑΥΤΟ:
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        return data;
    });
};

const logout = (): Promise<void> => {
    return axiosInstance.post("/users/auth/logout")
    .then(() => {
        setUser(undefined);
        setToken(null);
        localStorage.removeItem("token");
        
        // ✅ ΠΡΟΣΘΕΣΕ ΑΥΤΟ:
        delete axiosInstance.defaults.headers.common['Authorization'];
    })
    .catch(error => {
        console.error("Logout error:", error);
    });
};

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
