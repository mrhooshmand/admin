import {ReactNode} from "react";

interface PageToolbarProps {
    children: ReactNode;
}

export function PageToolbar({children}: PageToolbarProps) {
    return (
        <div>
            {children}
        </div>
    )
}