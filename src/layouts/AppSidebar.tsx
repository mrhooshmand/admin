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
import {navigation} from '@/shared/types/navigation.ts'
import {SidebarItem} from "@/shared/components/sidebar/SidebarItem.tsx";
import logoImage from "/logooo.png";
import {filterNavigation} from "@/shared/navigation/filterNavigation.ts";
import type {Menu} from "@/features/auth/types";
import { useLocale } from "@/app/providers/LocaleProvider";

export function AppSidebar({menus}: { menus: Menu[] }) {
    const { t, dir } = useLocale();
    const visibleNavigation = filterNavigation(navigation, menus);
    return (
        <Sidebar side={dir === "rtl" ? "right" : "left"}>
            <SidebarHeader>
                <div style={{height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <img src={logoImage} alt="Logo"/>
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
            <SidebarFooter>
                <SidebarClock/>
            </SidebarFooter>
        </Sidebar>
    )
}