import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/shared/ui/pagination"
import {PaginationType} from "@/shared/api/types/pagination.ts";

interface PaginationProps {
    pagination: PaginationType;
    onPageChange: (pageNumber: number) => void;
}

export function PaginationComponent({pagination, onPageChange}: PaginationProps) {
    const {page, totalPages} = pagination;
    const hasPrevious = page > 1;
    const hasNext = page < totalPages;
    const pages = Array.from(
        {length: totalPages},
        (_, i) => i + 1
    );
    return (
        pagination && totalPages > 1 ?
            <Pagination className="mt-5">
                <PaginationContent>
                    {hasPrevious && (
                        <PaginationItem>
                            <PaginationPrevious onClick={() => onPageChange(page - 1)}/>
                        </PaginationItem>
                    )}
                    {pages.map(pageNumber => (
                        <PaginationItem key={pageNumber}>
                            <PaginationLink
                                isActive={pageNumber === page}
                                onClick={() => onPageChange(pageNumber)}
                            >
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {hasNext && (
                        <PaginationItem>
                            <PaginationNext onClick={() => onPageChange(page + 1)}/>
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
            : ''
    )
}
