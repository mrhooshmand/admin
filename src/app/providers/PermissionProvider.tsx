import {
    createContext,
    ReactNode,
    useContext,
} from "react";
import {useMenus} from "@/features/auth/hooks/useMenus";
import type {Menu} from "@/features/auth/types";


const PermissionContext = createContext<PermissionContextType | undefined>(
    undefined
);

interface PermissionProviderProps {
    children: ReactNode;
}

interface PermissionContextType {
    menus: Menu[];

    hasMenuPermission: (code: string) => boolean;

    getMenuByCode: (code: string) => Menu | undefined;

    isLoading: boolean;
}

export function PermissionProvider({
                                       children,
                                   }: PermissionProviderProps) {

    const {data, isLoading} = useMenus();

    const menus = data?.data ?? [];

    const hasMenuPermission = (code: string): boolean => {
        return menus.some(menu => menu.code === code);
    };

    const getMenuByCode = (code: string): Menu | undefined => {
        return menus.find(menu => menu.code === code);
    };

    return (
        <PermissionContext.Provider
            value={{
                menus,
                hasMenuPermission,
                getMenuByCode,
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