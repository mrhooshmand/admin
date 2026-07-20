import {useEffect, useState} from "react";
import {
    OnChangeFn,
    SortingState,
} from "@tanstack/react-table";

import {
    DEFAULT_ORDER,
    DEFAULT_ORDER_TYPE,
} from "@/shared/search/constants";

import type {DataTableSorting} from "../types";

export function useDataTableSorting(
    sorting?: DataTableSorting
) {
    const [sortingState, setSortingState] = useState<SortingState>(() => {
        if (!sorting) return [];

        return [
            {
                id: sorting.order,
                desc: sorting.orderType === "desc",
            },
        ];
    });

    const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
        const next =
            typeof updater === "function"
                ? updater(sortingState)
                : updater;

        setSortingState(next);

        if (!sorting) return;

        if (next.length) {
            sorting.onChange({
                order: next[0].id,
                orderType: next[0].desc ? "desc" : "asc",
            });
        } else {
            sorting.onChange({
                order: DEFAULT_ORDER,
                orderType: DEFAULT_ORDER_TYPE,
            });
        }
    };

    useEffect(() => {
        if (!sorting) return;

        setSortingState([
            {
                id: sorting.order,
                desc: sorting.orderType === "desc",
            },
        ]);
    }, [sorting?.order, sorting?.orderType]);

    return {
        sortingState,
        handleSortingChange,
        manualSorting: sorting?.mode === "server",
    };
}