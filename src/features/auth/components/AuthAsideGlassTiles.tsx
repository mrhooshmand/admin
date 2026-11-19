import type { LucideIcon } from "lucide-react";
import {
	BarChart3,
	Plane,
	ShieldCheck,
	UtensilsCrossed,
} from "lucide-react";
import { useLocale } from "@/app/providers/LocaleProvider";

const TILES: {
	icon: LucideIcon;
	titleKey: "auth.aside.tiles.schedule" | "auth.aside.tiles.access" | "auth.aside.tiles.reports" | "auth.aside.tiles.catering";
}[] = [
	{ icon: Plane, titleKey: "auth.aside.tiles.schedule" },
	{ icon: UtensilsCrossed, titleKey: "auth.aside.tiles.catering" },
	{ icon: BarChart3, titleKey: "auth.aside.tiles.reports" },
	{ icon: ShieldCheck, titleKey: "auth.aside.tiles.access" },
];

export function AuthAsideGlassTiles() {
	const { t } = useLocale();

	return (
		<div
			className="grid w-full max-w-[18rem] grid-cols-2 gap-3 justify-items-stretch"
			aria-hidden
		>
			{TILES.map(({ icon: Icon, titleKey }, index) => (
				<div
					key={titleKey}
					className="auth-aside-tile group flex min-h-[5.5rem] flex-col items-center justify-center gap-2.5 rounded-2xl bg-black/[0.05] px-3 py-3.5 text-center shadow-none backdrop-blur-sm supports-[backdrop-filter]:bg-transparent"
					style={{ animationDelay: `${index * 90}ms` }}
				>
					<Icon
						className="size-[1.35rem] text-white/90 transition-[filter,transform] duration-300 group-hover:scale-110 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]"
						strokeWidth={1.65}
					/>
					<p className="text-pretty text-[10px] font-semibold leading-snug text-white/85">
						{t(titleKey)}
					</p>
				</div>
			))}
		</div>
	);
}