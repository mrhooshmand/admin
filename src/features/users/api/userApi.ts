import api from "@/shared/utils/api";
import { User } from '../types'

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users')
  return response.data
}
export const getUserById = async (id: number) => {
    return await api.get(`/users/${id}`);
};

export const createUser = async (userData: object) => {
    return await api.post("/users", userData);
};

export const updateUser = async (id: number, userData: object) => {
    return await api.put(`/users/${id}`, userData);
};

export const deleteUser = async (id: number) => {
    return await api.delete(`/users/${id}`);
};