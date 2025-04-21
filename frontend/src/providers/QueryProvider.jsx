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

// Contador para evitar múltiples peticiones idénticas
const requestCache = new Map();

// Contador de peticiones por URL
const requestCounts = new Map();

// Tiempo mínimo entre peticiones idénticas (en ms)
const MIN_REQUEST_INTERVAL = 5000; // 5 segundos

// Última vez que se realizó cada petición
const lastRequestTimes = new Map();

// Interceptor para evitar peticiones duplicadas y limitar la frecuencia
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0];
  const method = args[1]?.method || 'GET';

  // Crear una clave única para esta petición
  const cacheKey = `${method}:${url}`;

  // Incrementar el contador de peticiones para esta URL
  const currentCount = requestCounts.get(cacheKey) || 0;
  requestCounts.set(cacheKey, currentCount + 1);

  // Obtener la última vez que se realizó esta petición
  const lastRequestTime = lastRequestTimes.get(cacheKey) || 0;
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  // Si es una petición GET y ya está en curso, devolver la promesa existente
  if (method === 'GET' && requestCache.has(cacheKey)) {
    console.log(`Petición duplicada evitada: ${cacheKey}`);
    return requestCache.get(cacheKey);
  }

  // Si es una petición GET y se ha realizado recientemente, limitar la frecuencia
  if (method === 'GET' && timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    console.log(`Petición limitada por frecuencia: ${cacheKey} (última hace ${timeSinceLastRequest}ms)`);

    // Si hay una promesa en caché, devolverla
    if (requestCache.has(cacheKey)) {
      return requestCache.get(cacheKey);
    }

    // Si no hay promesa en caché pero la petición es a /activities, crear una respuesta simulada
    if (url.includes('/activities')) {
      console.log(`Creando respuesta simulada para: ${cacheKey}`);

      // Obtener datos de localStorage si existen
      const cachedData = localStorage.getItem('activities-cache');
      if (cachedData) {
        console.log('Usando datos en caché de localStorage');
        const data = JSON.parse(cachedData);
        return Promise.resolve(new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
    }
  }

  // Actualizar la última vez que se realizó esta petición
  lastRequestTimes.set(cacheKey, now);

  // Realizar la petición
  const fetchPromise = originalFetch.apply(this, args);

  // Si es una petición GET, almacenarla en la caché
  if (method === 'GET') {
    requestCache.set(cacheKey, fetchPromise);

    // Si es una petición a /activities, guardar la respuesta en localStorage
    if (url.includes('/activities')) {
      fetchPromise.then(response => {
        // Clonar la respuesta para no consumirla
        const clonedResponse = response.clone();

        // Convertir la respuesta a JSON y guardarla en localStorage
        clonedResponse.json().then(data => {
          localStorage.setItem('activities-cache', JSON.stringify(data));
          console.log('Datos de actividades guardados en localStorage');
        }).catch(error => {
          console.error('Error al guardar datos en localStorage:', error);
        });
      }).catch(error => {
        console.error('Error en la petición:', error);
      });
    }

    // Eliminar de la caché cuando se complete
    fetchPromise.finally(() => {
      setTimeout(() => {
        requestCache.delete(cacheKey);
      }, MIN_REQUEST_INTERVAL); // Esperar antes de permitir la misma petición de nuevo
    });
  }

  return fetchPromise;
};

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
