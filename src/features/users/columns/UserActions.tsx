import { Button } from "@/shared/ui/button.tsx";
import { Edit, InfoIcon, Trash2 } from "lucide-react";
import { User } from "@/features/users/types/types.ts";
import { useLocale } from "@/app/providers/LocaleProvider";

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
  const { t } = useLocale();

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="secondary"
        size="icon"
        aria-label={t("common.view")}
        title={t("common.view")}
        onClick={() => onView(user)}
      >
        <InfoIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        aria-label={t("common.edit")}
        title={t("common.edit")}
        disabled={isMutating}
        onClick={() => onEdit(user)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        size="icon"
        className="text-rose-500"
        aria-label={t("common.delete")}
        title={t("common.delete")}
        disabled={isMutating}
        onClick={() => onDelete(user)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
