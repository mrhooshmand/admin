import { useLocale } from "@/app/providers/LocaleProvider";

export function AuthAsideFooter() {
	const { t } = useLocale();

	return (
		<div className="pointer-events-none relative z-[6] w-full max-lg:absolute max-lg:inset-x-6 max-lg:bottom-[calc(env(safe-area-inset-bottom)+min(46dvh,22rem))] lg:static lg:pt-0">
			<div
				className="mb-5 hidden h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent lg:block"
				aria-hidden
			/>
			<div className="w-full space-y-1.5 text-center">
				<p className="text-pretty text-[11px] font-medium tracking-wide text-white/55 lg:text-xs lg:text-white/60">
					{t("auth.aside.footer.rights")}
				</p>
				<p className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-white/35 lg:block lg:text-center">
					{t("auth.brand.short")}
				</p>
			</div>
			<div
				className="pointer-events-none absolute inset-x-0 -bottom-2 hidden h-16 bg-gradient-to-t from-[#0a1828]/50 to-transparent lg:block"
				aria-hidden
			/>
		</div>
	);
}