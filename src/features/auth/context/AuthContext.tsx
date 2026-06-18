import {createContext, useContext, useState, useEffect, ReactNode} from "react";
import {TOKEN_KEY, USER_KEY} from "../constants/api";
import {User, LoginResponse} from "../types";

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (data: LoginResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem(USER_KEY);
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = (): void => {
            const storedToken = localStorage.getItem(TOKEN_KEY);
            const storedUser = localStorage.getItem(USER_KEY);

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };

        checkAuth();

        const handleStorageChange = (e: StorageEvent): void => {
            if (e.key === TOKEN_KEY) {
                setToken(e.newValue);
                if (!e.newValue) {
                    setUser(null);
                }
            }
            if (e.key === USER_KEY) {
                setUser(e.newValue ? JSON.parse(e.newValue) : null);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const login = (data: LoginResponse): void => {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
    };

    const logout = (): void => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
    };

    const value: AuthContextType = {
                user,
                token,
                login,
                logout,
                isAuthenticated: !!token,
                loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}