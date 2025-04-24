import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Crear una instancia de QueryClient con configuración personalizada
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
    },
    mutations: {
      // Las opciones de mutaciones no tienen cambios
    }
  }
});

// Configurar manejadores de errores globales a nivel de QueryClient
queryClient.setDefaultOptions({
  queries: {
    queryFn: async ({ queryKey }) => {
      // Esta función solo se usará si no se proporciona queryFn en la consulta
      throw new Error(`No se proporcionó queryFn para la consulta con clave: ${queryKey}`);
    }
  },
  mutations: {
    // Las opciones de mutaciones no tienen cambios
  }
});

// Configurar manejadores de errores globales a nivel de caché
const mutationCache = queryClient.getMutationCache();
const queryCache = queryClient.getQueryCache();

// Crear instancias de caché con manejadores de errores
mutationCache.config = {
  onError: (error: unknown) => {
    const message = (error as any)?.response?.data?.message || (error as Error)?.message || 'Error al procesar la solicitud';
    toast.error(`Error: ${message}`);
  }
};

queryCache.config = {
  onError: (error: unknown) => {
    const message = (error as any)?.response?.data?.message || (error as Error)?.message || 'Error al cargar datos';
    toast.error(`Error: ${message}`);
  }
};
