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

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <div style={{height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <img src={logoImage} alt="Logo"/>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => (
                                <SidebarItem
                                    key={item.title}
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