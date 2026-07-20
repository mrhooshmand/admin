import {Pagination} from "@/shared/pagination/Pagination.tsx";
import type { DataTablePaginationProps } from "@/shared/table/types"

export const DataTablePagination = ({pagination}: DataTablePaginationProps) => {
    return (
        pagination && (
            <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={pagination.onPageChange}
            />
        )
    )
}