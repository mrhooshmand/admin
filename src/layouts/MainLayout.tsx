import { Outlet, Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { useLoading } from "@/app/providers/LoadingProvider";
import { useEffect, useState } from "react";

import { Button } from "@/shared/ui/button";
import {
    LayoutDashboard,
    Users,
    UserCircle,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import ProtectedRoute from "@/app/router/ProtectedRoute";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { GlobalModal } from "@/shared/components/GlobalModal";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import useUserData from "@/features/auth/hooks/useUserData";
import Loading from "@/shared/components/Loading";

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { message } = useLoading();
    const { logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const {
        data: user,
        isPending
    } = useUserData();
    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const menuItems = [
        { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
        { path: "/users", name: "Users", icon: Users },
        { path: "/profile", name: "Profile", icon: UserCircle },
    ];

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <ProtectedRoute>
            <div className="flex h-screen">
                {isMobile && !isSidebarOpen && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="fixed top-4 left-4 z-50 bg-white shadow-lg"
                        onClick={toggleSidebar}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                )}
                <aside
                    className={`
                        fixed inset-y-0 left-0 bg-background/95 backdrop-blur border-r shadow-[4px_0_20px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_20px_rgba(0,0,0,0.3)] 
          ${isSidebarOpen ? "w-64" : "w-0 overflow-hidden"}
          ${isMobile ? "fixed left-0 top-0 z-40 h-full" : "relative"}
        `}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-5 border-b">
                            <h2 className="text-xl font-bold  hover:text-white hover:bg-slate-800">{user?.full_name || ''}</h2>
                            {isMobile && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className=" hover:text-white hover:bg-slate-800"
                                    onClick={toggleSidebar}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            )}
                            <ThemeToggle />
                        </div>
                        <nav className="flex-1 p-4">
                            <ul className="space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <li key={item.path}>
                                            <Link
                                                to={item.path}
                                                onClick={() => isMobile && setIsSidebarOpen(false)}
                                                className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${isActive
                                                        ? "bg-blue-600 text-white"
                                                        : "hover:bg-slate-800 hover:text-white"
                                                    }
                      `}
                                            >
                                                <Icon className="h-5 w-5" />
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                        <div className="p-4 border-t">
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 hover:text-white hover:bg-slate-800"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Sign out</span>
                            </Button>
                        </div>
                    </div>
                </aside>
                <main
                    className={`
          flex-1 overflow-auto transition-all duration-300 bg-muted/30
          ${isMobile && isSidebarOpen ? "blur-sm" : ""}
        `}
                >
                    {isMobile && isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-30"
                            onClick={toggleSidebar}
                        />
                    )}
                    <div className={`p-6 relative min-h-full ${isPending ? 'overflow-hidden h-screen' : ''}`}>
                        {isPending && <Loading message={message} />}
                        <Outlet />
                    </div>
                </main>
                <ConfirmDialog />
                <GlobalModal />
            </div>
        </ProtectedRoute>
    );
}