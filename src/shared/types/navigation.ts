import {LucideIcon} from "lucide-react";

export interface NavItem {
    title: string;
    to?: string;
    icon?: LucideIcon;
    children?: NavItem[];
}

import {
    LayoutDashboard,
    Users,
    ContactRound
} from "lucide-react";

export const navigation: NavItem[] = [
    {
        title: "Dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Access",
        icon: Users,
        children: [
            {
                title: "Accounts",
                to: "/users/accounts",
            },
            {
                title: "Roles",
                to: "/users/roles",
            },
            {
                title: "Permissions",
                to: "/users/permissions",
            },
        ],
    },
    {
        title: "Profile",
        to: "/profile",
        icon: ContactRound,
    },
];