import {createContext, useContext, useState, useEffect} from "react";

const AuthContext = createContext();

export function AuthProvider({children}) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );
    const [user, setUser] = useState(() => {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
    );
    useEffect(() => {
        const checkToken = () => {
            setToken(localStorage.getItem("token"));
            const storedUser = localStorage.getItem("user");
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };
        window.addEventListener(
            "storage",
            checkToken
        );
        return () => {
            window.removeEventListener(
                "storage",
                checkToken
            );
        };
    }, []);

    const login = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
    };


    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    return useContext(AuthContext);
}