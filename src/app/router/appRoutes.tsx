import { lazy, type ReactNode } from "react";
import PlaceholderPage from "@/shared/pages/PlaceholderPage";
import type { TranslationKey } from "@/shared/i18n";

const Dashboard = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const Users = lazy(() => import("@/features/users/pages/UsersPage"));
const Roles = lazy(() => import("@/features/roles/pages/RolesPage"));

interface AppRoute {
    code?: string;
    path: string;
    element: ReactNode;
}

function placeholder(titleKey: TranslationKey) {
    return <PlaceholderPage titleKey={titleKey} />;
}

export const appRoutes: AppRoute[] = [
    {
        path: "dashboard",
        element: <Dashboard />,
    },
    {
        code: "users",
        path: "users/accounts",
        element: <Users />,
    },
    {
        code: "roles",
        path: "users/roles",
        element: <Roles />,
    },
    {
        path: "access/permissions",
        element: placeholder("nav.permissions"),
    },
    {
        path: "reports/sales",
        element: placeholder("nav.reports.sales"),
    },
    {
        path: "reports/activity",
        element: placeholder("nav.reports.activity"),
    },
    {
        path: "reports/financial",
        element: placeholder("nav.reports.financial"),
    },
    {
        path: "reports/performance",
        element: placeholder("nav.reports.performance"),
    },
    {
        path: "reports/audit",
        element: placeholder("nav.reports.audit"),
    },
    {
        path: "operations/orders",
        element: placeholder("nav.operations.orders"),
    },
    {
        path: "operations/inventory",
        element: placeholder("nav.operations.inventory"),
    },
    {
        path: "operations/shipping",
        element: placeholder("nav.operations.shipping"),
    },
    {
        path: "operations/support",
        element: placeholder("nav.operations.support"),
    },
    {
        path: "content/pages",
        element: placeholder("nav.content.pages"),
    },
    {
        path: "content/media",
        element: placeholder("nav.content.media"),
    },
    {
        path: "content/announcements",
        element: placeholder("nav.content.announcements"),
    },
    {
        path: "communications/notifications",
        element: placeholder("nav.communications.notifications"),
    },
    {
        path: "communications/messages",
        element: placeholder("nav.communications.messages"),
    },
    {
        path: "system/settings",
        element: placeholder("nav.system.settings"),
    },
    {
        path: "system/integrations",
        element: placeholder("nav.system.integrations"),
    },
    {
        path: "system/logs",
        element: placeholder("nav.system.logs"),
    },
    {
        path: "tools/api-keys",
        element: placeholder("nav.tools.apiKeys"),
    },
    {
        path: "tools/webhooks",
        element: placeholder("nav.tools.webhooks"),
    },
];
