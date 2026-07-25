import { Outlet } from "react-router-dom";
import ProtectedRoute from "@/app/router/ProtectedRoute";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { GlobalModal } from "@/shared/components/GlobalModal";
import { AppSidebar } from "@/layouts/AppSidebar";
import HeaderLayout from "@/layouts/HeaderLayout";
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";

export default function MainLayout() {
    return (
        <ProtectedRoute>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <HeaderLayout />
                    <div className="flex-1 overflow-auto bg-muted/30 p-6">
                        <Outlet />
                    </div>
                </SidebarInset>
                <ConfirmDialog />
                <GlobalModal />
            </SidebarProvider>
        </ProtectedRoute>
    );
}