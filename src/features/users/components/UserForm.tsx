import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormData } from "../schemas";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { User } from "../types";

interface UserFormProps {
    editingUser: User | null;
    onSave: (data: UserFormData) => void;
    onCancel: () => void;
    isMutating: boolean;
}

export function UserForm({
    editingUser,
    onSave,
    onCancel,
    isMutating,
}: UserFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
            full_name: "",
        },
    });

    useEffect(() => {
        if (editingUser) {
            reset({
                username: editingUser.username || "",
                password: "",
                confirmPassword: "",
                email: editingUser.email || "",
                full_name: editingUser.full_name || "",
            });
        } else {
            reset({
                username: "",
                password: "",
                confirmPassword: "",
                email: "",
                full_name: "",
            });
        }
    }, [editingUser, reset]);

    const watchPassword = watch("password");

    return (
        <form onSubmit={handleSubmit(onSave)} className="grid gap-4 py-4">
            {/* Username */}
            <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username_field"
                    placeholder="Enter username"
                    {...register("username")}
                    disabled={!!editingUser}
                    className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
            </div>

            {/* Full Name */}
            <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                    id="full_name"
                    placeholder="Enter full name"
                    {...register("full_name")}
                />
                {errors.full_name && (
                    <p className="text-sm text-red-500">{errors.full_name.message}</p>
                )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email_field"
                    type="email"
                    placeholder="Enter email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            {/* Password */}
            <div className="grid gap-2">
                <Label htmlFor="password">
                    {editingUser ? "New Password (optional)" : "Password"}
                </Label>
                <Input
                    id="password_field"
                    type="password"
                    placeholder={editingUser ? "Leave empty to keep current" : "Enter password"}
                    {...register("password")}
                    className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            {/* Confirm Password */}
            {watchPassword && (
                <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword_field"
                        type="password"
                        placeholder="Confirm password"
                        {...register("confirmPassword")}
                        className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2 mt-4 justify-end">
                <Button variant="outline" onClick={onCancel} type="button">
                    Cancel
                </Button>
                <Button type="submit" disabled={isMutating}>
                    {isMutating ? "Saving..." : editingUser ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
}