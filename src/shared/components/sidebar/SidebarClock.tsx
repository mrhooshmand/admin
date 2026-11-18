import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "@/app/providers/LocaleProvider";

export function SidebarClock() {
    const [date, setDate] = useState(new Date());
    const { intlLocale } = useLocale();

    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent/50 px-3 py-2.5 text-xs text-sidebar-foreground/70">
            <CalendarDays className="size-4 shrink-0" />
            <div className="min-w-0 flex-1 truncate text-start">
                {date.toLocaleDateString(intlLocale, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    numberingSystem: "latn",
                })}
            </div>
            <div className="shrink-0 font-semibold tabular-nums text-sidebar-foreground">
                {date.toLocaleTimeString(intlLocale, {
                    hour: "2-digit",
                    minute: "2-digit",
                    numberingSystem: "latn",
                })}
            </div>
        </div>
    );
}
