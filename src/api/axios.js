import axios from "axios";
import {API_BASE_URL, TOKEN_KEY} from "../constants/api";
import {handleApiError} from "../utils/errorHandler";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 ثانیه timeout
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor برای اضافه کردن توکن
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const {shouldLogout} = handleApiError(error);

        if (shouldLogout) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem("user");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;