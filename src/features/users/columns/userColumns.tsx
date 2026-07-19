"use client"

import {User} from "@/features/users/types/types.ts";
import {UserActions} from "@/features/users/columns/UserActions.tsx";
import {ColumnDef, RowData} from "@tanstack/react-table";

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends RowData> {
        rowOffset: number;
        isMutating?: boolean;
    }
}
export const getUserColumns = ({
                                   onEdit,
                                   onDelete,
                                   onView,
                               }: {
    onEdit: (user: User) => void
    onDelete: (user: User) => void
    onView: (user: User) => void
}): ColumnDef<User>[] => [
    {
        id: "row",
        header: "#",
        cell: ({row, table}) => (table.options?.meta?.rowOffset ?? 0) + row.index + 1
    },
    {
        accessorKey: "username",
        header: "Username",
        enableSorting: true,
    },
    {
        accessorKey: "full_name",
        header: "Name",
        enableSorting: false,
    },
    {
        accessorKey: "email",
        header: "Email",
        enableSorting: false,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({row, table}) => {
            return (
                <UserActions
                    user={row.original}
                    isMutating={table.options.meta?.isMutating ?? false}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                />
            );
        }
    }
]