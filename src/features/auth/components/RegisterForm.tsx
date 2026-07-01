import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "../schemas";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";

interface RegisterFormProps {
    onSave: (data: RegisterFormData) => void;
    isMutating: boolean;
}

export function RegisterForm({
    onSave,
    isMutating,
}: RegisterFormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
            full_name: "",
        },
    });

    const watchPassword = useWatch({
        control,
        name: "password"
    })
    return (
        <form onSubmit={handleSubmit(onSave)} className="grid gap-4 py-4">
            {/* Username */}
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username_field"
                    placeholder="Enter username"
                    {...register("username")}
                    className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
            </div>


            {/* Full Name */}
            <div className="space-y-2">
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
            <div className="space-y-2">
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
            <div className="space-y-2">
                <Label htmlFor="password">
                    Password
                </Label>
                <Input
                    id="password_field"
                    type="password"
                    placeholder={"Enter password"}
                    {...register("password")}
                    className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            {/* Confirm Password */}
            {watchPassword && (
                <div className="space-y-2">
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
            <div className="space-y-2">
                <Button type="submit" disabled={isMutating} className="w-full">
                    {isMutating ? "Creating account..." : "Sign Up"}
                </Button>
            </div>
        </form>
    );
}