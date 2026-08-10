import api from "@/shared/utils/api";
import {ApiResponse} from "@/shared/api/types/api-response";
import {User} from "../types/types";

export const searchUsers = async (userData: object) => {
    const response = await api.post<ApiResponse<User[]>>(`/users/search`, userData);
    return response.data
};

export const createUser = async (userData: object) => {
    const response = await api.post("/users", {fields: userData});
    return response.data
};

export const updateUser = async (id: number, userData: object) => {
    const response = await api.put(`/users/${id}`, {fields: userData});
    return response.data
};

export const deleteUser = async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data
};
export const deleteUsers = async (ids: number[]) => {
    const response = await api.put("/users/bulkDelete", {fields: {ids}});
    return response.data
};