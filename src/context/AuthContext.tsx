import { createContext, useContext, useEffect, useState } from "react";
import { LoginResponse, User } from "../types/user";
import axiosInstance from "../api/axiosInstance";
import React, { ReactNode } from 'react';



//το createContext ειναι ενα object που περιεχει διαφορες πληροφοριες που θελουμε να τα μοιρασουσε στα παδια το auth    provider

const AuthContext = createContext<{
    user: User | undefined,
    token: string | null,
    login: (credentials: {email: string; password: string}) => Promise<any>,
    logout: () => Promise<void>
}>({
    user: undefined,
    token: null,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<User>();
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    useEffect(() => {
        if (token) {
          axiosInstance.get("/users/user/me")
            .then((response) => {
              console.log("Raw user data response:", response);
              console.log("User data response:", response.data);
              
              // Έλεγξε αν υπάρχουν δεδομένα χρήστη σε οποιαδήποτε μορφή
              if (response.data && response.data.data && response.data.data.user) {
                // Αν έχει την προβλεπόμενη δομή
                setUser(response.data.data.user);
              } else if (response.data && response.data.user) {
                // Άλλη πιθανή δομή
                setUser(response.data.user);
              } else if (response.data && response.data.data) {
                // Ίσως ο χρήστης είναι άμεσα στο data
                setUser(response.data.data);
              } else if (response.data) {
                // Ή απλά η απάντηση είναι ο χρήστης
                setUser(response.data);
              } else {
                console.error("Unexpected user response format:", response.data);
              }
            })
            .catch(error => {
              console.error("Error fetching user data:", error);
            });
        }
      }, [token]);

    const login = ({ email, password }: { email: string; password: string }) => {
        return axiosInstance.post<LoginResponse>
            ("/users/auth/login",
                { email, password })
            .then(response => {
                console.log("Login response:", response.data);
                const data = response.data.data;
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem("token", data.token);
                return data;
            });
    };
    const logout = (): Promise<void> => {
        return axiosInstance.post("/users/auth/logout")
            .then(() => {
                setUser(undefined);
                setToken(null);
                localStorage.removeItem("token");
            })
            .catch(error => {
                console.error("Logout error:", error);
            });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
