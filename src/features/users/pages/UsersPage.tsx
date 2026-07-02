import {showAlert} from "@/shared/utils/errorHandler";
import {Button} from "@/shared/ui/button";
import {Plus} from 'lucide-react';
import {User} from "../types";
import {useConfirmStore} from "@/app/store/confirmStore";
import {useModalStore} from "@/app/store/modalStore";
import UserTable from "../components/UserTable";
import {UserForm} from '../components/UserForm';
import {UserFormData} from "../schemas";
import {useUsers} from "../hooks/useUsers";
import {TableSkeleton} from "@/shared/components/skeleton/tableSkeleton";
import {
    Page,
    PageHeader,
    PageToolbar,
    PageContent,
    PageFooter
} from "@/shared/components/pageLayout";


export default function Users() {
    const showConfirm = useConfirmStore((state) => state.showConfirm);
    const openModal = useModalStore((state) => state.openModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const {
        users,
        error,
        refetch,
        createUser,
        updateUser,
        deleteUser,
        isMutating,
        isLoading
    } = useUsers();

    const handleAddDialog = (): void => {
        openModal({
            title: "Add New User",
            size: "lg",
            content: (
                <UserForm
                    editingUser={null}
                    onCancel={() => closeModal()}
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
                        createUser(userData, {
                            onSuccess: () => {
                                closeModal();
                            }
                        });
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
                        updateUser({id: user.id, data: userData}, {
                            onSuccess: () => {
                                closeModal();
                            }
                        });
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
                        <Button variant="outline" onClick={() => closeModal()}>
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
            onConfirm: () => deleteUser(user.id, {
                onSuccess: () => {
                    closeModal();
                }
            }),
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
    if (isLoading) return (<TableSkeleton/>)

    return (
        <Page>
            <PageHeader title='Users' description='Manage Users'/>
            <PageToolbar>
                <Button
                    className="float-end"
                    variant="outline"
                    size="icon"
                    onClick={handleAddDialog}
                    disabled={isMutating}
                >
                    <Plus/>
                </Button>
            </PageToolbar>
            <PageContent>
                <UserTable users={users} isMutating={isMutating} onDelete={handleDeleteDialog} onEdit={handleEditDialog} onView={handleViewDialog}/>
            </PageContent>
            <PageFooter>

            </PageFooter>
        </Page>
    );
}