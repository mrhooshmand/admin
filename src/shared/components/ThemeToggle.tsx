import { useTheme } from "next-themes";
import { Sun, Moon, Settings2, MonitorCog } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"

export function ThemeToggle() {
    const { setTheme } = useTheme();
    const changeTheme = (mode = 'light') => {
        setTheme(mode)
    }
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Settings2 />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Theme</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => changeTheme('light')}>
                            Light
                            <DropdownMenuShortcut><Sun /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeTheme('dark')}>
                            Dark
                            <DropdownMenuShortcut><Moon /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeTheme('system')}>
                            System
                            <DropdownMenuShortcut><MonitorCog /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    );
}