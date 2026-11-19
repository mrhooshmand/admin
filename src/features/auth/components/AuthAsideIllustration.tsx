import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/app/providers/LocaleProvider";
import { cn } from "@/lib/utils";

const AUTH_HERO_POSTER = "/auth-airline-hero.webp";
const AUTH_HERO_VIDEO = "/auth-hero.mp4";

function useReducedMotion() {
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => setReduced(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);
	return reduced;
}

/**
 * Dribbble reference loop — darkened for brand panel.
 */
export function AuthAsideIllustration() {
	const { dir } = useLocale();
	const reduceMotion = useReducedMotion();
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const video = videoRef.current;
		if (!video || reduceMotion) return;
		video.playbackRate = 0.92;
	}, [reduceMotion]);

	return (
		<div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
			<div className="auth-hero-media absolute inset-0">
				{reduceMotion ? (
					<img
						src={AUTH_HERO_POSTER}
						alt=""
						className="auth-hero-video-dark absolute inset-0 h-full w-full object-cover object-[center_55%]"
					/>
				) : (
					<video
						ref={videoRef}
						className="auth-hero-video-dark absolute inset-0 h-full w-full object-cover object-[center_55%]"
						autoPlay
						muted
						loop
						playsInline
						preload="metadata"
						poster={AUTH_HERO_POSTER}
					>
						<source src={AUTH_HERO_VIDEO} type="video/mp4" />
					</video>
				)}
			</div>

			<div className="auth-hero-dark-scrim absolute inset-0" />

			<div
				className={cn(
					"absolute inset-0 bg-gradient-to-b from-[#122d48]/95 from-0% via-[#1a3f63]/88 via-[35%] via-[#152f4a]/70 via-[55%] to-[#0f2236]/50 to-100%",
					!reduceMotion && "auth-hero-overlay-drift"
				)}
			/>

			<div className="absolute inset-0 bg-gradient-to-t from-[#0a1828]/92 from-0% via-[#0f2940]/45 via-24% to-transparent to-48%" />

			<div
				className={cn(
					"absolute inset-0",
					dir === "rtl"
						? "bg-[radial-gradient(ellipse_at_78%_12%,rgba(255,255,255,0.05)_0%,transparent_50%)]"
						: "bg-[radial-gradient(ellipse_at_22%_12%,rgba(255,255,255,0.05)_0%,transparent_50%)]",
					!reduceMotion && "auth-hero-glint"
				)}
			/>

			<div
				className={cn(
					"absolute inset-y-0 w-24 max-lg:hidden",
					dir === "rtl"
						? "start-0 bg-gradient-to-r from-[#0f2940]/55 to-transparent"
						: "end-0 bg-gradient-to-l from-[#0f2940]/55 to-transparent"
				)}
			/>
		</div>
	);
}