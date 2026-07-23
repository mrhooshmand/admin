import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {roleSchema, RoleFormData} from "../schemas";
import {Input} from "@/shared/ui/input";
import {Label} from "@/shared/ui/label";
import {Button} from "@/shared/ui/button";
import {Role} from "../types/types";

interface RoleFormProps {
    editingRole: Role | null;
    onSave: (data: RoleFormData) => void;
    onCancel: () => void;
    isMutating: boolean;
}

export function RoleForm({
                             editingRole,
                             onSave,
                             onCancel,
                             isMutating,
                         }: RoleFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<RoleFormData>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (editingRole) {
            reset({
                name: editingRole.name || "",
                description: editingRole.description || "",
            });
        } else {
            reset({
                name: "",
                description: "",
            });
        }
    }, [editingRole, reset]);

    return (
        <form onSubmit={handleSubmit(onSave)} className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
                <Label htmlFor="name">Role</Label>
                <Input
                    id="name_field"
                    placeholder="Enter name"
                    {...register("name")}
                    disabled={!!editingRole}
                    className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
            </div>

            {/* Description */}
            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    placeholder="Enter description"
                    {...register("description")}
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
            </div>


            {/* Buttons */}
            <div className="flex gap-2 mt-4 justify-end">
                <Button variant="outline" onClick={onCancel} type="button">
                    Cancel
                </Button>
                <Button type="submit" disabled={isMutating}>
                    {isMutating ? "Saving..." : editingRole ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
}