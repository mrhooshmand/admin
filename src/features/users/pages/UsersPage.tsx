import { getUsers, updateUser, createUser, deleteUser } from "../api/userApi";
import { showAlert } from "@/shared/utils/errorHandler";

import { Button } from "@/shared/ui/button";
import { Plus } from 'lucide-react';
import { User } from "../types";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useConfirmStore } from "@/app/store/confirmStore";
import { useModalStore } from "@/app/store/modalStore";
import UserTable from "../components/UserTable";
import { UserForm } from '../components/UserForm';
import { UserFormData } from "../schemas";

export default function Users() {
    const showConfirm = useConfirmStore((state) => state.showConfirm);
    const openModal = useModalStore((state) => state.openModal);
    const closeModal = useModalStore((state) => state.closeModal);

    const { data: users = [], error, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    });

    const queryClient = useQueryClient();
    const refreshUsers = () => queryClient.invalidateQueries({ queryKey: ['users'] });

    const { mutate: deleteUserMutate, isPending: isDeleting } = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            refreshUsers();
            showAlert("success", "User deleted successfully");
        },
        onError: (err) => showAlert("error", err),
    });

    const { mutate: createUserMutate, isPending: isCreating } = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            refreshUsers();
            showAlert("success", "User created successfully");
            closeModal();
        },
        onError: (err) => showAlert("error", err),
    });

    const { mutate: updateUserMutate, isPending: isUpdating } = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
            updateUser(id, data),
        onSuccess: () => {
            refreshUsers();
            showAlert("success", "User updated successfully");
            closeModal();
        },
        onError: (err) => showAlert("error", err),
    });

    const isMutating = isDeleting || isCreating || isUpdating;

    const handleAddDialog = (): void => {
        openModal({
            title: "Add New User",
            size: "lg",
            content: (
                <UserForm
                    editingUser={null}
                    onCancel={closeModal}
                    isMutating={isMutating}
                    onSave={(data: UserFormData) => {
                        const userData: Partial<User> & { password: string } = {
                            username: data.username,
                            email: data.email || "",
                            full_name: data.full_name || "",
                            password: data.password || "",
                        };

                        if (!userData.password) {
                            showAlert("error", "Password is required");
                            return;
                        }
                        createUserMutate(userData);
                    }}
                />
            ),
        });
    };

    const handleEditDialog = (user: User) => {
        openModal({
            title: `Edit User: ${user.username}`,
            size: "lg",
            content: (
                <UserForm
                    editingUser={user}
                    onCancel={closeModal}
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
                        updateUserMutate({ id: user.id, data: userData });
                    }}
                />
            ),
        });
    };

    const handleViewDialog = (user: User) => {
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
                        <Button variant="outline" onClick={closeModal}>
                            Close
                        </Button>
                    </div>
                </div>
            ),
        });
    };

    const handleDeleteDialog = (user: User): void => {
        showConfirm({
            title: "Delete User?",
            description: `Are you sure you want to delete "${user.username}"?`,
            confirmText: "Delete",
            cancelText: "Cancel",
            confirmVariant: "destructive",
            onConfirm: () => deleteUserMutate(user.id),
        });
    };

    if (error) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-500 mb-4">{error.message}</div>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Button
                className="float-end"
                variant="outline"
                size="icon"
                onClick={handleAddDialog}
                disabled={isMutating}
            >
                <Plus />
            </Button>
            <UserTable users={users} isMutating={isMutating} onDelete={handleDeleteDialog} onEdit={handleEditDialog} onView={handleViewDialog} />
        </div>
    );
}