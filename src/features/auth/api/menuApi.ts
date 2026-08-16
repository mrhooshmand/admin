import api from "@/shared/utils/api";
import { ApiResponse } from "@/shared/api/types/api-response";
import { Menu } from "../types";

export const getMenus = async () => {
    const response = await api.get<ApiResponse<Menu[]>>("/menus");
    return response.data;
};