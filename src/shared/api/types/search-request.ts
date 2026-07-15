export interface SearchRequest<TFilters> {
    fields: TFilters;
    page: number;
    pageSize: number;
    order: string;
    orderType: "asc" | "desc";
}