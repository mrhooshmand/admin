import axios, {
	AxiosInstance,
	AxiosError,
} from "axios";
import { API_BASE_URL } from "../constants/api";
import { handleApiError, showAlert } from "../utils/errorHandler";

const api: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptor برای مدیریت خطاها
api.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		return Promise.reject(error);
	},
);

export default api;
