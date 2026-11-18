import { useTheme } from "next-themes";
import {
    Sun,
    Moon,
    Settings2,
    MonitorCog,
    Languages,
    Check,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/shared/ui/tooltip";
import { Button } from "@/shared/ui/button";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useColorTheme } from "@/app/providers/ColorThemeProvider";
import type { ColorPaletteId } from "@/shared/theme/colorPalettes";
import { cn } from "@/lib/utils";

function needsDarkCheck(paletteId: ColorPaletteId, isDark: boolean) {
    if (paletteId === "yellow") return true;
    if (paletteId === "neutral") return isDark;
    return false;
}

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { locale, dir, setLocale, t } = useLocale();
    const { colorTheme, setColorTheme, palettes } = useColorTheme();
    const isDark = resolvedTheme === "dark";

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

                    <TooltipContent>{t("settings.title")}</TooltipContent>
                </Tooltip>

                <DropdownMenuContent
                    className="w-56 ring-1 ring-primary/25"
                    align={dir === "rtl" ? "end" : "start"}
                >
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>
                            {t("settings.color")}
                        </DropdownMenuLabel>
                        <div className="flex flex-wrap gap-2 px-2 pb-2 pt-1">
                            {palettes.map((palette) => {
                                const selected = colorTheme === palette.id;
                                const swatch = isDark
                                    ? palette.swatchDark
                                    : palette.swatch;
                                const darkCheck = needsDarkCheck(
                                    palette.id,
                                    isDark
                                );

                                return (
                                    <button
                                        key={palette.id}
                                        type="button"
                                        title={t(palette.labelKey)}
                                        aria-label={t(palette.labelKey)}
                                        aria-pressed={selected}
                                        onClick={() =>
                                            setColorTheme(palette.id)
                                        }
                                        className={cn(
                                            "relative flex size-6 items-center justify-center rounded-full border border-border shadow-xs transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                            selected &&
                                                "ring-2 ring-ring ring-offset-2 ring-offset-background"
                                        )}
                                        style={{ backgroundColor: swatch }}
                                    >
                                        {selected && (
                                            <Check
                                                className={cn(
                                                    "size-3.5",
                                                    darkCheck
                                                        ? "text-black"
                                                        : "text-white"
                                                )}
                                                strokeWidth={3}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuLabel>
                            {t("settings.theme")}
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => setTheme("light")}
                            className={
                                theme === "light"
                                    ? "text-primary focus:text-primary [&_svg]:text-primary"
                                    : undefined
                            }
                        >
                            <Sun />
                            {t("settings.theme.light")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setTheme("dark")}
                            className={
                                theme === "dark"
                                    ? "text-primary focus:text-primary [&_svg]:text-primary"
                                    : undefined
                            }
                        >
                            <Moon />
                            {t("settings.theme.dark")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setTheme("system")}
                            className={
                                theme === "system"
                                    ? "text-primary focus:text-primary [&_svg]:text-primary"
                                    : undefined
                            }
                        >
                            <MonitorCog />
                            {t("settings.theme.system")}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuLabel>
                            {t("settings.language")}
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => setLocale("fa")}
                            className={
                                locale === "fa"
                                    ? "text-primary focus:text-primary [&_svg]:text-primary"
                                    : undefined
                            }
                        >
                            <Languages />
                            {t("settings.language.fa")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setLocale("en")}
                            className={
                                locale === "en"
                                    ? "text-primary focus:text-primary [&_svg]:text-primary"
                                    : undefined
                            }
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
