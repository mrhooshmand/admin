import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "@/app/providers/LocaleProvider";

export function SidebarClock() {
    const [date, setDate] = useState(new Date());
    const { intlLocale } = useLocale();

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const weekday = date.toLocaleDateString(intlLocale, {
        weekday: "long",
        numberingSystem: "latn",
    });
    const day = date.toLocaleDateString(intlLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        numberingSystem: "latn",
    });
    const time = date.toLocaleTimeString(intlLocale, {
        hour: "2-digit",
        minute: "2-digit",
        numberingSystem: "latn",
    });

    return (
        <div className="mx-3 mb-3 rounded-md border border-sidebar-border px-3 py-2.5 group-data-[collapsible=icon]:mx-2 group-data-[collapsible=icon]:px-2">
            <div className="flex items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <CalendarDays className="size-4" />
                </span>
                <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-xs text-sidebar-foreground/65">{weekday}</p>
                    <p className="truncate text-sm font-medium leading-5 text-sidebar-foreground">{day}</p>
                    <p className="text-sm font-semibold tabular-nums leading-5 text-primary">{time}</p>
                </div>
            </div>
        </div>
    );
}
