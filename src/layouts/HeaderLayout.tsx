import { Link } from "react-router-dom";
import { ChevronsUpDown, LogOut, Search, UserCircle } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import useUserData from "@/features/auth/hooks/useUserData";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { SidebarTrigger } from "@/shared/ui/sidebar";
import { Skeleton } from "@/shared/ui/skeleton";
import { Input } from "@/shared/ui/input";
import { ThemeToggle } from "@/shared/components/SettingsMenu";
import { useLocale } from "@/app/providers/LocaleProvider";

function getInitials(fullName?: string, username?: string) {
    const source = fullName?.trim() || username?.trim() || "?";
    const parts = source.split(/\s+/);

    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return source.slice(0, 2).toUpperCase();
}

export default function HeaderLayout() {
    const { logout } = useAuth();
    const { data: user, isLoading } = useUserData();
    const { dir, t } = useLocale();

    return (
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 bg-card px-6 shadow-[0_2px_6px_rgba(47,43,61,0.08)]">
            <SidebarTrigger className="size-9 rounded-md text-muted-foreground shadow-none hover:bg-primary/10 hover:text-primary" />
            <label className="relative hidden w-60 sm:block">
                <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder={t("common.search")}
                    className="h-9 rounded-md border-transparent bg-muted ps-9 shadow-none focus-visible:border-primary/30 focus-visible:bg-card"
                />
            </label>
            <div className="ms-auto flex items-center gap-1">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-9 w-32 rounded-lg" />
                            <Skeleton className="size-8 rounded-lg" />
                        </>
                    ) : (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-10 gap-2 rounded-md px-1.5 shadow-none hover:bg-primary/10 data-[state=open]:bg-primary/10"
                                    >
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                                            {getInitials(user?.full_name, user?.username)}
                                        </span>
                                        <div className="hidden flex-col items-start text-start sm:flex">
                                            <span className="text-sm font-medium leading-none">
                                                {user?.full_name || user?.username}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {user?.username}
                                            </span>
                                        </div>
                                        <ChevronsUpDown className="hidden size-4 text-muted-foreground sm:block" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    className="w-64"
                                    align={dir === "rtl" ? "start" : "end"}
                                >
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-3 px-2 py-2">
                                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                                {getInitials(user?.full_name, user?.username)}
                                            </span>
                                            <div className="flex min-w-0 flex-col items-start gap-0.5 text-start">
                                                <p className="text-sm font-medium leading-none">
                                                    {user?.full_name || user?.username}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    <bdi>@{user?.username}</bdi>
                                                </p>
                                                {user?.email && (
                                                    <p className="text-xs text-muted-foreground">
                                                        <bdi>{user.email}</bdi>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuGroup>
                                        <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <Link to={ROUTES.PROFILE}>
                                                <UserCircle />
                                                {t("auth.profile")}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => logout()}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <LogOut />
                                            <span>{t("auth.logout")}</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                </DropdownMenuContent>
                            </DropdownMenu>
                            <ThemeToggle />
                        </>
                    )}
            </div>
        </header>
    );
}
