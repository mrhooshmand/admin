import { Outlet } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";
import { ThemeToggle } from "@/shared/components/SettingsMenu";
import { AuthAsideFooter } from "@/features/auth/components/AuthAsideFooter";
import { AuthAsideGlassTiles } from "@/features/auth/components/AuthAsideGlassTiles";
import { AuthAsideIllustration } from "@/features/auth/components/AuthAsideIllustration";
import { AuthLogo } from "@/features/auth/components/AuthLogo";
import { cn } from "@/lib/utils";

/** Fallback base — photo + overlays supply most of the tone */
const BRAND_PANEL = "bg-[#1a3f63] text-white";

export default function AuthLayout() {
	const { dir, t } = useLocale();

	return (
		<div
			dir={dir}
			className={cn(
				"relative grid min-h-dvh w-full min-w-0",
				"lg:grid-cols-[minmax(280px,38%)_minmax(0,1fr)]"
			)}
		>
			{/* Brand — full-bleed hero on mobile; split column on desktop */}
			<aside
				className={cn(
					"relative flex min-w-0 flex-col overflow-hidden",
					"max-lg:absolute max-lg:inset-0 max-lg:min-h-dvh",
					"lg:relative lg:min-h-dvh",
					BRAND_PANEL
				)}
			>
				<AuthAsideIllustration />

				{/* Mobile: soft fade into form sheet */}
				<div
					className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-40 bg-gradient-to-t from-[#0a1828]/90 via-[#0f2940]/35 to-transparent lg:hidden"
					aria-hidden
				/>
				<div
					className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] hidden h-36 bg-gradient-to-t from-[#0a1828]/75 via-[#0f2940]/25 to-transparent lg:block"
					aria-hidden
				/>

				<div className="relative z-10 flex min-h-dvh min-w-0 flex-col p-6 pt-[max(1.5rem,env(safe-area-inset-top))] sm:p-8 lg:p-10 xl:p-12">
					<div className="max-w-sm min-w-0 shrink-0 text-start">
						<div className="flex items-center gap-2.5">
							<AuthLogo className="shrink-0 text-white drop-shadow-sm" />
							<div className="min-w-0">
								<span className="text-lg font-semibold tracking-tight drop-shadow-sm sm:text-xl">
									{t("auth.brand.short")}
								</span>
								<p className="mt-0.5 text-pretty text-[11px] font-medium leading-relaxed tracking-normal text-white/70">
									{t("auth.brand.expanded")}
								</p>
							</div>
						</div>
						<p className="mt-6 hidden text-pretty text-sm leading-relaxed text-white/90 drop-shadow-sm lg:block">
							{t("auth.aside.tagline")}
						</p>
						<div className="mt-5 hidden h-px w-10 bg-white/30 lg:block" />
						<p className="mt-4 hidden text-pretty text-xs leading-relaxed text-white/75 lg:block">
							{t("auth.aside.description")}
						</p>
					</div>

					<div className="mt-auto hidden w-full max-w-sm flex-col items-center gap-8 pt-10 lg:flex">
						<AuthAsideGlassTiles />
						<AuthAsideFooter />
					</div>
				</div>
			</aside>

			{/* Form — overlaps hero on mobile */}
			<section
				className={cn(
					"auth-themed relative z-10 flex min-h-dvh min-w-0 flex-col",
					"max-lg:justify-end",
					"lg:bg-background lg:justify-normal"
				)}
			>
				<div className="absolute end-4 top-4 z-20 sm:end-6 sm:top-6 max-lg:[&_button]:border-white/25 max-lg:[&_button]:bg-black/25 max-lg:[&_button]:text-white max-lg:[&_button]:backdrop-blur-md">
					<ThemeToggle />
				</div>

				<div
					className={cn(
						"flex min-w-0 flex-1 overflow-y-auto overflow-x-hidden",
						"max-lg:items-end max-lg:px-4 max-lg:pb-[max(1.25rem,env(safe-area-inset-bottom))] max-lg:pt-28",
						"sm:max-lg:px-5",
						"lg:items-center lg:justify-center lg:px-10 lg:py-16 xl:px-16"
					)}
				>
					<div
						className={cn(
							"auth-mobile-form w-full min-w-0 max-w-[420px] lg:mx-auto",
							"max-lg:rounded-[1.75rem] max-lg:border max-lg:border-border/60",
							"max-lg:bg-background max-lg:shadow-[0_-24px_64px_-16px_rgba(0,0,0,0.45),0_16px_40px_-12px_rgba(0,0,0,0.2)]",
							"max-lg:backdrop-blur-xl max-lg:supports-[backdrop-filter]:bg-background/97",
							"max-lg:px-6 max-lg:py-8 sm:max-lg:px-8 sm:max-lg:py-9"
						)}
					>
						<Outlet />
					</div>
				</div>
			</section>
		</div>
	);
}