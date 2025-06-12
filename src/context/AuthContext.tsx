import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { LoginResponse, User } from "../types/user";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<{
    user: User | undefined,
    token: string | null,
    login: (credentials: {email: string; password: string}) => Promise<any>,
    register: (userData: {name: string; email: string; password: string}) => Promise<any>,
    logout: () => Promise<void>,
    updateUserPoints: (newPoints: number) => void,
    loading: boolean,
    error: string
}>({
    user: undefined,
    token: null,
    login: () => Promise.resolve(),
    register: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    updateUserPoints: () => {},
    loading: true,
    error: ""
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const navigate = useNavigate();

    useEffect(() => {
    const initializeAuth = async () => {
    if (token) {
    try {
    console.log("Checking authentication...");
    // Χρησιμοποιούμε το σωστό endpoint από το Laravel project σου
    const response = await axiosInstance.get("/users/user/me");
    console.log("Auth response:", response.data);
    
    if (response.data && response.data.success && response.data.data && response.data.data.user) {
    setUser(response.data.data.user);
    console.log("User authenticated:", response.data.data.user);
    } else {
    console.log("Invalid auth response, clearing token");
    localStorage.removeItem("token");
    setToken(null);
    }
    } catch (error) {
    console.error("Auth check failed:", error);
    localStorage.removeItem("token");
    setToken(null);
    }
    }
    setLoading(false);
    };

    initializeAuth();
    }, [token]);

    const login = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    setError("");
    
    try {
    console.log("Attempting login...");
    // Χρησιμοποιούμε το σωστό endpoint από το Laravel project σου
    const response = await axiosInstance.post<LoginResponse>(
    "/users/auth/login",
    { email, password }
    );
    
    console.log("Login response:", response.data);
    
    if (response.data.success && response.data.data) {
    const { user: userData, token: userToken } = response.data.data;
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    console.log("Login successful");
    navigate("/");
    return response.data.data;
    } else {
    throw new Error(response.data.message || 'Login failed');
    }
    } catch (error: any) {
    console.error("Login error:", error);
    const message = error.response?.data?.message || 'Login failed';
    setError(message);
    throw new Error(message);
    } finally {
    setLoading(false);
    }
    };

    const register = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    setLoading(true);
    setError("");
    
    try {
    console.log("Attempting registration...");
    // Χρησιμοποιούμε το σωστό endpoint από το Laravel project σου
    const response = await axiosInstance.post(
    "/users/auth/register", 
    { name, email, password }
    );
    
    console.log("Register response:", response.data);
    
    if (response.data.success && response.data.data) {
    const { user: userData, token: userToken } = response.data.data;
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    console.log("Registration successful");
    navigate("/");
    return response.data.data;
    } else {
    throw new Error(response.data.message || 'Registration failed');
    }
    } catch (error: any) {
    console.error("Registration error:", error);
    const message = error.response?.data?.message || 'Registration failed';
    setError(message);
    throw new Error(message);
    } finally {
    setLoading(false);
    }
    };
  
    const logout = async (): Promise<void> => {
    try {
    // Χρησιμοποιούμε το σωστό endpoint από το Laravel project σου
    await axiosInstance.post("/users/auth/logout");
    } catch (error) {
    console.error("Logout error:", error);
    } finally {
    setUser(undefined);
    setToken(null);
    localStorage.removeItem("token");
    console.log("User logged out");
    navigate("/");
    }
    };

    // ✅ Νέα function για ενημέρωση των πόντων
    const updateUserPoints = (newPoints: number) => {
        setUser(prevUser => prevUser ? { ...prevUser, points: newPoints } : undefined);
    };

    return (
    <AuthContext.Provider value={{ 
        user, 
        token, 
        login, 
        register, 
        logout, 
        updateUserPoints,
        loading, 
        error 
    }}>
    {children}
    </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);