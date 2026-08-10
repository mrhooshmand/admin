import {Button} from "@/shared/ui/button";
import {showAlert} from "@/shared/utils/errorHandler";
import {useConfirmStore} from "@/app/store/confirmStore";
import {useModalStore} from "@/app/store/modalStore";

import {User} from "../types/types";
import {UserForm} from "../components/UserForm";
import {UserFormData} from "../schemas";

interface UseUserDialogsProps {
    createUserMutation: (
        data: Partial<User> & { password: string },
        options?: any
    ) => void;

    updateUserMutation: (
        params: {
            id: number;
            data: Partial<User> & { password?: string };
        },
        options?: any
    ) => void;

    deleteUserMutation: (
        id: number,
        options?: any
    ) => void;

    deleteUsersMutation: (
        data: number[],
        options?: any
    ) => void;

    isMutating: boolean;
}

export function useUserDialogs({
                                   createUserMutation,
                                   updateUserMutation,
                                   deleteUserMutation,
                                   deleteUsersMutation,
                                   isMutating,
                               }: UseUserDialogsProps) {

    const openModal = useModalStore(state => state.openModal);
    const closeModal = useModalStore(state => state.closeModal);
    const showConfirm = useConfirmStore(state => state.showConfirm);

    const addUser = () => {
        openModal({
            title: "Add User",
            size: "lg",
            content: (
                <UserForm
                    editingUser={null}
                    isMutating={isMutating}
                    onCancel={() => closeModal()}
                    onSave={(data: UserFormData) => {

                        const payload = {
                            username: data.username,
                            email: data.email ?? "",
                            full_name: data.full_name ?? "",
                            password: data.password ?? "",
                        };

                        if (!payload.password) {
                            showAlert("error", "Password is required");
                            return;
                        }

                        createUserMutation(payload, {
                            onSuccess: () => {
                                closeModal();
                            }
                        });
                    }}
                />
            ),
        });
    };

    const editUser = (user: User) => {
        openModal({
            title: `Edit User: ${user.username}`,
            size: "lg",
            content: (
                <UserForm
                    editingUser={user}
                    onCancel={() => closeModal()}
                    isMutating={isMutating}
                    onSave={(data: UserFormData) => {
                        const userData: Partial<User> & { password?: string } = {
                            username: data.username,
                            email: data.email || "",
                            full_name: data.full_name || ""
                        };
                        if (data.password) {
                            userData.password = data.password;
                        }
                        updateUserMutation({id: user.id, data: userData}, {
                            onSuccess: () => {
                                closeModal();
                            }
                        });
                    }}
                />
            ),
        });
    };

    const deleteUser = (user: User) => {
        showConfirm({
            title: "Delete User?",
            description: `Are you sure you want to delete "${user.username}"?`,
            confirmText: "Delete",
            cancelText: "Cancel",
            confirmVariant: "destructive",
            onConfirm: () => deleteUserMutation(user.id)
        });
    };

    const deleteUsers = (userIDs: number[]) => {
        showConfirm({
            title: "Delete Users?",
            description: `Are you sure you want to delete "${userIDs.length}" users?`,
            confirmText: "Delete",
            cancelText: "Cancel",
            confirmVariant: "destructive",
            onConfirm: () => deleteUsersMutation(userIDs)
        });
    };

    const viewUser = (user: User) => {
        openModal({
            title: `User Details: ${user.username}`,
            description: `Information about ${user.username}`,
            size: "lg",
            content: (
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm font-medium text-gray-500">Username</span>
                        <span className="col-span-2 text-sm">{user.username}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm font-medium text-gray-500">Full Name</span>
                        <span className="col-span-2 text-sm">{user.full_name || "—"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm font-medium text-gray-500">Email</span>
                        <span className="col-span-2 text-sm">{user.email || "—"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm font-medium text-gray-500">Created At</span>
                        <span className="col-span-2 text-sm">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
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
        addUser,
        editUser,
        viewUser,
        deleteUser,
        deleteUsers,
    };
}