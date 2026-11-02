import {ReactNode} from "react";

interface PageFiltersActionsProps {
    children: ReactNode;
}

export function PageFiltersActions({children}: PageFiltersActionsProps) {
    return (
        <div className="PageFiltersActions flex items-center gap-2">
            {children}
        </div>
    )
}