import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/shared/ui/checkbox";

export function SelectionColumn<TData>(): ColumnDef<TData> {
    return {
        id: "select",

        enableSorting: false,

        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllRowsSelected()}
                onCheckedChange={(value) =>
                    table.toggleAllRowsSelected(!!value)
                }
            />
        ),

        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onCheckedChange={(value) =>
                    row.toggleSelected(!!value)
                }
            />
        ),
    };
}