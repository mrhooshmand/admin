export default function FullPageLoading({ message = "Please Wait ..." }) {
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
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    content: {
        textAlign: "center",
        padding: "30px 40px",
        borderRadius: "12px",
    },
    spinner: {
        width: "48px",
        height: "48px",
        border: "4px solid #f0f0f0",
        borderTop: "4px solid #007bff",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        margin: "0 auto 20px auto",
    },
    message: {
        color: "#555",
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