import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { useLoading } from "@/app/providers/LoadingProvider";
import { showAlert } from "@/shared/utils/errorHandler";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { isLoading } = useLoading();
    const loginMutation = useLogin();

    const loginEvent = () => {
        loginMutation.mutate(
            {
                username,
                password
            },
            {
                onSuccess: () => {
                    showAlert("success", "Welcome back!");
                    navigate(ROUTES.DASHBOARD);
                },

                onError: (error) => {
                    showAlert("error", error);
                }
            }
        );
    };
    return (
        <>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                style={styles.input}
                disabled={isLoading}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    e.key === "Enter" && loginEvent()
                }
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                style={styles.input}
                disabled={isLoading}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    e.key === "Enter" && loginEvent()
                }
            />

            <button
                onClick={loginEvent}
                disabled={isLoading}
                style={styles.button}
            >
                {isLoading ? "Logging in ..." : "Login"}
            </button>

            <p style={styles.footer}>
                Don't have Account? <Link to={ROUTES.REGISTER} style={styles.link}>Sign up</Link>
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
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "10px",
    },
    footer: {
        textAlign: "center",
        marginTop: "20px",
        color: "#666",
    },
    link: {
        color: "#007bff",
        textDecoration: "none",
    },
};