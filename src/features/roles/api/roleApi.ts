import api from "@/shared/utils/api";

export const searchRoles = async (roleData: object) => {
    const response = await api.post(`/roles/search`, roleData);
    return response.data
};

export const createRole = async (roleData: object) => {
    const response = await api.post("/roles", roleData);
    return response.data
};

export const updateRole = async (id: number, roleData: object) => {
    const response = await api.put(`/roles/${id}`, roleData);
    return response.data
};

export const deleteRole = async (id: number) => {
    const response = await api.delete(`/roles/${id}`);
    return response.data
};