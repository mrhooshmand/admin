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
    code?: string;
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
        code: 'access',
        children: [
            {
                title: "Accounts",
                code: "users",
                icon: Users,
                to: "/users/accounts",
            },
            {
                title: "Roles",
                code: "roles",
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