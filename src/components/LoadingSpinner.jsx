export default function LoadingSpinner({size = 40, message = "در حال بارگذاری..."}) {
    return (
        <div style={styles.container}>
            <div
                style={{
                    ...styles.spinner,
                    width: size,
                    height: size
                }}
            />
            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)"
    },
    spinner: {
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #007bff",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
    },
    message: {
        marginTop: "15px",
        color: "#666",
        fontSize: "14px"
    }
};

// اضافه کردن انیمیشن به global CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);