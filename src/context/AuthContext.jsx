import {createContext, useContext, useState, useEffect} from "react";

const AuthContext = createContext();

export function AuthProvider({children}) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );
    const [user, setUser] = useState(
        localStorage.getItem("user")
    );
    useEffect(() => {
        const checkToken = () => {
            setToken(localStorage.getItem("token"));
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