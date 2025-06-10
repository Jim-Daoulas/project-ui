import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD 
    ? "https://web-production-a6b6e.up.railway.app"
    : "http://localhost/new-mk1-project-api/public",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Using token for request:", token);
  
  // ✅ ΔΙΟΡΘΩΣΗ: Στείλε Authorization header ΜΟΝΟ αν υπάρχει token
  if (token && token !== 'null' && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default axiosInstance;