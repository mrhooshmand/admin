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
        <div className="flex items-center justify-evenly gap-2 px-4 py-3 text-sm text-muted-foreground">
            <CalendarDays className="size-4 shrink-0" />
            <div className="text-start">
                {date.toLocaleDateString(intlLocale, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    numberingSystem: "latn",
                })}
            </div>
            <div className="font-extrabold tabular-nums">
                {date.toLocaleTimeString(intlLocale, {
                    hour: "2-digit",
                    minute: "2-digit",
                    numberingSystem: "latn",
                })}
            </div>
        </div>
    );
}
