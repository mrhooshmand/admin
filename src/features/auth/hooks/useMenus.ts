import { useQuery } from "@tanstack/react-query";
import { getMenus } from "../api/menuApi";

export function useMenus() {
    return useQuery({
        queryKey: ["menus"],
        queryFn: getMenus,
    });
}