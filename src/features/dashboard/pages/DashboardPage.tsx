import { ChartLineInteractive } from "@/features/dashboard/components/Chart";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { InfoIcon } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="">
            <div className="mx-auto mt-2 mb-10 text-center text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Everything
                you need to deploy your app
            </div>

            <ChartLineInteractive />

            <Alert className="mt-5">
                <InfoIcon />
                <AlertTitle>New feature available</AlertTitle>
                <AlertDescription>
                    We&apos;ve added dark mode support. You can enable it in your header nav -
                    settings.
                </AlertDescription>
            </Alert>
        </div >
    );
}