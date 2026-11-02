export function SidebarLogo({ className = "size-9" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 40 40"
            className={className}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="score-logo" x1="6" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#9B92F8" />
                    <stop offset="100%" stopColor="#7367F0" />
                </linearGradient>
            </defs>
            <rect width="40" height="40" rx="12" fill="url(#score-logo)" />
            <circle cx="31" cy="9" r="7" fill="white" opacity="0.16" />
            <rect x="9" y="11.5" width="15" height="3.4" rx="1.7" fill="white" />
            <rect x="13" y="18.3" width="18" height="3.4" rx="1.7" fill="white" opacity="0.92" />
            <rect x="9" y="25.1" width="12" height="3.4" rx="1.7" fill="white" opacity="0.72" />
        </svg>
    );
}
