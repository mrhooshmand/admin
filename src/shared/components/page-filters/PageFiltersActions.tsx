import {ReactNode} from "react";

interface PageFiltersActionsProps {
    children: ReactNode;
}

export function PageFiltersActions({children}: PageFiltersActionsProps) {
    return (
        <div className="PageFiltersActions flex flex-row-reverse gap-1 px-1">
            {children}
        </div>
    )
}