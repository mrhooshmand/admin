import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import Loading from "@/shared/components/Loading";
import { usePermissions } from "@/app/providers/PermissionProvider";

interface PermissionRouteProps {
    code?: string;
    children: ReactNode;
}

export default function PermissionRoute({
                                            code,
                                            children,
                                        }: PermissionRouteProps) {
    const { hasPermission, isLoading } = usePermissions();

    if (isLoading) {
        return <Loading />;
    }

    if (code && !hasPermission(code)) {
        return <Navigate to="/404" replace />;
    }

    return <>{children}</>;
}