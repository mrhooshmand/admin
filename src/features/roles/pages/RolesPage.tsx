import {Page} from "@/shared/components/page/Page.tsx";
import {PageFilters} from "@/shared/components/page-filters";
import {RolesToolbar} from "@/features/roles/components/RolesToolbar.tsx";
import {RolesFilterForm} from "@/features/roles/components/RolesFilterForm.tsx";
import {useSearchRequest} from "@/shared/search/hooks/useSearchRequest.ts";
import {INITIAL_ROLES_FILTERS} from "@/features/roles/constants.ts";
import {RolesFilters} from "@/features/roles/types/roles-filters.ts";
import {useRoleDialogs} from "@/features/roles/hooks/useRoleDialogs.tsx";
import {getRoleColumns} from "@/features/roles/columns/roleColumns.tsx";
import {useRoles} from "@/features/roles/hooks/useRoles.ts";
import {DataTable} from "@/shared/table/DataTable.tsx";

export default function Roles() {
    const search = useSearchRequest<RolesFilters>({
        initialFilters: INITIAL_ROLES_FILTERS
    });
    const rowOffset = (search.request.page - 1) * search.request.pageSize;
    const {
        roles,
        createRole: createRoleMutation,
        updateRole: updateRoleMutation,
        deleteRole: deleteRoleMutation,
        isMutating,
        isLoading,
    } = useRoles(search.request);

    const dialogs = useRoleDialogs({
        createRoleMutation,
        updateRoleMutation,
        deleteRoleMutation,
        isMutating,
    });
    const columns = getRoleColumns({
        onEdit: dialogs.editRole,
        onDelete: dialogs.deleteRole,
        onView: dialogs.viewRole,
    })
    return (
        <Page>
            <PageFilters actions={
                <RolesToolbar onAdd={() => null} onExport={() => console.log('123')}/>}
            >
                <RolesFilterForm onSubmit={() => null}/>
            </PageFilters>
            <DataTable columns={columns} data={roles?.data ?? []} isLoading={isLoading}
                       meta={{rowOffset, isMutating,}}
                       emptyMessage="User not found"
                       pagination={{
                           page: roles.pagination?.page,
                           totalPages: roles.pagination?.totalPages,
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
