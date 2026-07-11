import {ReactNode} from "react";

interface PageProps {
    children: ReactNode;
}

export function Page({children}: PageProps) {
    return (
        <div className="flex flex-col">
            {children}
        </div>
    )
}