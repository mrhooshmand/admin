import type { NavItem } from "@/shared/types/navigation";
import type { Menu } from "@/features/auth/types";

export function filterNavigation(
    navigation: NavItem[],
    menus: Menu[]
): NavItem[] {

    const allowedCodes = new Set(
        menus.map(menu => menu.code)
    );

    return navigation
        .map(item => {

            // Parent / Group
            if (item.children) {
                const children = item.children.filter(
                    child =>
                        !child.code ||
                        allowedCodes.has(child.code)
                );

                if (children.length === 0) {
                    return null;
                }

                return {
                    ...item,
                    children,
                };
            }

            // بدون code = public
            if (!item.code || allowedCodes.has(item.code)) {
                return item;
            }

            return null;
        })
        .filter(Boolean) as NavItem[];
}