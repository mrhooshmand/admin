import {ReactNode} from "react";

interface PageFiltersContentProps {
    children: ReactNode;
}

export function PageFiltersContent({children}: PageFiltersContentProps) {
    return (
        <div className="border-t-1 border-accent mt-1 w-full">
            {children}
        </div>
    )
}