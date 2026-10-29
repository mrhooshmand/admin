import { useTheme } from "next-themes";
import { Sun, Moon, Settings2, MonitorCog, Languages } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { Button } from "@/shared/ui/button";
import { useLocale } from "@/app/providers/LocaleProvider";
import type { Locale } from "@/shared/i18n";

export function ThemeToggle() {
    const { setTheme } = useTheme();
    const { locale, setLocale, t } = useLocale();

    const changeTheme = (mode: 'light' | 'dark' | 'system') => {
        setTheme(mode)
    }

    const changeLocale = (next: Locale) => {
        setLocale(next)
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
                        {t("settings.title")}
                    </TooltipContent>
                </Tooltip>

                <DropdownMenuContent className="w-44" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>{t("settings.theme")}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => changeTheme('light')}>
                            {t("settings.theme.light")}
                            <DropdownMenuShortcut><Sun /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeTheme('dark')}>
                            {t("settings.theme.dark")}
                            <DropdownMenuShortcut><Moon /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeTheme('system')}>
                            {t("settings.theme.system")}
                            <DropdownMenuShortcut><MonitorCog /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuLabel>{t("settings.language")}</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => changeLocale("fa")}
                            className={locale === "fa" ? "bg-accent" : undefined}
                        >
                            {t("settings.language.fa")}
                            <DropdownMenuShortcut><Languages /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => changeLocale("en")}
                            className={locale === "en" ? "bg-accent" : undefined}
                        >
                            {t("settings.language.en")}
                            <DropdownMenuShortcut><Languages /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </TooltipProvider>
    );
}
