import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginRequest } from "../api/authApi";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginEvent = async () => {
        try {
            const response = await loginRequest({
                username,
                password
            });
            login(response.data);
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed:", error);
            alert(error);
        }
    };

    return (
        <div style={{ padding: 50 }}>
            <h2>Login Page</h2>
            <input
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br/><br/>
            <input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br/><br/>
            <button onClick={loginEvent}>Login</button>
        </div>
    );
}