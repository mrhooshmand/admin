import {NavLink, useLocation} from "react-router-dom";
import {ChevronRight} from "lucide-react";

import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/shared/ui/sidebar";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/shared/ui/collapsible";

import {NavItem} from "@/shared/types/navigation";

interface SidebarItemProps {
    item: NavItem;
}

export function SidebarItem({item}: SidebarItemProps) {
    const location = useLocation();

    const isActive = (path?: string) =>
        !!path && location.pathname === path;

    const hasActiveChild = (item: NavItem): boolean => {
        if (!item.children) {
            return isActive(item.to);
        }

        return item.children.some(hasActiveChild);
    };

    const open = hasActiveChild(item);

    if (item.children?.length) {
        return (
            <Collapsible
                defaultOpen={open}
                className="group/collapsible"
            >
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                            {item.icon && <item.icon/>}
                            <span>{item.title}</span>
                            <ChevronRight
                                className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"/>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.children.map((child) => (
                                <SidebarItem
                                    key={child.title}
                                    item={child}
                                />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        );
    }

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton
                asChild
                isActive={isActive(item.to)}
            >
                <NavLink to={item.to!}>
                    {item.icon && <item.icon/>}
                    <span>{item.title}</span>
                </NavLink>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
}