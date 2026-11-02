import { CalendarRange, Eye, Monitor, Smartphone } from "lucide-react";
import { ChartLineInteractive, getChartSummary } from "@/features/dashboard/components/Chart";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { InfoIcon } from "lucide-react";
import { useLocale } from "@/app/providers/LocaleProvider";

const summary = getChartSummary();

const stats = [
    {
        key: "desktop" as const,
        labelKey: "dashboard.desktop" as const,
        value: summary.desktop,
        icon: Monitor,
        tone: "bg-primary/15 text-primary",
    },
    {
        key: "mobile" as const,
        labelKey: "dashboard.mobile" as const,
        value: summary.mobile,
        icon: Smartphone,
        tone: "bg-emerald-500/15 text-emerald-600",
    },
    {
        key: "views" as const,
        labelKey: "dashboard.views" as const,
        value: summary.total,
        icon: Eye,
        tone: "bg-sky-500/15 text-sky-600",
    },
    {
        key: "days" as const,
        labelKey: "dashboard.days" as const,
        value: summary.days,
        icon: CalendarRange,
        tone: "bg-amber-500/15 text-amber-600",
    },
];

export default function Dashboard() {
    const { t } = useLocale();

    return (
        <div className="flex flex-col gap-6 text-start">
            <h1 className="text-[1.375rem] font-medium leading-tight text-foreground">
                {t("dashboard.title")}
            </h1>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.key}
                        className="flex items-center gap-4 rounded-[0.375rem] bg-card px-5 py-4 shadow-[0_0.25rem_1.125rem_rgba(75,70,92,0.1)]"
                    >
                        <span className={`flex size-11 shrink-0 items-center justify-center rounded-md ${item.tone}`}>
                            <item.icon className="size-5" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm text-muted-foreground">{t(item.labelKey)}</p>
                            <p className="text-2xl font-medium leading-none tracking-tight">
                                {item.value.toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <ChartLineInteractive />

            <Alert className="border-primary/20 bg-primary/5 shadow-none">
                <InfoIcon />
                <AlertTitle>{t("dashboard.alertTitle")}</AlertTitle>
                <AlertDescription>{t("dashboard.alertDesc")}</AlertDescription>
            </Alert>
        </div>
    );
}
