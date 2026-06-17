import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {showAlert} from "../utils/errorHandler";
import {useLoading} from "../context/LoadingContext";
import {ROUTES} from "../constants/routes";
import api from "../api/axios";

interface FormData {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    full_name: string;
}

export default function Register() {
    const {login} = useAuth();
    const navigate = useNavigate();
    const {showLoading, hideLoading} = useLoading();

    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        full_name: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.username.trim()) {
            showAlert("error", "Username is required");
            return;
        }

        if (formData.password.length < 4) {
            showAlert("error", "Password must be at least 4 characters");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showAlert("error", "Passwords do not match");
            return;
        }

        if (formData.email && !formData.email.includes('@')) {
            showAlert("error", "Invalid email address");
            return;
        }

        showLoading("Creating account...");

        try {
            const response = await api.post("/register", {
                username: formData.username.trim(),
                password: formData.password,
                email: formData.email.trim(),
                full_name: formData.full_name.trim()
            });

            login(response.data);
            showAlert("success", "Account created successfully! 🎉");
            navigate(ROUTES.DASHBOARD);
        } catch (err: any) {
            console.error("Registration error:", err);
            const errorMsg = err.response?.data?.error || "Registration failed. Please try again.";
            showAlert("error", errorMsg);
        } finally {
            hideLoading();
        }
    };

    return (
        <>
            {formData.error && (
                <div style={styles.error}>{formData.error}</div>
            )}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username *"
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
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                    style={styles.input}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password *"
                    value={formData.password}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password *"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />

                <button type="submit" style={styles.button}>
                    Sign up
                </button>
            </form>

            <p style={styles.footer}>
                Already have an account? <Link to={ROUTES.LOGIN} style={styles.link}>Sign in</Link>
            </p>
        </>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        fontSize: "16px",
        boxSizing: "border-box",
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
    },
    error: {
        backgroundColor: "#f8d7da",
        color: "#721c24",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "20px",
        textAlign: "center",
        fontSize: "14px",
    },
    footer: {
        textAlign: "center",
        marginTop: "20px",
        color: "#666",
        fontSize: "14px",
    },
    link: {
        color: "#007bff",
        textDecoration: "none",
        fontWeight: "bold",
    },
};