import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarHeader,
} from "@/shared/ui/sidebar"
import {SidebarClock} from '@/shared/components/sidebar/SidebarClock'
import {SidebarLogo} from "@/shared/components/sidebar/SidebarLogo";
import {navigation} from '@/shared/types/navigation.ts'
import {SidebarItem} from "@/shared/components/sidebar/SidebarItem.tsx";
import {filterNavigation} from "@/shared/navigation/filterNavigation.ts";
import type {Menu} from "@/features/auth/types";
import { useLocale } from "@/app/providers/LocaleProvider";

export function AppSidebar({menus}: { menus: Menu[] }) {
    const { t, dir } = useLocale();
    const visibleNavigation = filterNavigation(navigation, menus);
    return (
        <Sidebar side={dir === "rtl" ? "right" : "left"}>
            <SidebarHeader className="h-16 flex-row items-center gap-3 border-b border-sidebar-border px-4 py-0">
                <SidebarLogo />
                <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-[1.05rem] font-semibold leading-none tracking-tight text-sidebar-foreground">
                        SCore
                    </p>
                    <p className="mt-1 truncate text-[0.6875rem] leading-none text-sidebar-foreground/55">
                        Admin
                    </p>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        {t("nav.menu")}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {visibleNavigation.map((item) => (
                                <SidebarItem
                                    key={item.code}
                                    item={item}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-0">
                <SidebarClock/>
            </SidebarFooter>
        </Sidebar>
    )
}