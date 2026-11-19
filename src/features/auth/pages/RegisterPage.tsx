import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { showAlert } from "@/shared/utils/errorHandler";
import { useRegister } from "@/features/auth/hooks/useAuth";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { RegisterFormData } from "../schemas";
import { useLocale } from "@/app/providers/LocaleProvider";

export default function Register() {
	const navigate = useNavigate();
	const registerMutation = useRegister();
	const { t } = useLocale();

	return (
		<div className="flex min-h-full min-w-0 flex-1 flex-col text-start">
			<div className="mb-6 space-y-2">
				<h1 className="text-pretty text-2xl font-semibold tracking-tight text-foreground">
					{t("auth.register.title")}
				</h1>
				<p className="text-pretty text-sm text-muted-foreground">
					{t("auth.register.subtitle")}
				</p>
			</div>

			<RegisterForm
				onSubmit={(data: RegisterFormData) => {
					registerMutation.mutate(data, {
						onSuccess: () => {
							showAlert("success", "Account created successfullt");
							navigate(ROUTES.LOGIN);
						},
					});
				}}
				isMutating={registerMutation.isPending}
			/>

			<p className="mt-6 text-center text-sm">
				<span className="text-muted-foreground">{t("auth.register.hasAccount")} </span>
				<Link
					to={ROUTES.LOGIN}
					className="font-medium text-primary hover:underline"
				>
					{t("auth.register.signIn")}
				</Link>
			</p>
		</div>
	);
}