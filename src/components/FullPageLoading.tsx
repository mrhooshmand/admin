export default function FullPageLoading({message = "Please Wait ..."}) {
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
        position: "absolute",
        top: "50%",
        left: "50%",
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(158,158,158,0.85)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        transform: "translate(-50%,-50%)",
        width: "100%",
        height: "100vh",
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