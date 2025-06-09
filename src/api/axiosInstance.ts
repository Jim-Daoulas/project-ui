import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.PROD 
        ? "https://web-production-a6b6e.up.railway.app" 
        : "http://localhost/new-mki-project-api/public",
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("Using token for request:", token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;