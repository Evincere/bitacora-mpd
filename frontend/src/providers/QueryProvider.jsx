import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Crear un cliente de React Query con configuración global
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configuración global para todas las consultas
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10,   // 10 minutos
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
      // Desactivar refetch automático
      refetchInterval: false,
    },
  },
});

// Configuración simplificada sin fallbacks específicos
// React Query ya maneja el caching y deduplicación de peticiones

/**
 * Proveedor de React Query para la aplicación
 */
export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
};

export default QueryProvider;
