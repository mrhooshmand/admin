import {createContext, useContext, useState, useCallback, ReactNode} from "react";

interface LoadingContextType {
    isLoading: boolean;
    message: string;
    showLoading: (loadingMessage?: string) => void;
    hideLoading: () => void;
}

interface LoadingProviderProps {
    children: ReactNode;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({children}: LoadingProviderProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const showLoading = useCallback((loadingMessage: string = "Please Wait ...") => {
        setMessage(loadingMessage);
        setIsLoading(true);
    }, []);

    const hideLoading = useCallback(() => {
        setIsLoading(false);
        setMessage("");
    }, []);

    return (
        <LoadingContext.Provider value={{isLoading, message, showLoading, hideLoading}}>
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