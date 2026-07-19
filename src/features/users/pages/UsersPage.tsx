import {useUsers} from "../hooks/useUsers";
import {TableSkeleton} from "@/shared/components/skeleton/tableSkeleton";
import {Page} from "@/shared/components/page/Page.tsx";
import {PageFilters} from "@/shared/components/page-filters";
import {UsersToolbar} from "@/features/users/components/UsersToolbar.tsx";
import {UsersFilterForm} from "@/features/users/components/UsersFilterForm.tsx";
import {useSearchRequest} from "@/shared/search/hooks/useSearchRequest.ts";
import {UsersFilters} from "@/features/users/types/users-filters.ts";
import {INITIAL_USERS_FILTERS} from "@/features/users/constants.ts";
import {DataTable} from "@/shared/table/DataTable.tsx";
import {getUserColumns} from "@/features/users/columns/userColumns.tsx";
import {useUserDialogs} from "@/features/users/hooks/useUserDialogs.tsx";

export default function Users() {
    const search = useSearchRequest<UsersFilters>({
        initialFilters: INITIAL_USERS_FILTERS
    });
    const rowOffset = (search.request.page - 1) * search.request.pageSize;

    const {
        users,
        error,
        refetch,
        createUser: createUserMutation,
        updateUser: updateUserMutation,
        deleteUser: deleteUserMutation,
        isMutating,
        isLoading,
    } = useUsers(search.request);

    const dialogs = useUserDialogs({
        createUserMutation,
        updateUserMutation,
        deleteUserMutation,
        isMutating,
    });

    const columns = getUserColumns({
        onEdit: dialogs.editUser,
        onDelete: dialogs.deleteUser,
        onView: dialogs.viewUser,
    })

    if (error) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-500 mb-4">{error.message}</div>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }
    return (
        <Page>
            <PageFilters actions={
                <UsersToolbar onAdd={dialogs.addUser} onExport={() => console.log('123')}/>}
            >
                <UsersFilterForm onSubmit={(filters: UsersFilters) =>
                    search.setFilters(filters)
                }/>
            </PageFilters>
            {isLoading ? (
                <TableSkeleton/>
            ) : (
                <>
                    <DataTable columns={columns} data={users?.data ?? []} meta={{rowOffset, isMutating,}}
                               emptyMessage="User not found"
                               pagination={{
                                   page: users.pagination.page,
                                   totalPages: users.pagination.totalPages,
                                   onPageChange: search.setPage,
                               }}/>
                </>
            )}
        </Page>
    );
}