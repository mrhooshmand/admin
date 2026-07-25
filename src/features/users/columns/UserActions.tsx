import {Button} from "@/shared/ui/button.tsx";
import {Edit, InfoIcon, Trash2} from "lucide-react";
import {User} from "@/features/users/types/types.ts";

interface UserActionsProps {
    user: User;
    isMutating?: boolean;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onView: (user: User) => void;
}

export function UserActions({
                                user,
                                isMutating = false,
                                onEdit,
                                onDelete,
                                onView,
                            }: UserActionsProps) {
    return (
        <div className="flex items-center justify-center gap-1">
            <Button
                variant="ghost"
                size="icon"
                disabled={isMutating}
                onClick={() => onEdit(user)}
            >
                <Edit className="h-4 w-4"/>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onView(user)}
            >
                <InfoIcon className="h-4 w-4"/>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="text-rose-500"
                disabled={isMutating}
                onClick={() => onDelete(user)}
            >
                <Trash2 className="h-4 w-4"/>
            </Button>
        </div>
    );
}