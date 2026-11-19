import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarHeader,
} from "@/shared/ui/sidebar";
import { SidebarClock } from "@/shared/components/sidebar/SidebarClock";
import { navigation } from "@/shared/types/navigation.ts";
import { SidebarItem } from "@/shared/components/sidebar/SidebarItem.tsx";
const SIDEBAR_LOGO = "/is-logo.png";
import { filterNavigation } from "@/shared/navigation/filterNavigation.ts";
import type { Menu } from "@/features/auth/types";
import { useLocale } from "@/app/providers/LocaleProvider";

export function AppSidebar({ menus }: { menus: Menu[] }) {
  const { t, dir } = useLocale();
  const visibleNavigation = filterNavigation(navigation, menus);

  return (
    <Sidebar
      side={dir === "rtl" ? "right" : "left"}
      variant="inset"
      collapsible="icon"
    >
      <SidebarHeader>
        <div className="flex h-14 min-w-0 items-center gap-2.5 overflow-hidden px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-2">
          <img
            src={SIDEBAR_LOGO}
            alt=""
            width={72}
            height={72}
            className="size-9 shrink-0 object-contain"
          />
          <span className="min-w-0 truncate text-sm font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            {t("auth.brand.short")}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.menu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavigation.map((item) => (
                <SidebarItem
                  key={item.code ?? item.to ?? item.titleKey}
                  item={item}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 group-data-[collapsible=icon]:hidden">
        <SidebarClock />
      </SidebarFooter>
    </Sidebar>
  );
}
