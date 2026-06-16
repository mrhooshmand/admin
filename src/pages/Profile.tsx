import {useAuth} from "../context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Profile() {
    const {user, logout} = useAuth();

    return (
        <div style={styles.container}>
            <div style={styles.profileCard}>
                <div style={styles.header}>
                    <h2>User Profile</h2>
                </div>

                <div style={styles.avatar}>
                    <div style={styles.avatarText}>
                        {user?.full_name?.charAt(0) || user?.username?.charAt(0)}
                    </div>
                </div>

                <div style={styles.info}>
                    <div style={styles.infoRow}>
                        <span style={styles.label}>Username</span>
                        <span style={styles.value}>{user?.username}</span>
                    </div>

                    <div style={styles.infoRow}>
                        <span style={styles.label}>Name</span>
                        <span style={styles.value}>{user?.full_name || "—"}</span>
                    </div>

                    <div style={styles.infoRow}>
                        <span style={styles.label}>Email</span>
                        <span style={styles.value}>{user?.email || "—"}</span>
                    </div>
                </div>
                <Button className="w-full" onClick={() => window.location.href = "/dashboard"}>
                    Dashboard
                </Button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
    },
    profileCard: {
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        padding: "30px",
        maxWidth: "500px",
        width: "100%",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        borderBottom: "2px solid #f0f0f0",
        paddingBottom: "15px",
    },
    avatar: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "30px",
    },
    avatarText: {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        backgroundColor: "#4CAF50",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "40px",
        fontWeight: "bold",
    },
    info: {
        marginBottom: "30px",
    },
    infoRow: {
        display: "flex",
        padding: "12px 0",
        borderBottom: "1px solid #f0f0f0",
    },
    label: {
        fontWeight: "bold",
        width: "120px",
        color: "#666",
    },
    value: {
        flex: 1,
        color: "#333",
    },
    button: {
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        width: "100%",
    },
    logoutButton: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
    },
    dashboardButton: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        width: "100%",
    },
    loading: {
        textAlign: "center",
        fontSize: "18px",
        color: "#666",
    },
    error: {
        textAlign: "center",
        fontSize: "16px",
        color: "#dc3545",
        marginBottom: "20px",
    },
};