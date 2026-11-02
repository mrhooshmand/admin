import { PermissionNode } from "@/features/access-levels/types/types";
import { asList } from "@/shared/api/trex";

function checkedFlag(value: unknown): boolean | null {
    if (value === 0 || value === "0") return false;
    if (value === 1 || value === "1") return true;
    return null;
}

function normalizeNode(raw: Record<string, unknown>): PermissionNode {
    const flag = checkedFlag(raw.checked);
    if (flag !== null) {
        return {
            id: String(raw.id),
            title: String(raw.title ?? ""),
            kind: "check",
            defaultChecked: flag,
            children: [],
        };
    }

    const childRecords = asList<Record<string, unknown>>(raw.childs);
    const operations = asList<Record<string, unknown>>(raw.operations);
    const children: PermissionNode[] = childRecords.map((child) => {
        const nested = asList(child.childs).length ? child.childs : child.operations;
        return {
            id: String(child.id),
            title: String(child.title ?? ""),
            kind: "group",
            defaultChecked: false,
            children: asList<Record<string, unknown>>(nested).map(normalizeNode),
        };
    });

    for (const operation of operations) {
        children.push({
            id: String(operation.id),
            title: String(operation.title ?? ""),
            kind: "check",
            defaultChecked: checkedFlag(operation.checked) === true,
            children: [],
        });
    }

    return {
        id: String(raw.id ?? ""),
        title: String(raw.title ?? ""),
        kind: "group",
        defaultChecked: false,
        children,
    };
}

export function normalizePermissions(value: unknown): PermissionNode[] {
    return asList<Record<string, unknown>>(value).map(normalizeNode);
}

export function collectCheckedIds(nodes: PermissionNode[]): string[] {
    const ids: string[] = [];
    const walk = (list: PermissionNode[]) => {
        for (const node of list) {
            if (node.kind === "check" && node.defaultChecked) ids.push(node.id);
            walk(node.children);
        }
    };
    walk(nodes);
    return ids;
}
