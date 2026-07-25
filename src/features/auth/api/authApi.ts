import api from "@/shared/utils/api";
import { LoginRequest,RegisterRequest } from "@/features/auth/types";

export const loginRequest = async (data: LoginRequest) => {
	const response = await api.post("/login", data);
	return response.data; // { user: {...}, message: "..." }
};
export async function getMe() {
    const response = await api.get("/me");
    return response.data;
}
export const registerRequest = async (data: RegisterRequest) => {
	const response = await api.post("/register", data);
	return response.data; // { user: {...}, message: "..." }
};