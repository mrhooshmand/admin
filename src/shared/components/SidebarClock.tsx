import { useEffect, useState } from "react";

export function SidebarClock() {
    const [date, setDate] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="px-4 py-3 text-shadow-black text-sm text-muted-foreground flex justify-evenly">
            <div>
                {date.toLocaleDateString("fa-IR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </div>
            <div>
                {date.toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </div>

        </div>
    );
}