export interface PaginationType {
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
    order: string;
    orderType: "asc" | "desc";
}