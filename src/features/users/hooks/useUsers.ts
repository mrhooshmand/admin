import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import {
    createUser as createUserApi,
    updateUser as updateUserApi,
    deleteUser as deleteUserApi, searchUsers, deleteUsers,
} from "../api/userApi";

import {User} from "../types/types";
import {showAlert} from "@/shared/utils/errorHandler";
import {SearchRequest} from "@/shared/api/types/search-request.ts";
import {UsersFilters} from "@/features/users/types/users-filters.ts";

export function useUsers(request: SearchRequest<UsersFilters>) {
    const queryClient = useQueryClient();

    const usersQuery = useQuery({
        queryKey: ["users", request],
        queryFn: () => searchUsers(request),
    });

    const createMutation = useMutation({
        mutationFn: createUserApi,
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
            showAlert(response.status, response.message);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({id, data}: { id: number; data: Partial<User> }) =>
            updateUserApi(id, data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
            showAlert(response.status, response.message);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUserApi,
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
            showAlert(response.status, response.message);
        },
    });

    const deleteBulkMutation = useMutation({
        mutationFn: deleteUsers,
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
            showAlert(response.status, response.message);
        },
    });

    return {
        // query
        users: usersQuery.data,
        error: usersQuery.error,
        refetch: usersQuery.refetch,
        isLoading: usersQuery.isLoading,

        // mutations
        createUser: createMutation.mutate,
        updateUser: updateMutation.mutate,
        deleteUser: deleteMutation.mutate,
        deleteUsers: deleteBulkMutation.mutate,

        // state
        isMutating:
            createMutation.isPending ||
            updateMutation.isPending ||
            deleteMutation.isPending ||
            deleteBulkMutation.isPending,
    };
}
