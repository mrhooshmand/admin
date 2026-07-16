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
    if (totalPages <= 1) {
        return null;
    }
    const handlePrevious = () => {
        if (!hasPrevious) return;
        onPageChange(page - 1);
    };

    const handleNext = () => {
        if (!hasNext) return;
        onPageChange(page + 1);
    };
    return (
        <ShadcnPagination className="mt-5">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        aria-disabled={!hasPrevious}
                        className={!hasPrevious ? "pointer-events-none opacity-50" : ""}
                        onClick={handlePrevious}
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
                                onClick={() => onPageChange(item)}
                            >
                                {item}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}
                <PaginationItem>
                    <PaginationNext
                        aria-disabled={!hasNext}
                        className={!hasNext ? "pointer-events-none opacity-50" : ""}
                        onClick={handleNext}
                    />
                </PaginationItem>
            </PaginationContent>
        </ShadcnPagination>
    )
}
