import {Button} from "@/shared/ui/button.tsx";
import {Edit, InfoIcon, Trash2} from "lucide-react";
import {Role} from "@/features/roles/types/types.ts";
import {useLocale} from "@/app/providers/LocaleProvider";

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
    const {t} = useLocale();

    return (
        <div className="flex items-center justify-center gap-1">
            <Button
                variant="outline"
                size="icon"
                aria-label={t("common.edit")}
                title={t("common.edit")}
                disabled={isMutating}
                onClick={() => onEdit(role)}
            >
                <Edit className="h-4 w-4"/>
            </Button>

            <Button
                variant="outline"
                size="icon"
                aria-label={t("common.view")}
                title={t("common.view")}
                onClick={() => onView(role)}
            >
                <InfoIcon className="h-4 w-4"/>
            </Button>

            <Button
                variant="destructive"
                size="icon"
                className="text-rose-500"
                aria-label={t("common.delete")}
                title={t("common.delete")}
                disabled={isMutating}
                onClick={() => onDelete(role)}
            >
                <Trash2 className="h-4 w-4"/>
            </Button>
        </div>
    );
}
