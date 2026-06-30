import { ChartLineInteractive } from "@/features/dashboard/components/Chart";

export default function Dashboard() {
    return (
        <div className="">
            <div className="mx-auto mt-2 mb-10 text-center text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Everything
                you need to deploy your app</div>
            <ChartLineInteractive />
            <div className="mt-5">

            </div>
        </div >
    );
}