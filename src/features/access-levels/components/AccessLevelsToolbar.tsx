import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface AccessLevelsToolbarProps {
    onAdd?: () => void;
}

export function AccessLevelsToolbar({ onAdd }: AccessLevelsToolbarProps) {
    return (
        <Button
            variant="outline"
            size="icon"
            className="size-9 rounded-md border-border bg-card text-muted-foreground shadow-none hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            onClick={onAdd}
        >
            <Plus />
        </Button>
    );
}
