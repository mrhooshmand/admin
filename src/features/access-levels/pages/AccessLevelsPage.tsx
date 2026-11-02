import { useMemo } from "react";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Page } from "@/shared/components/page/Page";
import { PageFilters } from "@/shared/components/page-filters";
import { DataTable } from "@/shared/table/DataTable";
import { useSearchRequest } from "@/shared/search/hooks/useSearchRequest";
import { AccessLevelsFilterForm } from "@/features/access-levels/components/AccessLevelsFilterForm";
import { AccessLevelsToolbar } from "@/features/access-levels/components/AccessLevelsToolbar";
import { getAccessLevelColumns } from "@/features/access-levels/columns/accessLevelColumns";
import { INITIAL_ACCESS_LEVEL_FILTERS } from "@/features/access-levels/constants";
import { useAccessLevelDialogs } from "@/features/access-levels/hooks/useAccessLevelDialogs";
import { useAccessLevels } from "@/features/access-levels/hooks/useAccessLevels";
import { AccessLevelFilters } from "@/features/access-levels/types/filters";

export default function AccessLevelsPage() {
    const { t } = useLocale();
    const search = useSearchRequest<AccessLevelFilters>({
        initialFilters: INITIAL_ACCESS_LEVEL_FILTERS,
        initialPageSize: 20,
        initialOrder: "id",
        initialOrderType: "desc",
    });
    const rowOffset = (search.request.page - 1) * search.request.pageSize;
    const { levels, isLoading, isMutating, saveLevel, deleteLevel } = useAccessLevels(search.request);
    const dialogs = useAccessLevelDialogs({ saveLevel, deleteLevel });

    const columns = useMemo(
        () =>
            getAccessLevelColumns({
                labels: {
                    role: t("accessLevels.role"),
                    creator: t("accessLevels.creator"),
                    status: t("accessLevels.status"),
                    active: t("accessLevels.active"),
                    inactive: t("accessLevels.inactive"),
                    actions: t("common.actions"),
                },
                onEdit: dialogs.editLevel,
                onDelete: dialogs.deleteLevel,
                onUsers: dialogs.viewUsers,
            }),
        [dialogs.deleteLevel, dialogs.editLevel, dialogs.viewUsers, t],
    );

    return (
        <Page title={t("nav.accessLevels")}>
            <PageFilters
                title={t("common.search")}
                actions={<AccessLevelsToolbar onAdd={dialogs.addLevel} />}
            >
                <AccessLevelsFilterForm onSubmit={(filters) => search.setFilters(filters)} />
            </PageFilters>
            <DataTable
                columns={columns}
                data={levels?.data ?? []}
                isLoading={isLoading}
                meta={{ rowOffset, isMutating }}
                emptyMessage={t("accessLevels.empty")}
                pagination={{
                    page: levels?.pagination?.page ?? 1,
                    totalPages: levels?.pagination?.totalPages ?? 1,
                    onPageChange: search.setPage,
                }}
                sorting={{
                    mode: "server",
                    order: search.request.order,
                    orderType: search.request.orderType,
                    onChange: search.setSorting,
                }}
            />
        </Page>
    );
}
