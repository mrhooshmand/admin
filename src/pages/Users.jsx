import { useState, useEffect } from "react";
import { getUsers } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function Users() {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers();
            setUsers(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.response?.data?.error || "خطا در دریافت لیست کاربران");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner/>;
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>{error}</div>
                <button onClick={fetchUsers} style={styles.button}>تلاش مجدد</button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2>لیست کاربران</h2>
            <div style={styles.userList}>
                {users.map((user) => (
                    <div key={user.id || user.username} style={styles.userCard}>
                        <div style={styles.avatar}>
                            {user.full_name?.charAt(0) || user.username?.charAt(0)}
                        </div>
                        <div style={styles.userInfo}>
                            <div><strong>نام کاربری:</strong> {user.username}</div>
                            <div><strong>نام کامل:</strong> {user.full_name || "—"}</div>
                            <div><strong>ایمیل:</strong> {user.email || "—"}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: "50px",
        maxWidth: "800px",
        margin: "0 auto",
    },
    userList: {
        marginTop: "20px",
    },
    userCard: {
        display: "flex",
        alignItems: "center",
        padding: "15px",
        marginBottom: "10px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        gap: "20px",
    },
    avatar: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "#4CAF50",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        fontWeight: "bold",
    },
    userInfo: {
        flex: 1,
    },
    error: {
        color: "red",
        marginBottom: "20px",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};