import api from "@/shared/utils/api";
import { ApiResponse } from "@/shared/api/types/api-response";
import { SearchRequest } from "@/shared/api/types/search-request";
import { asList, toMutationResponse, toSearchResponse, TrexBody } from "@/shared/api/trex";
import { CheckUserPayload, NamedOption, WsAllowedIp, WsAllowedIpFilters } from "@/features/ws-allowed-ip/types";

const base = "GDS/access/WSAllowedIP";

function mapRow(row: Record<string, unknown>): WsAllowedIp {
    const label = String(row.en ?? row.status ?? "");
    const active = label === "فعال" || label.toLowerCase() === "active" || row.status === 1 || row.status === "1";
    return {
        id: Number(row.id),
        customer: String(row.customer ?? ""),
        ip: String(row.ip ?? "").replace(/,/g, " - "),
        user: String(row.user ?? ""),
        pass: String(row.pass ?? ""),
        softwareName: String(row.software_name ?? ""),
        active,
        statusLabel: label,
        blockStatus: String(row.block_status ?? ""),
    };
}

function mapOptions(value: unknown): NamedOption[] {
    return asList<Record<string, unknown>>(value).map((item) => ({
        id: String(item.id ?? ""),
        title: String(item.title ?? item.id ?? ""),
    }));
}

export async function searchWsAllowedIps(
    request: SearchRequest<WsAllowedIpFilters>,
): Promise<ApiResponse<WsAllowedIp[]>> {
    const { data } = await api.post<TrexBody>(`${base}/search`, {
        fields: {},
        start: (request.page - 1) * request.pageSize,
        pageSize: request.pageSize,
    });
    const rows = asList<Record<string, unknown>>(data.data).map(mapRow);
    return toSearchResponse(data, request, rows);
}

export async function saveSoftware(id: number, softwareName: string) {
    const { data } = await api.post<TrexBody>(`${base}/save`, {
        fields: { id, software_name: softwareName },
        page: false,
    });
    return toMutationResponse(data);
}

export async function checkWsUser(payload: CheckUserPayload) {
    const { data } = await api.post<TrexBody>(`${base}/checkWSUser`, {
        fields: payload,
        page: false,
    });
    return toMutationResponse(data);
}

export async function getSoftwareNames(): Promise<NamedOption[]> {
    const { data } = await api.post<TrexBody>(`${base}/getSoftwareNames`, {});
    return mapOptions(data.data);
}

export async function getRoutes(): Promise<NamedOption[]> {
    const { data } = await api.post<TrexBody>("GDS/inventory/priceClass/get_routes_by_airline", {});
    return mapOptions(data.data);
}
