import {
    createContext,
    ReactNode,
    useContext,
} from "react";
import { useMenus } from "@/features/auth/hooks/useMenus";
import type { Menu } from "@/features/auth/types";


interface PermissionContextType {
    menus: Menu[];
    hasPermission: (code: string) => boolean;
    isLoading: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(
    undefined
);

interface PermissionProviderProps {
    children: ReactNode;
}

export function PermissionProvider({
                                       children,
                                   }: PermissionProviderProps) {

    const { data, isLoading } = useMenus();

    const menus = data?.data ?? [];

    const hasPermission = (code: string): boolean => {
        return menus.some(menu => menu.code === code);
    };

    return (
        <PermissionContext.Provider
            value={{
                menus,
                hasPermission,
                isLoading,
            }}
        >
            {children}
        </PermissionContext.Provider>
    );
}

export function usePermissions(): PermissionContextType {
    const context = useContext(PermissionContext);

    if (!context) {
        throw new Error(
            "usePermissions must be used within PermissionProvider"
        );
    }

    return context;
}