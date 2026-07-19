import {LucideIcon} from "lucide-react";
import {
    LayoutDashboard,
    Users,
    ContactRound,
    UserStar,
    UserKey
} from "lucide-react";

export interface NavItem {
    title: string;
    to?: string;
    icon?: LucideIcon;
    children?: NavItem[];
}

export const navigation: NavItem[] = [
    {
        title: "Dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Access",
        icon: UserKey,
        children: [
            {
                title: "Accounts",
                icon: Users,
                to: "/users/accounts",
            },
            {
                title: "Roles",
                icon: UserStar,
                to: "/users/roles",
            }
        ],
    },
    {
        title: "Profile",
        to: "/profile",
        icon: ContactRound,
    },
];