import { createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import api from "@/shared/utils/api";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const refreshAuth = async (): Promise<void> => {
        await queryClient.invalidateQueries({
            queryKey: ["me"]
        });
    };

    const logout = async (): Promise<void> => {

        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            queryClient.removeQueries({
                queryKey: ["me"]
            });
            navigate(ROUTES.LOGIN);
        }
    };

    return (
        <AuthContext.Provider value={{ logout, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}