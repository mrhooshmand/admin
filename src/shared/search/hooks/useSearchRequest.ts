import {useState} from "react";

import {SearchRequest} from "@/shared/api/types/search-request.ts";

import {
    DEFAULT_ORDER,
    DEFAULT_ORDER_TYPE,
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
} from "../constants";

import {
    SearchRequestOptions,
    Sorting,
    UseSearchRequestResult,
} from "../types";

export function useSearchRequest<TFilters>(
    options: SearchRequestOptions<TFilters>
): UseSearchRequestResult<TFilters> {
    const {
        initialFilters,
        initialPage = DEFAULT_PAGE,
        initialPageSize = DEFAULT_PAGE_SIZE,
        initialOrder = DEFAULT_ORDER,
        initialOrderType = DEFAULT_ORDER_TYPE,
    } = options;

    const [request, setRequest] = useState<SearchRequest<TFilters>>({
        fields: initialFilters,
        page: initialPage,
        pageSize: initialPageSize,
        order: initialOrder,
        orderType: initialOrderType,
    });

    const setFilters = (filters: TFilters) => {
        setRequest((prev) => ({
            ...prev,
            fields: filters,
            page: DEFAULT_PAGE,
        }));
    };

    const updateFilters = (filters: Partial<TFilters>) => {
        setRequest((prev) => ({
            ...prev,
            fields: {
                ...prev.fields,
                ...filters,
            },
            page: DEFAULT_PAGE,
        }));
    };

    const setPage = (page: number) => {
        setRequest((prev) => ({
            ...prev,
            page,
        }));
    };

    const setPageSize = (pageSize: number) => {
        setRequest((prev) => ({
            ...prev,
            pageSize,
            page: DEFAULT_PAGE,
        }));
    };

    const setSorting = ({order, orderType}: Sorting) => {
        setRequest((prev) => ({
            ...prev,
            order,
            orderType,
            page: DEFAULT_PAGE,
        }));
    };

    const resetFilters = () => {
        setRequest((prev) => ({
            ...prev,
            fields: initialFilters,
            page: DEFAULT_PAGE,
        }));
    };

    return {
        request,

        setFilters,

        updateFilters,

        setPage,

        setPageSize,

        setSorting,

        resetFilters,

        setRequest,
    };
}