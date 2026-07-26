import {useUsers} from "../hooks/useUsers";
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
import {useState} from "react";
import {User} from "@/features/auth/types.ts";
import {BulkActionsBar} from "@/shared/table/BulkActionsBar.tsx";
import {Button} from "@/shared/ui/button.tsx";

export default function Users() {
    const search = useSearchRequest<UsersFilters>({
        initialFilters: INITIAL_USERS_FILTERS
    });
    const rowOffset = (search.request.page - 1) * search.request.pageSize;
    const {
        users,
        createUser: createUserMutation,
        updateUser: updateUserMutation,
        deleteUser: deleteUserMutation,
        deleteUsers: deleteUsersMutation,
        isMutating,
        isLoading,
    } = useUsers(search.request);

    const dialogs = useUserDialogs({
        createUserMutation,
        updateUserMutation,
        deleteUserMutation,
        deleteUsersMutation,
        isMutating,
    });

    const columns = getUserColumns({
        onEdit: dialogs.editUser,
        onDelete: dialogs.deleteUser,
        onView: dialogs.viewUser,
    })
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    return (
        <Page>
            <PageFilters actions={
                <UsersToolbar onAdd={dialogs.addUser} onExport={() => console.log('123')}/>}
            >
                <UsersFilterForm onSubmit={(filters: UsersFilters) =>
                    search.setFilters(filters)
                }/>
            </PageFilters>
            <BulkActionsBar count={selectedUsers.length}>
                <Button
                    variant="destructive"
                    onClick={() => dialogs.deleteUsers(selectedUsers.map(u => u.id))}
                >
                    Delete
                </Button>
                <Button variant="outline">Change Status</Button>
            </BulkActionsBar>
            <DataTable selectable onSelectionChange={setSelectedUsers} columns={columns} data={users?.data ?? []}
                       isLoading={isLoading}
                       meta={{rowOffset, isMutating,}}
                       emptyMessage="User not found"
                       pagination={{
                           page: users.pagination?.page,
                           totalPages: users.pagination?.totalPages,
                           onPageChange: search.setPage,
                       }}
                       sorting={{
                           mode: "server",
                           order: search.request.order,
                           orderType: search.request.orderType,
                           onChange: search.setSorting,
                       }}
            />
        </Page>
    );
}