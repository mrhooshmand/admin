import {useState, useEffect} from "react";
import {getUsers, updateUser, createUser, deleteUser} from "../api/userApi";
import {useLoading} from "../context/LoadingContext";
import {showAlert} from "../utils/errorHandler";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Plus, Edit, Trash2} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {User} from "@/types";

interface UserFormData {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    full_name: string;
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const {showLoading, hideLoading} = useLoading();
    const [error, setError] = useState<string>("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        full_name: ""
    });
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const fetchUsers = async (): Promise<void> => {
        showLoading();
        try {
            const response = await getUsers();
            setUsers(response.data);
            setError("");
        } catch (err) {
            showAlert("error", err);
        } finally {
            hideLoading();
        }
    };

    const updateUserApi = async (id: number, userData: Partial<User>): Promise<void> => {
        showLoading();
        try {
            await updateUser(id, userData);
        } catch (err) {
            showAlert("error", err);
        } finally {
            hideLoading();
        }
    };
    const createUserApi = async (userData: Partial<User> & { password: string }): Promise<void> => {
        showLoading();
        try {
            await createUser(userData);
            showAlert("success", "User created successfully");
        } catch (err) {
            showAlert("error", err);
        } finally {
            hideLoading();
        }
    };
    const deleteUserApi = async (id: number): Promise<void> => {
        showLoading();
        try {
            await deleteUser(id);
        } catch (err) {
            showAlert("error", err);
        } finally {
            hideLoading();
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    if (error) {
        return (
            <div>
                <div>{error}</div>
                <button onClick={fetchUsers}>Retry</button>
            </div>
        );
    }

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

    const handleSaveUser = async (): Promise<void> => {
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
                await updateUserApi(editingUser.id, userData);
            } else {
                if (!userData.password) {
                    showAlert("error", "Password is required");
                    return;
                }
                await createUserApi(userData as Partial<User> & { password: string });
            }
            setIsModalOpen(false);
            await fetchUsers();
        } catch (error) {
            showAlert("error", error);
        }
    };
    const handleDeleteDialog = (user: User): void => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async (): Promise<void> => {
        if (!selectedUser) return;
        await deleteUserApi(selectedUser.id);
        setIsDeleteDialogOpen(false);
        await fetchUsers();
    };

    // ============ Render ============
    if (error) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-500 mb-4">{error}</div>
                <button onClick={fetchUsers} className="px-4 py-2 bg-blue-500 text-white rounded">
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
                <Plus/>
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
                                            onClick={() => handleEditDialog(user)}
                                        >
                                            <Edit className="h-4 w-4"/>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteDialog(user)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4"/>
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
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                disabled={!!editingUser}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                placeholder="Enter full name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user
                            "{selectedUser?.username}" from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}