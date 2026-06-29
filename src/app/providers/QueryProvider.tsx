import { showAlert } from '@/shared/utils/errorHandler';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError(error, query) {
            if (query.meta?.skipGlobalError) return
            showAlert("error", error);
            console.log("queryCache error:", error);
        }
    }),

    mutationCache: new MutationCache({
        onError(error, variables, context, mutation) {
            if (mutation.meta?.skipGlobalError) return
            showAlert("error", error);
            console.log("mutationCache error:", error);
        }
    }),

    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 دقیقه
            retry: 1,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: false,
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