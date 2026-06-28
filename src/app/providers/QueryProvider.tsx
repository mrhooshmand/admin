import { showAlert } from '@/shared/utils/errorHandler';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError(error) {
            showAlert("error", error);
            console.log("queryCache error:", error);
        }
    }),

    mutationCache: new MutationCache({
        onError(error) {
            showAlert("error", error);
            console.log("mutationCache error:", error);
        }
    }),

    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 دقیقه
            retry: 1,
            refetchOnWindowFocus: false,
        }
    },
})

interface QueryProviderProps {
    children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}