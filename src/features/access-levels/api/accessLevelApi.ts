import api from "@/shared/utils/api";
import { ApiResponse } from "@/shared/api/types/api-response";
import { SearchRequest } from "@/shared/api/types/search-request";
import { asList, isTrexOk, toMutationResponse, toSearchResponse, trexMessage, TrexBody } from "@/shared/api/trex";
import {
    AccessLevel,
    AccessLevelPayload,
    AccessLevelUser,
    LevelInfo,
    ModuleOption,
} from "@/features/access-levels/types/types";
import { AccessLevelFilters } from "@/features/access-levels/types/filters";
import { normalizePermissions } from "@/features/access-levels/lib/permissions";

const base = "GDS/access/level";

function mapLevel(row: Record<string, unknown>): AccessLevel {
    return {
        id: Number(row.id),
        title: String(row.title ?? ""),
        role: String(row.role ?? ""),
        module: String(row.module ?? ""),
        status: Number(row.status ?? 0),
        customer: String(row.customer ?? ""),
    };
}

export async function searchAccessLevels(
    request: SearchRequest<AccessLevelFilters>,
): Promise<ApiResponse<AccessLevel[]>> {
    const { data } = await api.post<TrexBody>(`${base}/search`, {
        fields: request.fields,
        list: 1,
        start: (request.page - 1) * request.pageSize,
        pageSize: request.pageSize,
        order: request.order,
        orderType: request.orderType,
    });

    const rows = asList<Record<string, unknown>>(data.data).map(mapLevel);
    return toSearchResponse(data, request, rows);
}

export async function saveAccessLevel(id: number, payload: AccessLevelPayload) {
    const { data } = await api.post<TrexBody>(`${base}/update/${id}`, {
        fields: payload,
    });
    return toMutationResponse(data);
}

export async function deleteAccessLevel(id: number) {
    const { data } = await api.post<TrexBody>(`${base}/delete/${id}`);
    return toMutationResponse(data);
}

export async function getModules(): Promise<ModuleOption[]> {
    const { data } = await api.post<TrexBody>(`${base}/getModules`, {});
    if (!isTrexOk(data) && data.err !== undefined) {
        throw new Error(trexMessage(data.msg) || "Failed to load modules");
    }
    return asList<Record<string, unknown>>(data.data).map((item) => ({
        id: String(item.id),
        title: String(item.title ?? item.id ?? ""),
    }));
}

export async function getLevelInfo(id: number, modules: string[]): Promise<LevelInfo> {
    const { data } = await api.post<TrexBody>(`${base}/getLevelInfo/${id}`, {
        fields: { module: modules },
    });
    if (!isTrexOk(data) && data.err !== undefined) {
        throw new Error(trexMessage(data.msg) || "Failed to load permissions");
    }
    const status = data.status;
    return {
        title: String(data.title ?? ""),
        active: status === 1 || status === "1",
        nodes: normalizePermissions(data.permissions),
    };
}

export async function getRoleUsers(id: number): Promise<AccessLevelUser[]> {
    const { data } = await api.post<TrexBody>(`GDS/access/account/getRoleUsersList/${id}`, {});
    if (data.err === 1) return [];
    return asList<Record<string, unknown>>(data.data).map((item) => ({
        name: String(item.name ?? ""),
        status: String(item.status ?? ""),
    }));
}
