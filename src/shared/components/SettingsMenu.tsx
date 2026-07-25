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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { Button } from "@/shared/ui/button";

export function ThemeToggle() {
    const { setTheme } = useTheme();
    const changeTheme = (mode: 'light' | 'dark' | 'system') => {
        setTheme(mode)
    }
    return (
        <TooltipProvider>
            <DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Settings2 />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>

                    <TooltipContent>
                        Settings
                    </TooltipContent>
                </Tooltip>

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
        </TooltipProvider>
    );
}