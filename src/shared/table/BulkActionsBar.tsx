import {ReactNode} from "react";

interface BulkActionsBarProps {
    count: number;
    children: ReactNode;
}

export function BulkActionsBar({
                                   count,
                                   children,
                               }: BulkActionsBarProps) {
    if (count === 0) return null;

    return (
        <div className="flex items-center justify-between rounded-md border mb-4 p-3">
            <span className="text-sm text-muted-foreground">
                {count} selected
            </span>
            <div className="flex gap-2">
                {children}
            </div>
        </div>
    );
}