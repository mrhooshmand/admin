import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Register() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        full_name: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username.trim()) {
            setError("نام کاربری الزامی است");
            return;
        }

        if (formData.password.length < 4) {
            setError("رمز عبور باید حداقل 4 کاراکتر باشد");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("رمز عبور و تکرار آن مطابقت ندارد");
            return;
        }

        if (formData.email && !formData.email.includes('@')) {
            setError("ایمیل معتبر نیست");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await api.post("/register", {
                username: formData.username.trim(),
                password: formData.password,
                email: formData.email.trim(),
                full_name: formData.full_name.trim()
            });

            login(response.data);
            navigate("/dashboard");
        } catch (err) {
            console.error("Registration error:", err);
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError("خطا در ثبت نام. لطفاً دوباره تلاش کنید.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Sign up </h2>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="User name"
                        value={formData.username}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <input
                        type="text"
                        name="full_name"
                        placeholder="Full name"
                        value={formData.full_name}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Password confirm"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Signing in ..." : "Sign in"}
                    </button>
                </form>

                <p style={styles.footer}>
                    Have an account? <Link to="/login" style={styles.link}>Sign in</Link>
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
        backgroundColor: "#4CAF50",
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