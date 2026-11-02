import { ApiResponse } from "@/shared/api/types/api-response";
import { Pagination } from "@/shared/api/types/pagination";
import { SearchRequest } from "@/shared/api/types/search-request";

export interface TrexPagination {
    currentPage?: number;
    lastPage?: number;
    total?: number;
}

export interface TrexBody<T = unknown> {
    err?: number;
    msg?: unknown;
    data?: T;
    pagination?: TrexPagination;
    status?: string | number;
    message?: string;
    title?: string;
    permissions?: unknown;
}

export function asList<T>(value: unknown): T[] {
    if (Array.isArray(value)) return value as T[];
    if (value && typeof value === "object") {
        return Object.keys(value)
            .filter((key) => /^\d+$/.test(key))
            .sort((a, b) => Number(a) - Number(b))
            .map((key) => (value as Record<string, T>)[key]);
    }
    return [];
}

export function trexMessage(message: unknown): string {
    if (typeof message === "string") return message;
    if (!Array.isArray(message)) return "";
    return message
        .map((item) => {
            if (typeof item === "string") return item;
            if (item && typeof item === "object" && "msg" in item) {
                return String((item as { msg: unknown }).msg ?? "");
            }
            return "";
        })
        .filter(Boolean)
        .join("\n");
}

export function isTrexOk(body: TrexBody): boolean {
    return body.err === 0 || body.status === "success" || body.status === 0;
}

export function toSearchResponse<TFilters, T>(
    body: TrexBody,
    request: SearchRequest<TFilters>,
    rows: T[],
): ApiResponse<T[]> {
    const pagination: Pagination = {
        page: Number(body.pagination?.currentPage ?? request.page),
        totalPages: Number(body.pagination?.lastPage ?? 1),
        total: Number(body.pagination?.total ?? rows.length),
        pageSize: request.pageSize,
        order: request.order,
        orderType: request.orderType,
    };

    return {
        status: isTrexOk(body) || body.err === undefined ? "success" : "error",
        message: trexMessage(body.msg ?? body.message),
        data: rows,
        pagination,
    };
}

export function toMutationResponse(body: TrexBody): ApiResponse<null> {
    return {
        status: isTrexOk(body) ? "success" : "error",
        message: trexMessage(body.msg ?? body.message),
        data: null,
    };
}
