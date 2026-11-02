import { useLocale } from "@/app/providers/LocaleProvider";
import { useModalStore } from "@/app/store/modalStore";
import { ApiResponse } from "@/shared/api/types/api-response";
import { CheckUserForm } from "@/features/ws-allowed-ip/components/CheckUserForm";
import { SoftwareForm } from "@/features/ws-allowed-ip/components/SoftwareForm";
import { CheckUserPayload, WsAllowedIp } from "@/features/ws-allowed-ip/types";

interface MutationOptions {
    onSuccess?: (response: ApiResponse<null>) => void;
}

interface UseWsAllowedIpDialogsProps {
    saveSoftware: (
        params: { id: number; softwareName: string },
        options?: MutationOptions,
    ) => void;
    checkUser: (payload: CheckUserPayload, options?: MutationOptions) => void;
}

export function useWsAllowedIpDialogs({ saveSoftware, checkUser }: UseWsAllowedIpDialogsProps) {
    const { t } = useLocale();
    const openModal = useModalStore((state) => state.openModal);
    const closeModal = useModalStore((state) => state.closeModal);

    const closeOnSuccess = (response: ApiResponse<null>) => {
        if (response.status === "success") closeModal();
    };

    const editSoftware = (row: WsAllowedIp) => {
        openModal({
            title: t("wsAllowed.editSoftware"),
            size: "sm",
            content: (
                <SoftwareForm
                    current={row.softwareName}
                    onCancel={closeModal}
                    onSave={(softwareName) =>
                        saveSoftware({ id: row.id, softwareName }, { onSuccess: closeOnSuccess })
                    }
                />
            ),
        });
    };

    const checkWsUser = (row: WsAllowedIp) => {
        openModal({
            title: t("wsAllowed.checkUser"),
            description: row.customer || row.user,
            size: "lg",
            content: (
                <CheckUserForm
                    row={row}
                    onCancel={closeModal}
                    onSave={(payload) => checkUser(payload, { onSuccess: closeOnSuccess })}
                />
            ),
        });
    };

    return { editSoftware, checkWsUser };
}
