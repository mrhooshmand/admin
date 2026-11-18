import type { CSSProperties } from "react";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "@/app/router/ProtectedRoute";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { GlobalModal } from "@/shared/components/GlobalModal";
import { AppSidebar } from "@/layouts/AppSidebar";
import HeaderLayout from "@/layouts/HeaderLayout";
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";
import { useMenus } from "@/features/auth/hooks/useMenus.ts";

export default function MainLayout() {
    const { data } = useMenus();
    const menus = data?.data ?? [];

    return (
        <ProtectedRoute>
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as CSSProperties
                }
            >
                <AppSidebar menus={menus} />
                <SidebarInset>
                    <HeaderLayout />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </SidebarInset>
                <ConfirmDialog />
                <GlobalModal />
            </SidebarProvider>
        </ProtectedRoute>
    );
}
