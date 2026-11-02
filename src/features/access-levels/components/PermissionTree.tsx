import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/shared/ui/checkbox";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import { PermissionNode } from "@/features/access-levels/types/types";

interface PermissionTreeProps {
    nodes: PermissionNode[];
    checked: Set<string>;
    onToggle: (id: string, value: boolean) => void;
    defaultOpen?: boolean;
}

export function PermissionTree({
    nodes,
    checked,
    onToggle,
    defaultOpen = false,
}: PermissionTreeProps) {
    if (nodes.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            {nodes.map((node) =>
                node.kind === "check" ? (
                    <label key={node.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                            checked={checked.has(node.id)}
                            onCheckedChange={(value) => onToggle(node.id, value === true)}
                        />
                        <span>{node.title}</span>
                    </label>
                ) : (
                    <Collapsible key={node.id} defaultOpen={defaultOpen} className="rounded-md border">
                        <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-start text-sm font-medium">
                            {node.title}
                            <ChevronDown className="size-4 text-muted-foreground" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="border-t px-3 py-2">
                            <PermissionTree
                                nodes={node.children}
                                checked={checked}
                                onToggle={onToggle}
                                defaultOpen={defaultOpen}
                            />
                        </CollapsibleContent>
                    </Collapsible>
                ),
            )}
        </div>
    );
}
