export interface Pagination {
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
    order: string;
    orderType: "asc" | "desc";
}