import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App'
import {AuthProvider} from '@/app/providers/AuthProvider'
import {LoadingProvider} from '@/app/providers/LoadingProvider'
import {Toaster} from 'sonner'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LoadingProvider>
            <AuthProvider>
                <Toaster
                    position="top-center"
                    richColors
                    closeButton
                    toastOptions={{
                        style: {
                            fontSize: "14px",
                            padding: "12px 16px",
                        },
                    }}/>
                <App/>
            </AuthProvider>
        </LoadingProvider>
    </StrictMode>,
)
