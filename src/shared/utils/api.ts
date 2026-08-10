import axios, {
	AxiosInstance,
} from "axios";
import { API_BASE_URL } from "../constants/api";

const api: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});


export default api;
