import {Sorting} from "@/shared/search/types";

export type DataTableSorting =
    | {
    mode: "server";
    order: string;
    orderType: "asc" | "desc";
    onChange: (sorting: Sorting) => void;
}
    | {
    mode: "client";
};