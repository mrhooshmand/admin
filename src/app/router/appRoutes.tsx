import { lazy } from "react";

const Dashboard = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const Users = lazy(() => import("@/features/users/pages/UsersPage"));
const Roles = lazy(() => import("@/features/roles/pages/RolesPage"));

export const appRoutes = [
    {
        code: "dashboard",
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
    }
];