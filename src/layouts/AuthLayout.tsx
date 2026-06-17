import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface AuthLayoutProps {
    children?: ReactNode;
    title?: string;
    subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    const content = (
        <div style={styles.card}>
            {/* اشکال تزئینی */}
            <div style={styles.shapeCircle1} />
            <div style={styles.shapeCircle2} />
            <div style={styles.shapeBlob} />

            <div style={styles.logoContainer}>
                <div style={styles.logo}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="2" y="2" width="28" height="28" rx="8" stroke="#5b7a9a" strokeWidth="1.5" />
                        <path d="M10 16L14 20L22 12" stroke="#5b7a9a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="23" cy="9" r="2" fill="#3d5a73" opacity="0.4" />
                    </svg>
                    <span style={styles.logoText}>Panel</span>
                </div>
            </div>

            {title && <h2 style={styles.title}>{title}</h2>}
            {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
            {children}
        </div>
    );

    if (children) {
        return <div style={styles.container}>{content}</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.shapeCircle1} />
                <div style={styles.shapeCircle2} />
                <div style={styles.shapeBlob} />

                <div style={styles.logoContainer}>
                    <div style={styles.logo}>
                        <span style={styles.logoText}>Admin Panel</span>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f2f6fa",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "48px 40px 40px",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0, 20, 40, 0.06), 0 4px 16px rgba(0, 20, 40, 0.03)",
        width: "100%",
        maxWidth: "400px",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        position: "relative",
        overflow: "hidden",
    },
    // اشکال تزئینی
    shapeCircle1: {
        position: "absolute",
        top: "-60px",
        right: "-60px",
        width: "180px",
        height: "180px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(91, 122, 154, 0.08) 0%, rgba(91, 122, 154, 0) 70%)",
        pointerEvents: "none",
    },
    shapeCircle2: {
        position: "absolute",
        bottom: "-80px",
        left: "-80px",
        width: "220px",
        height: "220px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(61, 90, 115, 0.06) 0%, rgba(61, 90, 115, 0) 70%)",
        pointerEvents: "none",
    },
    shapeBlob: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "320px",
        height: "320px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 30% 40%, rgba(91, 122, 154, 0.03), rgba(61, 90, 115, 0.02))",
        pointerEvents: "none",
        animation: "pulse 8s ease-in-out infinite",
    },
    logoContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "32px",
        position: "relative",
        zIndex: 1,
    },
    logo: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    logoText: {
        fontSize: "20px",
        fontWeight: 600,
        color: "#1e2d3d",
        letterSpacing: "-0.5px",
    },
    title: {
        textAlign: "center",
        marginBottom: "8px",
        color: "#1e2d3d",
        fontSize: "24px",
        fontWeight: 600,
        letterSpacing: "-0.5px",
        position: "relative",
        zIndex: 1,
    },
    subtitle: {
        textAlign: "center",
        color: "#8a9baa",
        marginBottom: "28px",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: 1.5,
        position: "relative",
        zIndex: 1,
    },
};

// اضافه کردن انیمیشن به document
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes pulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.05); }
    }
`;
document.head.appendChild(styleSheet);