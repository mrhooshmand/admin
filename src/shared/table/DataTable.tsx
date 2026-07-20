"use client"

import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
    TableMeta
} from "@tanstack/react-table"

import {
    Table
} from "@/shared/ui/table"
import {cn} from "@/lib/utils.ts";
import {TableSkeleton} from "@/shared/components/skeleton/tableSkeleton.tsx";
import type {
    DataTablePagination as DataTablePaginationProp,
    DataTableSorting,
} from "@/shared/table/types";
import {DataTablePagination} from "@/shared/table/DataTablePagination.tsx";
import {DataTableHeader} from "@/shared/table/DataTableHeader.tsx";
import {DataTableBody} from "@/shared/table/DataTableBody.tsx";
import {useDataTableSorting} from "@/shared/table/hooks/useDataTableSorting.ts";


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pagination?: DataTablePaginationProp
    sorting?: DataTableSorting
    meta?: TableMeta<TData>
    className?: string
    emptyMessage?: React.ReactNode
    isLoading: boolean
}

export function DataTable<TData, TValue>({
                                             data,
                                             columns,
                                             pagination,
                                             sorting,
                                             meta,
                                             className, emptyMessage, isLoading
                                         }: DataTableProps<TData, TValue>) {
    const {
        sortingState,
        handleSortingChange,
        manualSorting,
    } = useDataTableSorting(sorting);

    const table = useReactTable({
        data,
        columns,
        meta,
        state: {
            sorting: sortingState,
        },
        manualSorting,
        onSortingChange: handleSortingChange,
        getCoreRowModel: getCoreRowModel()
    })

    if (isLoading) return <TableSkeleton/>
    return (
        <div>
            <div
                className={cn(
                    "overflow-hidden",
                    className
                )}
            >
                <Table>
                    <DataTableHeader table={table}/>
                    <DataTableBody
                        table={table}
                        emptyMessage={emptyMessage}
                    />
                </Table>
            </div>
            <DataTablePagination pagination={pagination}/>
        </div>
    )
}