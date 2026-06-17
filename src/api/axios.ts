import axios, {AxiosInstance, InternalAxiosRequestConfig, AxiosError} from "axios";
import {API_BASE_URL, TOKEN_KEY} from "../constants/api";
import {handleApiError, showAlert} from "../utils/errorHandler";

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor برای اضافه کردن توکن
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Interceptor برای مدیریت خطاها
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const {message, shouldLogout} = handleApiError(error);
        showAlert('error', message);
        if (shouldLogout) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem("user");
        }

        return Promise.reject(error);
    }
);

export default api;