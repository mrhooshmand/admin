import {Button} from "@/shared/ui/button";
import {useConfirmStore} from "@/app/store/confirmStore";
import {useModalStore} from "@/app/store/modalStore";

import {Role} from "../types/types";
import {RoleForm} from "../components/RoleForm";
import {RoleFormData} from "../schemas";

interface UseRoleDialogsProps {
    createRoleMutation: (
        data: Partial<Role>,
        options?: any
    ) => void;

    updateRoleMutation: (
        params: {
            id: number;
            data: Partial<Role>;
        },
        options?: any
    ) => void;

    deleteRoleMutation: (
        id: number,
        options?: any
    ) => void;

    isMutating: boolean;
}

export function useRoleDialogs({
                                   createRoleMutation,
                                   updateRoleMutation,
                                   deleteRoleMutation,
                                   isMutating,
                               }: UseRoleDialogsProps) {

    const openModal = useModalStore(state => state.openModal);
    const closeModal = useModalStore(state => state.closeModal);
    const showConfirm = useConfirmStore(state => state.showConfirm);

    const addRole = () => {
        openModal({
            title: "Add Role",
            size: "lg",
            content: (
                <RoleForm
                    editingRole={null}
                    isMutating={isMutating}
                    onCancel={closeModal}
                    onSave={(data: RoleFormData) => {

                        const payload = {
                            name: data.name,
                            description: data.description ?? "",
                        };

                        createRoleMutation(payload, {
                            onSuccess: closeModal,
                        });
                    }}
                />
            ),
        });
    };

    const editRole = (role: Role) => {
        openModal({
            title: `Edit Role: ${role.name}`,
            size: "lg",
            content: (
                <RoleForm
                    editingRole={role}
                    onCancel={() => closeModal()}
                    isMutating={isMutating}
                    onSave={(data: RoleFormData) => {
                        const roleData: Partial<Role> = {
                            name: data.name,
                            description: data.description || ""
                        };

                        updateRoleMutation({id: role.id, data: roleData}, {
                            onSuccess: () => {
                                closeModal();
                            }
                        });
                    }}
                />
            ),
        });
    };

    const deleteRole = (role: Role) => {
        showConfirm({
            title: "Delete Role?",
            description: `Are you sure you want to delete "${role.name}"?`,
            confirmText: "Delete",
            cancelText: "Cancel",
            confirmVariant: "destructive",
            onConfirm: () => deleteRoleMutation(role.id, {
                onSuccess: () => {
                    closeModal();
                }
            }),
        });
    };

    const viewRole = (role: Role) => {
        openModal({
            title: `Role Details: ${role.name}`,
            description: `Information about ${role.name}`,
            size: "lg",
            content: (
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm font-medium text-gray-500">Role</span>
                        <span className="col-span-2 text-sm">{role.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm font-medium text-gray-500">Description</span>
                        <span className="col-span-2 text-sm">{role.description || "—"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm font-medium text-gray-500">Created At</span>
                        <span className="col-span-2 text-sm">
                            {role.created_at ? new Date(role.created_at).toLocaleDateString() : "—"}
                        </span>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button variant="outline" onClick={() => closeModal()}>
                            Close
                        </Button>
                    </div>
                </div>
            ),
        });
    };

    return {
        addRole,
        editRole,
        viewRole,
        deleteRole,
    };
}