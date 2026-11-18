import api from "@/shared/utils/api";
import type { Permission } from "../types";

interface GetAccessRequest {
    page_menu_id: number;
}

export async function getPageAccess(pageMenuId: number) {
    const response = await api.post("/getAccess", {
        fields: {
            page_menu_id: pageMenuId,
        },
    });

    return response.data;
}