import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import {
    createRole as createRoleApi,
    updateRole as updateRoleApi,
    deleteRole as deleteRoleApi, searchRoles,
} from "../api/roleApi";

import {Role} from "../types/types";
import {showAlert} from "@/shared/utils/errorHandler";
import {SearchRequest} from "@/shared/api/types/search-request.ts";
import {RolesFilters} from "@/features/roles/types/roles-filters.ts";

export function useRoles(request: SearchRequest<RolesFilters>) {
    const queryClient = useQueryClient();

    const rolesQuery = useQuery({
        queryKey: ["roles", request],
        queryFn: () => searchRoles(request),
    });

    const createMutation = useMutation({
        mutationFn: createRoleApi,
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: ["roles"],
            });
            showAlert(response.status, response.message);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({id, data}: { id: number; data: Partial<Role> }) =>
            updateRoleApi(id, data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: ["roles"],
            });
            showAlert(response.status, response.message);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteRoleApi,
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: ["roles"],
            });
            showAlert(response.status, response.message);
        },
    });

    return {
        // query
        roles: rolesQuery?.data ?? [],
        error: rolesQuery.error,
        refetch: rolesQuery.refetch,
        isLoading: rolesQuery.isLoading,

        // mutations
        createRole: createMutation.mutate,
        updateRole: updateMutation.mutate,
        deleteRole: deleteMutation.mutate,

        // state
        isMutating:
            createMutation.isPending ||
            updateMutation.isPending ||
            deleteMutation.isPending,
    };
}
