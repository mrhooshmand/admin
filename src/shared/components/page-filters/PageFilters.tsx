import {ReactNode} from "react";
import {Card} from "@/shared/ui/card.tsx";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/shared/ui/collapsible"
import {PageFiltersActions} from "@/shared/components/page-filters/PageFiltersActions.tsx";
import { useLocale } from "@/app/providers/LocaleProvider";

interface PageFiltersProps {
    children?: ReactNode;
    title?: string;
    actions?: ReactNode;
}

function PageFilters({title, actions, children}: PageFiltersProps) {
    const { t } = useLocale();
    const label = title ?? t("common.search");
    return (
        <Card className="mb-4 w-full gap-0 overflow-hidden py-0">
            <Collapsible className="w-full">
                <div className="flex h-12 items-center justify-between gap-4 px-4">
                    <CollapsibleTrigger asChild>
                        <div className="flex flex-1 cursor-pointer items-center">
                            <span className="text-[0.9375rem] font-medium">{label}</span>
                        </div>
                    </CollapsibleTrigger>
                    <PageFiltersActions>
                        {actions}
                    </PageFiltersActions>
                </div>
                <CollapsibleContent className="border-t px-4 py-4">
                    {children}
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}

export default PageFilters