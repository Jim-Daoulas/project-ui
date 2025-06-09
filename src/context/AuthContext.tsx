import { createContext, useContext, useEffect, useState } from "react";
import { LoginResponse, User } from "../types/user";
import axiosInstance from "../api/axiosInstance";
import { ReactNode } from 'react';

// ✅ Προσθήκη loading στο context type
const AuthContext = createContext<{
    user: User | undefined,
    token: string | null,
    loading: boolean, // ✅ ΝΕΟ
    login: (credentials: {email: string; password: string}) => Promise<any>,
    register: (userData: {name: string; email: string; password: string}) => Promise<any>,
    logout: () => Promise<void>
}>({
    user: undefined,
    token: null,
    loading: true, // ✅ ΝΕΟ
    login: () => Promise.resolve(),
    register: () => Promise.resolve(),
    logout: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<User>();
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState<boolean>(true); // ✅ ΝΕΟ

    useEffect(() => {
        if (token) {
            setLoading(true); // ✅ Ξεκίνα loading
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
                    // ✅ Αν αποτύχει το API call, αφαίρεσε το token
                    setToken(null);
                    localStorage.removeItem("token");
                })
                .finally(() => {
                    setLoading(false); // ✅ Τέλος loading
                });
        } else {
            setLoading(false); // ✅ Δεν υπάρχει token, δεν χρειάζεται loading
        }
    }, [token]);

    const login = ({ email, password }: { email: string; password: string }) => {
        setLoading(true); // ✅ Ξεκίνα loading για login
        return axiosInstance.post<LoginResponse>("/users/auth/login", { email, password })
            .then(response => {
                console.log("Login response:", response.data);
                const data = response.data.data;
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem("token", data.token);
                return data;
            })
            .finally(() => {
                setLoading(false); // ✅ Τέλος loading
            });
    };

    const register = ({ name, email, password }: { name: string; email: string; password: string }) => {
        setLoading(true); // ✅ Ξεκίνα loading για register
        return axiosInstance.post("/users/auth/register", { name, email, password })
            .then(response => {
                console.log("Register response:", response.data);
                const data = response.data.data;
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem("token", data.token);
                return data;
            })
            .finally(() => {
                setLoading(false); // ✅ Τέλος loading
            });
    };
    
    const logout = (): Promise<void> => {
        setLoading(true); // ✅ Ξεκίνα loading για logout
        return axiosInstance.post("/users/auth/logout")
            .then(() => {
                setUser(undefined);
                setToken(null);
                localStorage.removeItem("token");
            })
            .catch(error => {
                console.error("Logout error:", error);
                // ✅ Ακόμα και αν αποτύχει, κάνε logout τοπικά
                setUser(undefined);
                setToken(null);
                localStorage.removeItem("token");
            })
            .finally(() => {
                setLoading(false); // ✅ Τέλος loading
            });
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);