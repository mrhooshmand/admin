import { useState } from "react";
import { getUsers, updateUser, createUser, deleteUser } from "../api/userApi";
import { showAlert } from "@/shared/utils/errorHandler";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table"
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";

import { User } from "../types";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useConfirmStore } from "@/app/store/confirmStore";
interface UserFormData {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    full_name: string;
}
export default function Users() {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        full_name: ""
    });
    const showConfirm = useConfirmStore((state) => state.showConfirm);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { data: users = [], error, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    })
    const queryClient = useQueryClient()
    const refreshUsers = () => queryClient.invalidateQueries({ queryKey: ['users'] })

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
            showAlert("success", "User created  successfully");
            setIsModalOpen(false);
        },
        onError: (err) => showAlert("error", err),
    });

    const { mutate: updateUserMutate, isPending: isUpdating } = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
            updateUser(id, data),
        onSuccess: () => {
            refreshUsers();
            showAlert("success", "User updated successfully");
            setIsModalOpen(false);
        },
        onError: (err) => showAlert("error", err),
    });
    const isMutating = isDeleting || isCreating || isUpdating;
    const handleEditDialog = (user: User): void => {
        setEditingUser(user);
        setFormData({
            username: user?.username || "",
            password: "",
            confirmPassword: "",
            email: user?.email || "",
            full_name: user?.full_name || ""
        });
        setIsModalOpen(true);
    };

    const handleAddDialog = (): void => {
        setEditingUser(null);
        setFormData({
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
            full_name: ""
        });
        setIsModalOpen(true);
    };

    const validateForm = (): boolean => {
        if (!editingUser && !formData.username.trim()) {
            showAlert("error", "Username is required");
            return false;
        }
        if (!editingUser && !formData.password) {
            showAlert("error", "Password is required");
            return false;
        }
        if (formData.password && formData.password !== formData.confirmPassword) {
            showAlert("error", "Passwords do not match");
            return false;
        }
        if (formData.password && formData.password.length < 4) {
            showAlert("error", "Password must be at least 4 characters");
            return false;
        }
        return true;
    };

    const handleSaveUser = (): void => {
        if (!validateForm()) return;
        try {
            const userData: Partial<User> & { password?: string } = {
                username: formData.username,
                email: formData.email,
                full_name: formData.full_name
            };

            if (formData.password) {
                userData.password = formData.password;
            }

            if (editingUser) {
                updateUserMutate({ id: editingUser.id, data: userData });
            } else {
                if (!userData.password) {
                    showAlert("error", "Password is required");
                    return;
                }
                createUserMutate(userData as Partial<User> & { password: string });
            }
            setIsModalOpen(false);
        } catch (error) {
            showAlert("error", error);
        }
    };
    const handleDelete = (user: User): void => {
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
                onClick={handleAddDialog}>
                <Plus />
            </Button>
            <Table className="mt-5">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user, index) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.full_name || "—"}</TableCell>
                            <TableCell>{user.email || "—"}</TableCell>
                            <TableCell className="text-right">
                                {user.username !== 'admin' && (
                                    <>
                                        <Button
                                            className="mx-3"
                                            variant="ghost"
                                            size="sm"
                                            disabled={isMutating}
                                            onClick={() => handleEditDialog(user)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={isMutating}
                                            onClick={() => handleDelete(user)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                        <DialogDescription>
                            {editingUser
                                ? "Edit the user information below."
                                : "Fill in the user information below."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                disabled={!!editingUser}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                placeholder="Enter full name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                {editingUser ? "New Password (optional)" : "Password"}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder={editingUser ? "Leave empty to keep current" : "Enter password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        {formData.password && (
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveUser}>
                            {editingUser ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}