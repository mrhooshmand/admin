import { Navigate } from "react-router-dom";

import { ReactNode } from "react";
import Loading from "@/shared/components/Loading";
import { useMe } from "@/features/auth/hooks/useMe";
import { ROUTES } from "@/shared/constants/routes";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {

    const {
        data: user,
        isLoading,
        isError
    } = useMe();


    if (isLoading) {
        return <Loading />;
    }


    if (isError || !user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }


    return <>{children}</>;
}