import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../schemas";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Key } from "lucide-react";

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => void;
    isMutating: boolean;
}

export function LoginForm({
    onSubmit,
    isMutating,
}: LoginFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
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

            {/* Buttons */}
            <div className="space-y-2">
                <Button type="submit" disabled={isMutating} className="w-full">
                    {isMutating ? "Sign in..." : "Sign in"}
                </Button>
                <Button variant="outline" className="w-full" type="button">
                    <Key className="mr-2 h-4 w-4" />
                    Single sign-on (SSO)
                </Button>
            </div>
        </form>
    );
}