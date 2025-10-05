import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:7081/api/accountstatementengine/v1",
});

// Attach token automatically
api.interceptors.request.use((config) => {
    console.log('token - ', localStorage.getItem("authToken"))
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;