import { useQuery } from "@tanstack/react-query";
import { getPageAccess } from "../api/pageAccessApi";

export function usePageAccess(pageMenuId?: number) {
    return useQuery({
        queryKey: ["page-access", pageMenuId],
        queryFn: () => getPageAccess(pageMenuId!),
        enabled: !!pageMenuId,
    });
}