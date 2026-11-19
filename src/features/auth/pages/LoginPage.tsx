import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { showAlert } from "@/shared/utils/errorHandler";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { LoginForm } from "../components/LoginForm";
import { LoginFormData } from "../schemas";
import { useLocale } from "@/app/providers/LocaleProvider";

export default function Login() {
	const navigate = useNavigate();
	const loginMutation = useLogin();
	const { t } = useLocale();

	return (
		<div className="flex min-h-full min-w-0 flex-1 flex-col text-start">
			<div className="mb-6 space-y-2">
				<h1 className="text-pretty text-2xl font-semibold tracking-tight text-foreground">
					{t("auth.login.title")}
				</h1>
				<p className="text-pretty text-sm text-muted-foreground">
					{t("auth.login.subtitle")}
				</p>
			</div>

			<LoginForm
				onSubmit={(data: LoginFormData) => {
					loginMutation.mutate(data, {
						onSuccess: () => {
							showAlert("success", "Welcome back!");
							navigate(ROUTES.DASHBOARD);
						},
					});
				}}
				isMutating={loginMutation.isPending}
			/>

			<p className="mt-6 text-center text-sm">
				<span className="text-muted-foreground">{t("auth.login.newUser")} </span>
				<Link
					to={ROUTES.REGISTER}
					className="font-medium text-primary hover:underline"
				>
					{t("auth.login.createAccount")}
				</Link>
			</p>
		</div>
	);
}