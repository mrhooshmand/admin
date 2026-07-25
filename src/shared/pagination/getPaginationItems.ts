export type PaginationItem = number | "...";

interface GetPaginationItemsOptions {
    currentPage: number;
    totalPages: number;
    siblingCount?: number;
}

export function getPaginationItems({
                                       currentPage,
                                       totalPages,
                                       siblingCount = 1,
                                   }: GetPaginationItemsOptions): PaginationItem[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items: PaginationItem[] = [];

    const leftSibling = Math.max(currentPage - siblingCount, 2);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

    items.push(1);

    if (leftSibling > 2) {
        items.push("...");
    }

    for (let page = leftSibling; page <= rightSibling; page++) {
        items.push(page);
    }

    if (rightSibling < totalPages - 1) {
        items.push("...");
    }

    items.push(totalPages);

    return items;
}