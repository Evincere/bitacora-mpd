/**
 * @file apiClient.ts
 * @description Cliente HTTP con interceptores para manejo de tokens y errores
 */

import tokenService from '@/core/utils/tokenService';
import errorHandlingService, { ApiError } from '@/core/utils/errorHandlingService';

// URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Interfaz para opciones de petición
interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

// Variable para controlar si hay una renovación de token en curso
let isRefreshing = false;
// Cola de peticiones pendientes durante la renovación del token
let refreshQueue: Array<() => void> = [];

/**
 * Procesa una petición pendiente después de renovar el token
 */
const processQueue = (error: Error | null) => {
  refreshQueue.forEach(callback => callback());
  refreshQueue = [];
};

/**
 * Renueva el token de acceso usando el token de refresco
 * @returns Promesa que se resuelve con el nuevo token
 */
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = tokenService.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No hay token de refresco disponible');
    }

    console.log('Renovando token en:', `${API_BASE_URL}/auth/refresh`);
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      throw new Error('Error al renovar el token');
    }

    const data = await response.json();

    // Guardar los nuevos tokens
    tokenService.setToken(data.token);
    if (data.refreshToken) {
      tokenService.setRefreshToken(data.refreshToken);
    }

    return data.token;
  } catch (error) {
    console.error('Error al renovar el token:', error);
    // Limpiar tokens y redirigir al login
    tokenService.clearTokens();
    window.location.href = '/login';
    return null;
  }
};

/**
 * Realiza una petición HTTP con manejo automático de tokens y errores
 * @param url URL de la petición
 * @param options Opciones de la petición
 * @returns Promesa con la respuesta
 */
export const apiRequest = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  // Configuración por defecto
  const defaultOptions: RequestOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Combinar opciones
  const requestOptions: RequestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  // Añadir token de autenticación si es necesario
  if (!requestOptions.skipAuth) {
    const token = tokenService.getToken();

    if (token) {
      console.log('apiClient.ts: Añadiendo token a la petición:', token.substring(0, 20) + '...');
      requestOptions.headers = {
        ...requestOptions.headers,
        'Authorization': `Bearer ${token}`
      };
    } else {
      console.warn('apiClient.ts: No se encontró token para la petición');
    }
  }

  // Realizar la petición
  try {
    // Asegurarse de que la URL tenga el formato correcto
    const apiUrl = url.startsWith('http')
      ? url
      : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;

    console.log('Realizando petición a:', apiUrl);
    let response = await fetch(apiUrl, requestOptions);

    // Si la respuesta es 401 (Unauthorized) y no estamos saltando la renovación de token
    if (response.status === 401 && !requestOptions.skipRefresh) {
      // Si el token ha expirado, intentar renovarlo
      if (tokenService.isTokenExpired(tokenService.getToken() || '')) {
        let newToken: string | null = null;

        // Si ya hay una renovación en curso, esperar a que termine
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshQueue.push(() => {
              // Reintentar la petición con el nuevo token
              apiRequest<T>(url, {
                ...requestOptions,
                skipRefresh: true // Evitar bucle infinito
              })
                .then(resolve)
                .catch(reject);
            });
          });
        }

        // Iniciar proceso de renovación
        isRefreshing = true;

        try {
          newToken = await refreshAccessToken();
          isRefreshing = false;
          processQueue(null);
        } catch (error) {
          isRefreshing = false;
          processQueue(error as Error);
          throw error;
        }

        // Si se obtuvo un nuevo token, reintentar la petición
        if (newToken) {
          requestOptions.headers = {
            ...requestOptions.headers,
            'Authorization': `Bearer ${newToken}`
          };

          // Asegurarse de que la URL tenga el formato correcto
          const apiUrl = url.startsWith('http')
            ? url
            : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;

          console.log('Reintentando petición a:', apiUrl);
          response = await fetch(apiUrl, requestOptions);
        }
      }
    }

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      // Obtener detalles del error
      const errorData = await response.json().catch(() => ({}));

      // Crear objeto de error con detalles
      const apiError: ApiError = {
        status: response.status,
        message: errorData.message || `Error en petición: ${response.status} ${response.statusText}`,
        error: errorData.error,
        path: errorData.path || url,
        timestamp: errorData.timestamp
      };

      // Procesar el error
      throw errorHandlingService.processApiError(apiError);
    }

    // Si la respuesta es exitosa pero no tiene contenido
    if (response.status === 204) {
      return {} as T;
    }

    // Parsear la respuesta como JSON
    return await response.json();
  } catch (error) {
    // Si es un error ya procesado, relanzarlo
    if ((error as ApiError).type) {
      throw error;
    }

    // Procesar otros errores
    throw errorHandlingService.processApiError(error);
  }
};

// Exportar cliente HTTP
const apiClient = {
  get: <T>(url: string, options?: RequestOptions) => apiRequest<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, data?: any, options?: RequestOptions) => apiRequest<T>(url, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: <T>(url: string, data?: any, options?: RequestOptions) => apiRequest<T>(url, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  patch: <T>(url: string, data?: any, options?: RequestOptions) => apiRequest<T>(url, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(url: string, options?: RequestOptions) => apiRequest<T>(url, { ...options, method: 'DELETE' })
};

export default apiClient;
