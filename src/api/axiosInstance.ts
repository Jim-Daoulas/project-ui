import axios from "axios";

// ✅ Debug logs
console.log("Environment check:");
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("All env vars:", import.meta.env);

const baseURL = import.meta.env.VITE_API_URL || "https://web-production-a6b6e.up.railway.app";
console.log("Final baseURL:", baseURL);

const axiosInstance = axios.create({
    baseURL: baseURL
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("Making request to:", config.baseURL + config.url);
    console.log("Using token for request:", token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;