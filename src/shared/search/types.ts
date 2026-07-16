import {Dispatch, SetStateAction} from "react";
import {SearchRequest} from "@/shared/api/types/search-request.ts";

export type SortDirection = "asc" | "desc";

export interface Sorting {
    order: string;
    orderType: SortDirection;
}

export interface SearchRequestOptions<TFilters> {
    initialFilters: TFilters;
    initialPage?: number;
    initialPageSize?: number;
    initialOrder?: string;
    initialOrderType?: SortDirection;
}

export interface UseSearchRequestResult<TFilters> {
    request: SearchRequest<TFilters>;

    setFilters: (filters: TFilters) => void;

    updateFilters: (filters: Partial<TFilters>) => void;

    setPage: (page: number) => void;

    setPageSize: (pageSize: number) => void;

    setSorting: (sorting: Sorting) => void;

    resetFilters: () => void;

    setRequest: Dispatch<SetStateAction<SearchRequest<TFilters>>>;
}