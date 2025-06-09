import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://web-production-a6b6e.up.railway.app" // ✅ Hardcoded
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;