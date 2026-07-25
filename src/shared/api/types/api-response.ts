import {Pagination} from "@/shared/api/types/pagination.ts";
import {ApiError} from "@/shared/api/types/api-error.ts";

export interface ApiResponse<T> {
    status: "success" | "error";
    message: string;
    data: T;
    pagination?: Pagination;
    errors?: ApiError;
}