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
        <div className="flex items-center justify-center gap-1">
            <Button
                variant="ghost"
                size="icon"
                disabled={isMutating}
                onClick={() => onEdit(role)}
            >
                <Edit className="h-4 w-4"/>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onView(role)}
            >
                <InfoIcon className="h-4 w-4"/>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="text-rose-500"
                disabled={isMutating}
                onClick={() => onDelete(role)}
            >
                <Trash2 className="h-4 w-4"/>
            </Button>
        </div>
    );
}