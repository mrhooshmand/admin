import api from "./axios";

export function loginRequest(data) {
    return api.post("/login", data);
}