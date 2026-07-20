"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    OnChangeFn,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table"
import {TableMeta} from "@tanstack/react-table"
import {cn} from "@/lib/utils.ts";
import {Pagination} from "@/shared/pagination/Pagination.tsx";
import {ArrowUpDown, ArrowUp, ArrowDown} from "lucide-react";
import {TableSkeleton} from "@/shared/components/skeleton/tableSkeleton.tsx";
import {DataTableSorting} from "@/shared/table/types.ts";
import {useEffect, useState} from "react";
import {DEFAULT_ORDER, DEFAULT_ORDER_TYPE} from "@/shared/search/constants.ts";

interface DataTablePagination {
    page: number,
    totalPages: number,
    onPageChange: (page: number) => void;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pagination?: DataTablePagination
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
    const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
        const next =
            typeof updater === "function"
                ? updater(sortingState)
                : updater;
        setSortingState(next);
        if (!sorting) return;
        if (next.length) {
            sorting.onChange({
                order: next[0].id,
                orderType: next[0].desc ? "desc" : "asc",
            });
        } else {
            sorting.onChange({
                order: DEFAULT_ORDER,
                orderType: DEFAULT_ORDER_TYPE,
            });
        }
    };
    const [sortingState, setSortingState] = useState<SortingState>(() => {
        if (!sorting) return [];
        return [
            {
                id: sorting.order,
                desc: sorting.orderType === "desc",
            },
        ];
    });
    const table = useReactTable({
        data,
        columns,
        meta,
        state: {
            sorting: sortingState,
        },
        manualSorting: sorting?.mode === "server",
        onSortingChange: handleSortingChange,
        getCoreRowModel: getCoreRowModel()
    })
    useEffect(() => {
        if (!sorting) return;
        setSortingState([
            {
                id: sorting.order,
                desc: sorting.orderType === "desc",
            },
        ]);
    }, [sorting?.order, sorting?.orderType]);
    return (
        isLoading ? (
            <TableSkeleton/>
        ) : (
            <div>
                <div
                    className={cn(
                        "overflow-hidden",
                        className
                    )}
                >
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        const sort = header.column.getIsSorted();
                                        return (
                                            <TableHead
                                                key={header.id}
                                                onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {sort === "asc" && <ArrowUp className="h-3 w-3"/>}
                                                    {sort === "desc" && <ArrowDown className="h-3 w-3"/>}
                                                    {sort === false && header.column.getCanSort() && (
                                                        <ArrowUpDown className="h-3 w-3 opacity-40"/>
                                                    )}
                                                </div>
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        {emptyMessage ?? "No results."}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {pagination && (
                    <Pagination
                        page={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={pagination.onPageChange}
                    />
                )}
            </div>
        )
    )
}