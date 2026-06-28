import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";

import {
    getUsers,
    createUser as createUserApi,
    updateUser as updateUserApi,
    deleteUser as deleteUserApi
} from "../api/userApi";

import { User } from "../types";


export function useUsers() {

    const queryClient = useQueryClient();


    const usersQuery = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });



    const createMutation = useMutation({

        mutationFn: createUserApi,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"]
            });
        }

    });



    const updateMutation = useMutation({

        mutationFn: ({
            id,
            data
        }: {
            id: number;
            data: Partial<User>;
        }) =>
            updateUserApi(id, data),


        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"]
            });
        }

    });



    const deleteMutation = useMutation({

        mutationFn: deleteUserApi,


        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"]
            });
        }

    });



    return {

        // query
        users: usersQuery.data ?? [],
        error: usersQuery.error,
        refetch: usersQuery.refetch,
        isLoading: usersQuery.isLoading,


        // mutations
        createUser: createMutation.mutate,
        updateUser: updateMutation.mutate,
        deleteUser: deleteMutation.mutate,


        // state
        isMutating:
            createMutation.isPending ||
            updateMutation.isPending ||
            deleteMutation.isPending,

    };

}