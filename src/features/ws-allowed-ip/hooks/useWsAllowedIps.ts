import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showAlert } from "@/shared/utils/errorHandler";
import { ApiResponse } from "@/shared/api/types/api-response";
import { SearchRequest } from "@/shared/api/types/search-request";
import { checkWsUser, saveSoftware, searchWsAllowedIps } from "@/features/ws-allowed-ip/api/wsAllowedIpApi";
import { CheckUserPayload, WsAllowedIpFilters } from "@/features/ws-allowed-ip/types";

function settle(response: ApiResponse<null>, queryClient: ReturnType<typeof useQueryClient>) {
    showAlert(response.status, response.message);
    if (response.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["ws-allowed-ips"] });
    }
}

export function useWsAllowedIps(request: SearchRequest<WsAllowedIpFilters>) {
    const queryClient = useQueryClient();

    const listQuery = useQuery({
        queryKey: ["ws-allowed-ips", request],
        queryFn: () => searchWsAllowedIps(request),
    });

    const saveMutation = useMutation({
        mutationKey: ["ws-allowed-ips", "save"],
        mutationFn: ({ id, softwareName }: { id: number; softwareName: string }) =>
            saveSoftware(id, softwareName),
        onSuccess: (response) => settle(response, queryClient),
        onError: (error) => showAlert("error", error),
    });

    const checkMutation = useMutation({
        mutationKey: ["ws-allowed-ips", "check"],
        mutationFn: (payload: CheckUserPayload) => checkWsUser(payload),
        onSuccess: (response) => settle(response, queryClient),
        onError: (error) => showAlert("error", error),
    });

    return {
        rows: listQuery.data,
        isLoading: listQuery.isLoading,
        saveSoftware: saveMutation.mutate,
        checkUser: checkMutation.mutate,
        isMutating: saveMutation.isPending || checkMutation.isPending,
    };
}
