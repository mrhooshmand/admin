import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../schemas";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Key } from "lucide-react";
import { useLocale } from "@/app/providers/LocaleProvider";

interface LoginFormProps {
	onSubmit: (data: LoginFormData) => void;
	isMutating: boolean;
}

export function LoginForm({ onSubmit, isMutating }: LoginFormProps) {
	const { t } = useLocale();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-5">
			<div className="space-y-2">
				<Label htmlFor="username_field">{t("auth.form.username")}</Label>
				<Input
					id="username_field"
					placeholder={t("auth.form.usernamePlaceholder")}
					{...register("username")}
					className="h-11"
					aria-invalid={!!errors.username}
				/>
				{errors.username && (
					<p className="text-sm text-destructive">{errors.username.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="password_field">{t("auth.form.password")}</Label>
				<Input
					id="password_field"
					type="password"
					placeholder={t("auth.form.passwordPlaceholder")}
					{...register("password")}
					className="h-11"
					aria-invalid={!!errors.password}
				/>
				{errors.password && (
					<p className="text-sm text-destructive">{errors.password.message}</p>
				)}
			</div>

			<Button type="submit" disabled={isMutating} className="mt-1 h-11 w-full">
				{isMutating ? t("auth.form.signInPending") : t("auth.form.signIn")}
			</Button>

			<div className="flex items-center gap-3 text-xs text-muted-foreground">
				<span className="h-px flex-1 bg-border" />
				<span className="uppercase tracking-wider">{t("auth.form.or")}</span>
				<span className="h-px flex-1 bg-border" />
			</div>

			<Button variant="outline" className="h-11 w-full" type="button">
				<Key className="me-2 size-4 shrink-0" />
				{t("auth.form.sso")}
			</Button>
		</form>
	);
}