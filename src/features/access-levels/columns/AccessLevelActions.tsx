import { Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { AccessLevel } from "@/features/access-levels/types/types";

interface AccessLevelActionsProps {
    level: AccessLevel;
    isMutating?: boolean;
    onEdit: (level: AccessLevel) => void;
    onDelete: (level: AccessLevel) => void;
    onUsers: (level: AccessLevel) => void;
}

export function AccessLevelActions({
    level,
    isMutating = false,
    onEdit,
    onDelete,
    onUsers,
}: AccessLevelActionsProps) {
    return (
        <div className="flex items-center justify-start gap-0.5">
            <Button variant="ghost" size="icon" className="size-8 rounded-md text-muted-foreground shadow-none hover:bg-primary/10 hover:text-primary" onClick={() => onUsers(level)}>
                <Users className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8 rounded-md text-muted-foreground shadow-none hover:bg-primary/10 hover:text-primary" disabled={isMutating} onClick={() => onEdit(level)}>
                <Pencil className="size-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-md text-destructive shadow-none hover:bg-destructive/10 hover:text-destructive"
                disabled={isMutating}
                onClick={() => onDelete(level)}
            >
                <Trash2 className="size-4" />
            </Button>
        </div>
    );
}
