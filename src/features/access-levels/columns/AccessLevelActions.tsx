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
        <div className="flex items-center justify-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => onUsers(level)}>
                <Users className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" disabled={isMutating} onClick={() => onEdit(level)}>
                <Pencil className="size-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="text-rose-500"
                disabled={isMutating}
                onClick={() => onDelete(level)}
            >
                <Trash2 className="size-4" />
            </Button>
        </div>
    );
}
