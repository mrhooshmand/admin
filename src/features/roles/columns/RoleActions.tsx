import {Button} from "@/shared/ui/button.tsx";
import {Edit, InfoIcon, Trash2} from "lucide-react";
import {Role} from "@/features/roles/types/types.ts";

interface RoleActionsProps {
    role: Role;
    isMutating?: boolean;
    onEdit: (role: Role) => void;
    onDelete: (role: Role) => void;
    onView: (role: Role) => void;
}

export function RoleActions({
                                role,
                                isMutating = false,
                                onEdit,
                                onDelete,
                                onView,
                            }: RoleActionsProps) {
    return (
        <div className="flex items-center justify-start gap-0.5">
            <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-md text-muted-foreground shadow-none hover:bg-primary/10 hover:text-primary"
                disabled={isMutating}
                onClick={() => onEdit(role)}
            >
                <Edit className="h-4 w-4"/>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-md text-muted-foreground shadow-none hover:bg-primary/10 hover:text-primary"
                onClick={() => onView(role)}
            >
                <InfoIcon className="h-4 w-4"/>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-md text-destructive shadow-none hover:bg-destructive/10 hover:text-destructive"
                disabled={isMutating}
                onClick={() => onDelete(role)}
            >
                <Trash2 className="h-4 w-4"/>
            </Button>
        </div>
    );
}