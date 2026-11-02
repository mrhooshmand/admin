import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showAlert } from "@/shared/utils/errorHandler";
import { SearchRequest } from "@/shared/api/types/search-request";
import { ApiResponse } from "@/shared/api/types/api-response";
import { AccessLevelFilters } from "@/features/access-levels/types/filters";
import { AccessLevelPayload } from "@/features/access-levels/types/types";
import {
    deleteAccessLevel,
    saveAccessLevel,
    searchAccessLevels,
} from "@/features/access-levels/api/accessLevelApi";

function settle(response: ApiResponse<null>, queryClient: ReturnType<typeof useQueryClient>) {
    showAlert(response.status, response.message);
    if (response.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["access-levels"] });
    }
}

export function useAccessLevels(request: SearchRequest<AccessLevelFilters>) {
    const queryClient = useQueryClient();

    const levelsQuery = useQuery({
        queryKey: ["access-levels", request],
        queryFn: () => searchAccessLevels(request),
    });

    const saveMutation = useMutation({
        mutationKey: ["access-levels", "save"],
        mutationFn: ({ id, data }: { id: number; data: AccessLevelPayload }) =>
            saveAccessLevel(id, data),
        onSuccess: (response) => settle(response, queryClient),
        onError: (error) => showAlert("error", error),
    });

    const deleteMutation = useMutation({
        mutationKey: ["access-levels", "delete"],
        mutationFn: deleteAccessLevel,
        onSuccess: (response) => settle(response, queryClient),
        onError: (error) => showAlert("error", error),
    });

    return {
        levels: levelsQuery.data,
        isLoading: levelsQuery.isLoading,
        saveLevel: saveMutation.mutate,
        deleteLevel: deleteMutation.mutate,
        isMutating: saveMutation.isPending || deleteMutation.isPending,
    };
}
