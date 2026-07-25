export interface DataTablePaginationProps {
    pagination?: {
        page: number
        totalPages: number
        onPageChange: (page: number) => void
    }
}

import { TableMeta } from "@tanstack/react-table";

export interface DataTablePagination {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export interface DataTableSorting {
    mode: "server";
    order: string;
    orderType: "asc" | "desc";
    onChange: (sorting: {
        order: string;
        orderType: "asc" | "desc";
    }) => void;
}

export interface DataTableProps<TData> {
    meta?: TableMeta<TData>;
}
declare module "@tanstack/react-table" {
    interface ColumnMeta<TData, TValue> {
        headerClassName?: string;
        cellClassName?: string;
    }
}