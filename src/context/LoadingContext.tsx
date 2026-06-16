import { createContext, useContext, useState, useCallback } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const showLoading = useCallback((loadingMessage = "Please Wait ...") => {
        setMessage(loadingMessage);
        setIsLoading(true);
    }, []);

    const hideLoading = useCallback(() => {
        setIsLoading(false);
        setMessage("");
    }, []);

    return (
        <LoadingContext.Provider value={{ isLoading, message, showLoading, hideLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within LoadingProvider");
    }
    return context;
}