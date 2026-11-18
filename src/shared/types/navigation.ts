import type { LucideIcon } from "lucide-react";
import {
    LayoutDashboard,
    Users,
    ContactRound,
    UserStar,
    UserKey,
    ChartColumn,
    ChartPie,
    Activity,
    Wallet,
    ScrollText,
    ClipboardList,
    Package,
    Truck,
    Headset,
    FileText,
    Image,
    Megaphone,
    Settings2,
    Cable,
    Logs,
    KeyRound,
    Webhook,
    ShieldCheck,
    Bell,
    Mail,
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
        code: "access",
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
            },
            {
                titleKey: "nav.permissions",
                icon: ShieldCheck,
                to: "/access/permissions",
            },
        ],
    },
    {
        titleKey: "nav.reports",
        icon: ChartColumn,
        children: [
            {
                titleKey: "nav.reports.sales",
                icon: ChartPie,
                to: "/reports/sales",
            },
            {
                titleKey: "nav.reports.activity",
                icon: Activity,
                to: "/reports/activity",
            },
            {
                titleKey: "nav.reports.financial",
                icon: Wallet,
                to: "/reports/financial",
            },
            {
                titleKey: "nav.reports.performance",
                icon: ChartColumn,
                to: "/reports/performance",
            },
            {
                titleKey: "nav.reports.audit",
                icon: ScrollText,
                to: "/reports/audit",
            },
        ],
    },
    {
        titleKey: "nav.operations",
        icon: ClipboardList,
        children: [
            {
                titleKey: "nav.operations.orders",
                icon: ClipboardList,
                to: "/operations/orders",
            },
            {
                titleKey: "nav.operations.inventory",
                icon: Package,
                to: "/operations/inventory",
            },
            {
                titleKey: "nav.operations.shipping",
                icon: Truck,
                to: "/operations/shipping",
            },
            {
                titleKey: "nav.operations.support",
                icon: Headset,
                to: "/operations/support",
            },
        ],
    },
    {
        titleKey: "nav.content",
        icon: FileText,
        children: [
            {
                titleKey: "nav.content.pages",
                icon: FileText,
                to: "/content/pages",
            },
            {
                titleKey: "nav.content.media",
                icon: Image,
                to: "/content/media",
            },
            {
                titleKey: "nav.content.announcements",
                icon: Megaphone,
                to: "/content/announcements",
            },
        ],
    },
    {
        titleKey: "nav.communications",
        icon: Bell,
        children: [
            {
                titleKey: "nav.communications.notifications",
                icon: Bell,
                to: "/communications/notifications",
            },
            {
                titleKey: "nav.communications.messages",
                icon: Mail,
                to: "/communications/messages",
            },
        ],
    },
    {
        titleKey: "nav.system",
        icon: Settings2,
        children: [
            {
                titleKey: "nav.system.settings",
                icon: Settings2,
                to: "/system/settings",
            },
            {
                titleKey: "nav.system.integrations",
                icon: Cable,
                to: "/system/integrations",
            },
            {
                titleKey: "nav.system.logs",
                icon: Logs,
                to: "/system/logs",
            },
        ],
    },
    {
        titleKey: "nav.tools",
        icon: KeyRound,
        children: [
            {
                titleKey: "nav.tools.apiKeys",
                icon: KeyRound,
                to: "/tools/api-keys",
            },
            {
                titleKey: "nav.tools.webhooks",
                icon: Webhook,
                to: "/tools/webhooks",
            },
        ],
    },
    {
        titleKey: "nav.profile",
        to: "/profile",
        icon: ContactRound,
    },
];
