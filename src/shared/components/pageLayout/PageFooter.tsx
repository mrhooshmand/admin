import {ReactNode} from "react";

interface PageHeaderProps {
    children: ReactNode
}

export function PageFooter({children}: PageHeaderProps) {
    return (
        <div>
            {children}
        </div>
    )
}