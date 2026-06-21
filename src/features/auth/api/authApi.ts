import api from "@/shared/utils/api";

export function loginRequest(data: object) {
    return api.post("/login", data);
}