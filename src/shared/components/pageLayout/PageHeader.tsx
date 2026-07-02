import {PageToolbar} from "@/shared/components/pageLayout/PageToolbar.tsx";
import {ReactNode} from "react";

interface PageHeaderProps {
    title: string;
    description: string
    toolbar: ReactNode;
}

export function PageHeader({title, description, toolbar}: PageHeaderProps) {
    return (
        <>
            <div>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            <PageToolbar>
                {toolbar}
            </PageToolbar>
        </>
    )
}