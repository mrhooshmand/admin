import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from '@/app/providers/AuthProvider'
import { LoadingProvider } from '@/app/providers/LoadingProvider'
import { LocaleProvider, useLocale } from '@/app/providers/LocaleProvider'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { Toaster } from 'sonner'
import { BrowserRouter } from 'react-router-dom'

function AppToaster() {
    const { dir } = useLocale()
    return (
        <Toaster
            dir={dir}
            position="top-center"
            richColors
            closeButton
            toastOptions={{
                style: {
                    fontSize: "14px",
                    padding: "12px 16px",
                },
            }}
        />
    )
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <LocaleProvider>
                <ThemeProvider>
                    <QueryProvider>
                        <LoadingProvider>
                            <AuthProvider>
                                <AppToaster />
                                <App />
                            </AuthProvider>
                        </LoadingProvider>
                    </QueryProvider>
                </ThemeProvider>
            </LocaleProvider>
        </BrowserRouter>
    </StrictMode >,
)
