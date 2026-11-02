export default function Loading({message = "Please Wait ..."}) {
    return (
        <div style={styles.overlay}>
            <div style={styles.content}>
                <div style={styles.spinner}></div>
                <p style={styles.message}>{message}</p>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed" as const,
        inset: 0,
        backgroundColor: "rgba(47, 43, 61, 0.28)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    content: {
        textAlign: "center" as const,
        padding: "28px 36px",
        borderRadius: "6px",
        backgroundColor: "#fff",
        boxShadow: "0 0.25rem 1.125rem rgba(47, 43, 61, 0.16)",
    },
    spinner: {
        width: "42px",
        height: "42px",
        border: "3px solid #ecebf1",
        borderTop: "3px solid #7367f0",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        margin: "0 auto 16px auto",
    },
    message: {
        color: "#6d6b77",
        fontSize: "14px",
        margin: 0,
    }
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);