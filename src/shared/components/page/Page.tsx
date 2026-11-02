import { ReactNode } from "react";

interface PageProps {
    title?: string;
    children: ReactNode;
}

export function Page({ title, children }: PageProps) {
    return (
        <div className="flex flex-col gap-4">
            {title ? (
                <h1 className="text-[1.375rem] font-medium leading-tight text-foreground">
                    {title}
                </h1>
            ) : null}
            <div className="vuexy-sheet overflow-hidden rounded-[0.375rem] bg-card">
                {children}
            </div>
        </div>
    );
}
