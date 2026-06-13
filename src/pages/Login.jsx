import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginRequest } from "../api/authApi";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const loginEvent = async () => {
        if (!username.trim() || !password.trim()) {
            setError("لطفاً نام کاربری و رمز عبور را وارد کنید");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await loginRequest({
                username,
                password
            });
            login(response.data);
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed:", error);
            setError("نام کاربری یا رمز عبور اشتباه است");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>ورود به حساب کاربری</h2>

                {error && <div style={styles.error}>{error}</div>}

                <input
                    type="text"
                    placeholder="نام کاربری"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                    onKeyPress={(e) => e.key === "Enter" && loginEvent()}
                />

                <input
                    type="password"
                    placeholder="رمز عبور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    onKeyPress={(e) => e.key === "Enter" && loginEvent()}
                />

                <button
                    onClick={loginEvent}
                    disabled={loading}
                    style={styles.button}
                >
                    {loading ? "در حال ورود..." : "ورود"}
                </button>

                <p style={styles.footer}>
                    حساب کاربری ندارید؟ <Link to="/register" style={styles.link}>ثبت نام</Link>
                </p>
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
        padding: "20px"
    },
    card: {
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
    },
    title: {
        textAlign: "center",
        marginBottom: "30px",
        color: "#333",
        fontSize: "28px"
    },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        fontSize: "16px",
        boxSizing: "border-box",
        transition: "border-color 0.3s"
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "10px",
        transition: "background-color 0.3s"
    },
    error: {
        backgroundColor: "#f8d7da",
        color: "#721c24",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "20px",
        textAlign: "center",
        fontSize: "14px"
    },
    footer: {
        textAlign: "center",
        marginTop: "20px",
        color: "#666",
        fontSize: "14px"
    },
    link: {
        color: "#007bff",
        textDecoration: "none",
        fontWeight: "bold"
    }
};