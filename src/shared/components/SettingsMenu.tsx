import { useTheme } from "next-themes";
import { Sun, Moon, Settings2, MonitorCog, Languages } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { Button } from "@/shared/ui/button";
import { useLocale } from "@/app/providers/LocaleProvider";
import type { Locale } from "@/shared/i18n";

export function ThemeToggle() {
    const { setTheme } = useTheme();
    const { locale, dir, setLocale, t } = useLocale();

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

                <DropdownMenuContent
                    className="w-44"
                    align={dir === "rtl" ? "end" : "start"}
                >
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>{t("settings.theme")}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => changeTheme('light')}>
                            <Sun />
                            {t("settings.theme.light")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeTheme('dark')}>
                            <Moon />
                            {t("settings.theme.dark")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeTheme('system')}>
                            <MonitorCog />
                            {t("settings.theme.system")}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuLabel>{t("settings.language")}</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => changeLocale("fa")}
                            className={locale === "fa" ? "bg-accent" : undefined}
                        >
                            <Languages />
                            {t("settings.language.fa")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => changeLocale("en")}
                            className={locale === "en" ? "bg-accent" : undefined}
                        >
                            <Languages />
                            {t("settings.language.en")}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </TooltipProvider>
    );
}
