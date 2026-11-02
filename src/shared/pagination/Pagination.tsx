import {
    Pagination as ShadcnPagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/shared/ui/pagination"
import {getPaginationItems} from "@/shared/pagination/getPaginationItems.ts";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({page, totalPages, onPageChange}: PaginationProps) {
    const hasPrevious = page > 1;
    const hasNext = page < totalPages;
    const pages = getPaginationItems({
        currentPage: page,
        totalPages,
    });
    const handlePageClick = (pageNumber: number) => {
        if (pageNumber === page || pageNumber < 1 || pageNumber > totalPages) return;
        onPageChange(pageNumber);
    };
    if (totalPages <= 1) {
        return null;
    }
    return (
        <ShadcnPagination className="justify-end px-3 py-2.5">
            <PaginationContent className="gap-1">
                <PaginationItem>
                    <PaginationPrevious
                        text=""
                        size="icon"
                        aria-disabled={!hasPrevious}
                        className={!hasPrevious ? "pointer-events-none opacity-40 shadow-none" : "shadow-none"}
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageClick(page - 1);
                        }}
                    />
                </PaginationItem>
                {pages.map((item, index) =>
                    item === "..." ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                            <span className="px-2">...</span>
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={item}>
                            <PaginationLink
                                isActive={item === page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageClick(item);
                                }}
                            >
                                {item}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}
                <PaginationItem>
                    <PaginationNext
                        text=""
                        size="icon"
                        aria-disabled={!hasNext}
                        className={!hasNext ? "pointer-events-none opacity-40 shadow-none" : "shadow-none"}
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageClick(page + 1)
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </ShadcnPagination>
    )
}
