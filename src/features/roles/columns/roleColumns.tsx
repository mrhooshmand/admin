"use client"

import {Role} from "@/features/roles/types/types.ts";
import {RoleActions} from "@/features/roles/columns/RoleActions.tsx";
import {ColumnDef, RowData} from "@tanstack/react-table";

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends RowData> {
        rowOffset: number;
        isMutating?: boolean;
    }
}
export const getRoleColumns = ({
                                   onEdit,
                                   onDelete,
                                   onView,
                               }: {
    onEdit: (role: Role) => void
    onDelete: (role: Role) => void
    onView: (role: Role) => void
}): ColumnDef<Role>[] => [
    {
        id: "row",
        header: "#",
        cell: ({row, table}) => (table.options?.meta?.rowOffset ?? 0) + row.index + 1
    },
    {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
    },
    {
        accessorKey: "description",
        header: "Description",
        enableSorting: false,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({row, table}) => {
            const role = row.original;
            if (role.name === "admin") return null;
            return (
                <RoleActions
                    role={role}
                    isMutating={table.options.meta?.isMutating ?? false}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                />
            );
        }
    }
]