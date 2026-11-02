import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/ui/badge";
import { AccessLevelActions } from "@/features/access-levels/columns/AccessLevelActions";
import { AccessLevel } from "@/features/access-levels/types/types";

interface AccessLevelColumnLabels {
    role: string;
    creator: string;
    status: string;
    active: string;
    inactive: string;
    actions: string;
}

export const getAccessLevelColumns = ({
    labels,
    onEdit,
    onDelete,
    onUsers,
}: {
    labels: AccessLevelColumnLabels;
    onEdit: (level: AccessLevel) => void;
    onDelete: (level: AccessLevel) => void;
    onUsers: (level: AccessLevel) => void;
}): ColumnDef<AccessLevel>[] => [
    {
        id: "row",
        header: "#",
        cell: ({ row, table }) => (table.options.meta?.rowOffset ?? 0) + row.index + 1,
    },
    {
        accessorKey: "title",
        header: labels.role,
        enableSorting: true,
    },
    {
        accessorKey: "customer",
        header: labels.creator,
        cell: ({ row }) => row.original.customer || "—",
    },
    {
        accessorKey: "status",
        header: labels.status,
        cell: ({ row }) => (
            <Badge variant={row.original.status === 1 ? "default" : "destructive"}>
                {row.original.status === 1 ? labels.active : labels.inactive}
            </Badge>
        ),
    },
    {
        id: "actions",
        header: labels.actions,
        cell: ({ row, table }) => (
            <AccessLevelActions
                level={row.original}
                isMutating={table.options.meta?.isMutating ?? false}
                onEdit={onEdit}
                onDelete={onDelete}
                onUsers={onUsers}
            />
        ),
    },
];
