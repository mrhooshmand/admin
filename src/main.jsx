import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AuthProvider} from './context/AuthContext.jsx'
import {LoadingProvider} from "./context/LoadingContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <LoadingProvider>
                <App/>
            </LoadingProvider>
        </AuthProvider>
    </StrictMode>,
)
