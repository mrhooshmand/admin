import api from "@/shared/utils/axios";

export function loginRequest(data: object) {
    return api.post("/login", data);
}