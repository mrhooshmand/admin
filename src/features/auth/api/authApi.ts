import api from "./axios";

export function loginRequest(data: object) {
    return api.post("/login", data);
}