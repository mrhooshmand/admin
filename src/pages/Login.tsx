import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {loginRequest} from "../api/authApi";
import {ROUTES} from "../constants/routes";
import {useLoading} from "../context/LoadingContext.jsx";
import {showAlert} from "../utils/errorHandler";

export default function Login() {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {isLoading} = useLoading();
    const loginEvent = async () => {
        if (!username.trim() || !password.trim()) {
            showAlert("error", "Please fill username and password");
            return;
        }


        try {
            const response = await loginRequest({
                username,
                password
            });
            login(response.data);
            navigate(ROUTES.DASHBOARD);
        } catch (error) {
            showAlert('error',error);
        }
    };
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Sign in to your account</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                    disabled={isLoading}
                    onKeyPress={(e) => e.key === "Enter" && loginEvent()}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    disabled={isLoading}
                    onKeyPress={(e) => e.key === "Enter" && loginEvent()}
                />

                <button
                    onClick={loginEvent}
                    disabled={isLoading}
                    style={styles.button}
                >
                    {isLoading ? "Logging in ..." : "Login"}
                </button>

                <p style={styles.footer}>
                    Dont have Account? <Link to={ROUTES.REGISTER} style={styles.link}>Sign up</Link>
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
        boxSizing: "border-box"
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
        marginTop: "10px"
    },
    error: {
        backgroundColor: "#f8d7da",
        color: "#721c24",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "20px",
        textAlign: "center"
    },
    footer: {
        textAlign: "center",
        marginTop: "20px",
        color: "#666"
    },
    link: {
        color: "#007bff",
        textDecoration: "none"
    }
};