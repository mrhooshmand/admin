"use client"

import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
    TableMeta, RowSelectionState
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
import {SelectionColumn} from "@/shared/table/SelectionColumn.tsx";
import {useEffect, useState} from "react";
import {
    OnChangeFn,
    SortingState,
} from "@tanstack/react-table";

import {
    DEFAULT_ORDER,
    DEFAULT_ORDER_TYPE,
} from "@/shared/search/constants";


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pagination?: DataTablePaginationProp
    sorting?: DataTableSorting
    meta?: TableMeta<TData>
    className?: string
    emptyMessage?: React.ReactNode
    isLoading: boolean
    selectable?: boolean;
    onSelectionChange?: (rows: TData[]) => void;
}

export function DataTable<TData, TValue>({
                                             data,
                                             columns,
                                             pagination,
                                             sorting,
                                             meta,
                                             className, emptyMessage, isLoading, selectable = false, onSelectionChange
                                         }: DataTableProps<TData, TValue>) {


    const [sortingState, setSortingState] = useState<SortingState>(
        sorting
            ? [
                {
                    id: sorting.order,
                    desc: sorting.orderType === "desc",
                },
            ]
            : []
    );

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

    useEffect(() => {
        if (!sorting) return;
        const next: SortingState = [
            {
                id: sorting.order,
                desc: sorting.orderType === "desc",
            },
        ];
        setSortingState(next);
    }, [sorting?.order, sorting?.orderType]);


    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

    useEffect(() => {
        setRowSelection({});
    }, [data]);

    const finalColumns = selectable
        ? [
            SelectionColumn<TData>(),
            ...columns,
        ]
        : columns;


    const table = useReactTable({
        data,
        columns: finalColumns,
        meta,
        state: {
            sorting: sortingState,
            rowSelection
        },
        manualSorting: sorting?.mode === 'server',
        onSortingChange: handleSortingChange,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel()
    })

    useEffect(() => {
        if (!onSelectionChange) return;
        onSelectionChange(
            table.getSelectedRowModel().rows.map(row => row.original)
        );
    }, [rowSelection]);

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