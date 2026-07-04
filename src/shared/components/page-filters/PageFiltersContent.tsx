import {ReactNode} from "react";

interface PageFiltersContentProps {
    children: ReactNode;
}

export function PageFiltersContent({children}: PageFiltersContentProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 w-full">
            {children}
        </div>
    )
}