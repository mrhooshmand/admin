import {
    flexRender,
    Table,
} from "@tanstack/react-table";
import {
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import {ArrowDown, ArrowUp, ArrowUpDown} from "lucide-react";
import {cn} from "@/lib/utils.ts";
import "@tanstack/react-table";

interface DataTableHeaderProps<TData> {
    table: Table<TData>;
}

export function DataTableHeader<TData>({
                                           table,
                                       }: DataTableHeaderProps<TData>) {
    return (
        <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        const sort = header.column.getIsSorted();

                        return (
                            <TableHead
                                key={header.id}
                                onClick={
                                    header.column.getCanSort()
                                        ? header.column.getToggleSortingHandler()
                                        : undefined
                                }
                                className={cn(
                                    "text-center",
                                    header.column.columnDef.meta?.headerClassName,
                                    header.column.getCanSort() && "cursor-pointer select-none",
                                )
                                }
                            >
                                <div className={cn(
                                    "flex items-center gap-2 justify-center",
                                    header.column.columnDef.meta?.headerClassName
                                )}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}

                                    {sort === "asc" && (
                                        <ArrowUp className="h-3 w-3"/>
                                    )}

                                    {sort === "desc" && (
                                        <ArrowDown className="h-3 w-3"/>
                                    )}

                                    {sort === false &&
                                        header.column.getCanSort() && (
                                            <ArrowUpDown className="h-3 w-3 opacity-40"/>
                                        )}
                                </div>
                            </TableHead>
                        );
                    })}
                </TableRow>
            ))}
        </TableHeader>
    );
}