import axios from "axios";

const axiosInstance =  axios.create({
    baseURL:"http://mki-project-api.test"
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