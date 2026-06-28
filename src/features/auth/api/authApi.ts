import api from "@/shared/utils/api";
import { LoginRequest } from "@/features/auth/types";

export const loginRequest = async (data: LoginRequest) => {
	const response = await api.post("/login", data);
	return response.data; // { user: {...}, message: "..." }
};
export async function getMe() {
    const response = await api.get("/me");
    return response.data;
}