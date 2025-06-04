import axios from "axios";

const axiosInstance =  axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://project-api-production-4135.up.railway.app/"
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