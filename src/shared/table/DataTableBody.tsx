import {flexRender, Table} from "@tanstack/react-table";
import {
    TableBody,
    TableCell,
    TableRow,
} from "@/shared/ui/table";
import "@tanstack/react-table";
import {cn} from "@/lib/utils.ts";


interface DataTableBodyProps<TData> {
    table: Table<TData>;
    emptyMessage?: React.ReactNode;
}

export function DataTableBody<TData>({
                                         table,
                                         emptyMessage,
                                     }: DataTableBodyProps<TData>) {
    const colSpan = table.getAllLeafColumns().length;
    return (
        <TableBody>
            {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className={cn(
                                'text-center',
                                cell.column.columnDef.meta?.cellClassName,
                            )}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell
                        colSpan={colSpan}
                        className="h-24 text-center"
                    >
                        {emptyMessage ?? "No results."}
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    );
}