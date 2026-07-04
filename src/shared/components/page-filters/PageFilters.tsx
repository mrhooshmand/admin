import {ReactNode} from "react";

interface PageFiltersProps {
    children: ReactNode;
}

export function PageFilters({children}: PageFiltersProps) {
    return (
        <div className="flex flex-wrap gap-2 justify-end w-full">
            {children}
        </div>
    )
}