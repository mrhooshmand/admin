import {cn} from "@/lib/utils";
import {PropsWithChildren} from "react";

interface FormGridProps extends PropsWithChildren {
    columns?: 2 | 3 | 4 | 5 | 6;
    className?: string;
}

const columnsMap = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
};

export function FormGrid({
                             children,
                             columns = 5,
                             className,
                         }: FormGridProps) {
    return (
        <div
            className={cn(
                "grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-6",
                "[&_label,&_button]:text-xs",
                "[&_label,&_button]:font-normal",
                columnsMap[columns],
                className
            )}
        >
            {children}
        </div>
    );
}