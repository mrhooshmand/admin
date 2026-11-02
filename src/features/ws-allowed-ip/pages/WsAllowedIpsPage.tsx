import { useMemo } from "react";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Page } from "@/shared/components/page/Page";
import { DataTable } from "@/shared/table/DataTable";
import { useSearchRequest } from "@/shared/search/hooks/useSearchRequest";
import { getWsAllowedIpColumns } from "@/features/ws-allowed-ip/columns/wsAllowedIpColumns";
import { INITIAL_WS_ALLOWED_IP_FILTERS } from "@/features/ws-allowed-ip/constants";
import { useWsAllowedIpDialogs } from "@/features/ws-allowed-ip/hooks/useWsAllowedIpDialogs";
import { useWsAllowedIps } from "@/features/ws-allowed-ip/hooks/useWsAllowedIps";
import { WsAllowedIpFilters } from "@/features/ws-allowed-ip/types";

export default function WsAllowedIpsPage() {
    const { t } = useLocale();
    const search = useSearchRequest<WsAllowedIpFilters>({
        initialFilters: INITIAL_WS_ALLOWED_IP_FILTERS,
        initialPageSize: 20,
        initialOrder: "id",
        initialOrderType: "desc",
    });
    const rowOffset = (search.request.page - 1) * search.request.pageSize;
    const { rows, isLoading, isMutating, saveSoftware, checkUser } = useWsAllowedIps(search.request);
    const dialogs = useWsAllowedIpDialogs({ saveSoftware, checkUser });

    const columns = useMemo(
        () =>
            getWsAllowedIpColumns({
                labels: {
                    name: t("wsAllowed.name"),
                    ip: t("wsAllowed.ip"),
                    user: t("wsAllowed.user"),
                    software: t("wsAllowed.software"),
                    status: t("wsAllowed.status"),
                    blockStatus: t("wsAllowed.blockStatus"),
                    active: t("wsAllowed.active"),
                    inactive: t("wsAllowed.inactive"),
                    actions: t("common.actions"),
                },
                onEdit: dialogs.editSoftware,
                onCheck: dialogs.checkWsUser,
            }),
        [dialogs.checkWsUser, dialogs.editSoftware, t],
    );

    return (
        <Page>
            <DataTable
                columns={columns}
                data={rows?.data ?? []}
                isLoading={isLoading}
                meta={{ rowOffset, isMutating }}
                emptyMessage={t("wsAllowed.empty")}
                pagination={{
                    page: rows?.pagination?.page ?? 1,
                    totalPages: rows?.pagination?.totalPages ?? 1,
                    onPageChange: search.setPage,
                }}
            />
        </Page>
    );
}
