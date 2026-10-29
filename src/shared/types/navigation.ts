import {LucideIcon} from "lucide-react";
import {
    LayoutDashboard,
    Users,
    ContactRound,
    UserStar,
    UserKey
} from "lucide-react";
import type { TranslationKey } from "@/shared/i18n";

export interface NavItem {
    titleKey: TranslationKey;
    to?: string;
    code?: string;
    icon?: LucideIcon;
    children?: NavItem[];
}

export const navigation: NavItem[] = [
    {
        titleKey: "nav.dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        titleKey: "nav.access",
        icon: UserKey,
        code: 'access',
        children: [
            {
                titleKey: "nav.accounts",
                code: "users",
                icon: Users,
                to: "/users/accounts",
            },
            {
                titleKey: "nav.roles",
                code: "roles",
                icon: UserStar,
                to: "/users/roles",
            }
        ],
    },
    {
        titleKey: "nav.profile",
        to: "/profile",
        icon: ContactRound,
    },
];
