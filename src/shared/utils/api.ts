import axios, {
	AxiosInstance,
} from "axios";
import { API_BASE_URL } from "../constants/api";
import { isMockEnabled, mockAdapter } from "../mock";

const api: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
	...(isMockEnabled ? { adapter: mockAdapter } : {}),
});

if (isMockEnabled && import.meta.env.DEV) {
	console.info("[mock] API mock mode enabled — backend is not required");
}

export default api;
