export interface AccessLevel {
    id: number;
    title: string;
    role: string;
    module: string;
    status: number;
    customer: string;
}

export interface AccessLevelUser {
    name: string;
    status: string;
}

export interface ModuleOption {
    id: string;
    title: string;
}

export interface PermissionNode {
    id: string;
    title: string;
    kind: "group" | "check";
    defaultChecked: boolean;
    children: PermissionNode[];
}

export interface LevelInfo {
    title: string;
    active: boolean;
    nodes: PermissionNode[];
}

export interface AccessLevelPayload {
    title: string;
    roles: string[];
    status: "0" | "1";
    permissions: string[];
}
