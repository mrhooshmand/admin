import { useLocale } from "@/app/providers/LocaleProvider";
import { useConfirmStore } from "@/app/store/confirmStore";
import { useModalStore } from "@/app/store/modalStore";
import { ApiResponse } from "@/shared/api/types/api-response";
import { AccessLevelForm } from "@/features/access-levels/components/AccessLevelForm";
import { RoleUsers } from "@/features/access-levels/components/RoleUsers";
import { AccessLevel, AccessLevelPayload } from "@/features/access-levels/types/types";

interface MutationOptions {
    onSuccess?: (response: ApiResponse<null>) => void;
}

interface UseAccessLevelDialogsProps {
    saveLevel: (
        params: { id: number; data: AccessLevelPayload },
        options?: MutationOptions,
    ) => void;
    deleteLevel: (id: number, options?: MutationOptions) => void;
}

export function useAccessLevelDialogs({
    saveLevel,
    deleteLevel,
}: UseAccessLevelDialogsProps) {
    const { t } = useLocale();
    const openModal = useModalStore((state) => state.openModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const showConfirm = useConfirmStore((state) => state.showConfirm);

    const closeOnSuccess = (response: ApiResponse<null>) => {
        if (response.status === "success") closeModal();
    };

    const addLevel = () => {
        openModal({
            title: t("accessLevels.newRole"),
            size: "full",
            content: (
                <AccessLevelForm
                    editing={null}
                    onCancel={closeModal}
                    onSave={(data) => saveLevel({ id: 0, data }, { onSuccess: closeOnSuccess })}
                />
            ),
        });
    };

    const editLevel = (level: AccessLevel) => {
        openModal({
            title: `${t("accessLevels.editRole")}: ${level.title}`,
            size: "full",
            content: (
                <AccessLevelForm
                    editing={level}
                    onCancel={closeModal}
                    onSave={(data) =>
                        saveLevel({ id: level.id, data }, { onSuccess: closeOnSuccess })
                    }
                />
            ),
        });
    };

    const deleteLevelDialog = (level: AccessLevel) => {
        showConfirm({
            title: t("accessLevels.deleteTitle"),
            description: level.title,
            confirmText: t("common.delete"),
            cancelText: t("common.cancel"),
            confirmVariant: "destructive",
            onConfirm: () => deleteLevel(level.id),
        });
    };

    const viewUsers = (level: AccessLevel) => {
        openModal({
            title: t("accessLevels.userList"),
            description: level.title,
            size: "lg",
            content: <RoleUsers levelId={level.id} />,
        });
    };

    return {
        addLevel,
        editLevel,
        deleteLevel: deleteLevelDialog,
        viewUsers,
    };
}
