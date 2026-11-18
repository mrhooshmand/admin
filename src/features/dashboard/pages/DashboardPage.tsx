import { ChartLineInteractive } from "@/features/dashboard/components/Chart";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { InfoIcon } from "lucide-react";
import { useLocale } from "@/app/providers/LocaleProvider";

export default function Dashboard() {
    const { t } = useLocale();

    return (
        <div className="flex flex-col gap-4 text-start md:gap-6">
            <div className="px-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {t("dashboard.title")}
                </h1>
            </div>

            <ChartLineInteractive />

            <Alert>
                <InfoIcon />
                <AlertTitle>{t("dashboard.alertTitle")}</AlertTitle>
                <AlertDescription>
                    {t("dashboard.alertDesc")}
                </AlertDescription>
            </Alert>
        </div>
    );
}
