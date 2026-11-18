import { ChartLineInteractive } from "@/features/dashboard/components/Chart";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { InfoIcon } from "lucide-react";
import { useLocale } from "@/app/providers/LocaleProvider";

export default function Dashboard() {
    const { t } = useLocale();

    return (
        <div className="text-start">
            <div className="mx-auto mt-2 mb-10 text-center text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                {t("dashboard.title")}
            </div>

            <ChartLineInteractive />

            <Alert className="mt-5">
                <InfoIcon />
                <AlertTitle>{t("dashboard.alertTitle")}</AlertTitle>
                <AlertDescription>
                    {t("dashboard.alertDesc")}
                </AlertDescription>
            </Alert>
        </div>
    );
}
