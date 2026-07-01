import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface AuthLayoutProps {
    children?: ReactNode;
    title?: string;
    subtitle?: string;
}

export default function AuthLayout({ }: AuthLayoutProps) {
    return (
        <div className="mainAuthContainer" style={{ backgroundImage: "linear-gradient(to top, #dfe9f3 0%, white 100%)" }}>
            <div className="flex items-center justify-center min-h-dvh">
                <Outlet />
            </div>
        </div >
    );
}