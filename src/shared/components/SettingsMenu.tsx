import { useTheme } from "next-themes";
import { Sun, Moon, Settings2, MonitorCog, Languages, PanelLeft } from "lucide-react"
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
    const { theme, setTheme } = useTheme();
    const { locale, dir, setLocale, t } = useLocale();

    const changeTheme = (mode: "light" | "dark" | "system" | "semi-dark") => {
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
                            <Button variant="ghost" size="icon" className="size-9 rounded-md text-muted-foreground shadow-none hover:bg-primary/10 hover:text-primary">
                                <Settings2 />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>

                    <TooltipContent>
                        {t("settings.title")}
                    </TooltipContent>
                </Tooltip>

                <DropdownMenuContent
                    className="w-52"
                    align={dir === "rtl" ? "end" : "start"}
                >
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>{t("settings.theme")}</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => changeTheme("light")}
                            className={theme === "light" ? "bg-accent" : undefined}
                        >
                            <Sun />
                            {t("settings.theme.light")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => changeTheme("semi-dark")}
                            className={theme === "semi-dark" ? "bg-accent" : undefined}
                        >
                            <PanelLeft />
                            {t("settings.theme.semiDark")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => changeTheme("dark")}
                            className={theme === "dark" ? "bg-accent" : undefined}
                        >
                            <Moon />
                            {t("settings.theme.dark")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => changeTheme("system")}
                            className={theme === "system" ? "bg-accent" : undefined}
                        >
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
