import api from "@/shared/utils/api";

export const searchUsers = async (userData: object) => {
    const response = await api.post(`/users/search`, userData);
    return response.data
};

export const createUser = async (userData: object) => {
    const response = await api.post("/users", userData);
    return response.data
};

export const updateUser = async (id: number, userData: object) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data
};

export const deleteUser = async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data
};