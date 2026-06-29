import { Link } from "react-router-dom";
import { ChevronsUpDown, LogOut, UserCircle } from "lucide-react";
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
import { Separator } from "@/shared/ui/separator";
import { SidebarTrigger } from "@/shared/ui/sidebar";
import { Skeleton } from "@/shared/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/shared/ui/tooltip";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

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

    return (
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger />

            <div className="flex flex-1 items-center justify-between gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                    Admin Panel
                </span>

                <div className="flex items-center gap-1">
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
                                        className="h-9 gap-2 px-2 data-[state=open]:bg-accent"
                                    >
                                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                                            {getInitials(user?.full_name, user?.username)}
                                        </span>
                                        <div className="hidden flex-col items-start text-left sm:flex">
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

                                <DropdownMenuContent className="w-64" align="end">
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-3 px-2 py-2">
                                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                                {getInitials(user?.full_name, user?.username)}
                                            </span>
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-sm font-medium leading-none">
                                                    {user?.full_name || user?.username}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    @{user?.username}
                                                </p>
                                                {user?.email && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                            <Link to={ROUTES.PROFILE}>
                                                <UserCircle />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Separator orientation="vertical" className="mx-3 bg-accent"/>
                            <ThemeToggle />
                            <Separator orientation="vertical" className="mx-3 bg-accent"/>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => logout()}
                                            aria-label="Logout"
                                        >
                                            <LogOut />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        Logout
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
