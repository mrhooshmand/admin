import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/ui/badge";
import { WsAllowedIpActions } from "@/features/ws-allowed-ip/columns/WsAllowedIpActions";
import { WsAllowedIp } from "@/features/ws-allowed-ip/types";

interface WsAllowedIpColumnLabels {
    name: string;
    ip: string;
    user: string;
    software: string;
    status: string;
    blockStatus: string;
    active: string;
    inactive: string;
    actions: string;
}

export const getWsAllowedIpColumns = ({
    labels,
    onEdit,
    onCheck,
}: {
    labels: WsAllowedIpColumnLabels;
    onEdit: (row: WsAllowedIp) => void;
    onCheck: (row: WsAllowedIp) => void;
}): ColumnDef<WsAllowedIp>[] => [
    {
        id: "row",
        header: "#",
        cell: ({ row, table }) => (table.options.meta?.rowOffset ?? 0) + row.index + 1,
    },
    {
        accessorKey: "customer",
        header: labels.name,
        cell: ({ row }) => row.original.customer || "—",
    },
    {
        accessorKey: "ip",
        header: labels.ip,
    },
    {
        accessorKey: "user",
        header: labels.user,
    },
    {
        accessorKey: "softwareName",
        header: labels.software,
        cell: ({ row }) => row.original.softwareName || "—",
    },
    {
        id: "status",
        header: labels.status,
        cell: ({ row }) => (
            <Badge variant={row.original.active ? "default" : "destructive"}>
                {row.original.active ? labels.active : labels.inactive}
            </Badge>
        ),
    },
    {
        accessorKey: "blockStatus",
        header: labels.blockStatus,
        cell: ({ row }) => row.original.blockStatus || "—",
    },
    {
        id: "actions",
        header: labels.actions,
        cell: ({ row, table }) => (
            <WsAllowedIpActions
                row={row.original}
                isMutating={table.options.meta?.isMutating ?? false}
                onEdit={onEdit}
                onCheck={onCheck}
            />
        ),
    },
];
