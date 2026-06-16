import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AuthProvider} from './context/AuthContext.jsx'
import {LoadingProvider} from "./context/LoadingContext.jsx";
import {Toaster} from 'sonner';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <LoadingProvider>
                <Toaster position="top-center" richColors closeButton toastOptions={{
                    style: {
                        fontSize: "14px",
                        padding: "12px 16px",
                    },
                }}/>
                <App/>
            </LoadingProvider>
        </AuthProvider>
    </StrictMode>,
)
