import {ReactNode} from "react";
import {Card} from "@/shared/ui/card.tsx";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/shared/ui/collapsible"
import {PageFiltersActions} from "@/shared/components/page-filters/PageFiltersActions.tsx";

interface PageFiltersProps {
    children?: ReactNode;
    title?: String;
    actions?: ReactNode;
}

function PageFilters({title = "Search", actions, children}: PageFiltersProps) {
    return (
        <Card className="w-full py-1">
            <Collapsible className="w-full">
                <div className="flex items-center justify-between gap-4">
                    <CollapsibleTrigger asChild>
                        <div className="flex flex-1 cursor-pointer items-center ps-2">
                            <span className="font-medium">{title}</span>
                        </div>
                    </CollapsibleTrigger>
                    <PageFiltersActions>
                        {actions}
                    </PageFiltersActions>
                </div>
                <CollapsibleContent className="border-t-1 mt-1 p-2">
                    {children}
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}

export default PageFilters