import api from "./axios";

export const getUsers = async () => {
    return await api.get("/users");
};

export const getUserById = async (id) => {
    return await api.get(`/users/${id}`);
};

export const createUser = async (userData) => {
    return await api.post("/users", userData);
};

export const updateUser = async (id, userData) => {
    return await api.put(`/users/${id}`, userData);
};

export const deleteUser = async (id) => {
    return await api.delete(`/users/${id}`);
};