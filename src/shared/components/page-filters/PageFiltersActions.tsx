import {ReactNode} from "react";

interface PageFiltersActionsProps {
    children: ReactNode;
}

export function PageFiltersActions({children}: PageFiltersActionsProps) {
    return (
        <div className="PageFiltersActions flex justify-end gap-2 w-full">
            {children}
        </div>
    )
}