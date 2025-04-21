import ky from 'ky';
import { ApiError } from '@/types/api';

// Obtener la URL base de la API desde las variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Verificar si estamos en desarrollo o producción
const isDevelopment = import.meta.env.DEV;

// Mostrar información de configuración
console.log(`API configurada con base URL: ${API_BASE_URL || '(proxy local)'} en modo ${isDevelopment ? 'desarrollo' : 'producción'}`);

// Crear instancia de ky con configuración base
const api = ky.extend({
  prefixUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      request => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user && user.token) {
          request.headers.set('Authorization', `${user.tokenType || 'Bearer'} ${user.token}`);
        }
      }
    ],
    afterResponse: [
      async (_request, _options, response) => {
        // Manejar 401 Unauthorized
        if (response.status === 401) {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    ]
  },
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504]
  },
  timeout: 30000
});

// Función genérica para realizar peticiones
export const apiRequest = async <T>(
  endpoint: string,
  options?: any
): Promise<T> => {
  try {
    // Construir la URL completa para mostrar en logs
    const fullUrl = API_BASE_URL ? `${API_BASE_URL}/${endpoint}` : `/${endpoint}`;
    console.log(`Realizando petición a: ${fullUrl}`);
    console.log(`Nota: Si hay problemas, verifica que la ruta '${endpoint}' exista en el backend`);

    // Intentar realizar la petición
    return await api(endpoint, options).json<T>();
  } catch (error) {
    const kyError = error as Error;
    console.error('Error en petición API:', kyError);

    // Construir objeto de error estandarizado
    const apiError: ApiError = {
      status: 500,
      error: 'Error desconocido',
      message: kyError.message || 'Error en la petición',
      path: endpoint,
      details: []
    };

    // Si es un error de respuesta, extraer más información
    if (kyError.name === 'HTTPError') {
      try {
        const response = await (error as any).response.json();
        apiError.status = (error as any).response.status;
        apiError.error = response.error || apiError.error;
        apiError.message = response.message || apiError.message;
        apiError.details = response.details || [];

        // Personalizar mensajes de error según el código de estado
        if (apiError.status === 404) {
          if (endpoint.includes('activities')) {
            apiError.message = 'No se encontraron actividades. El recurso solicitado no existe o no hay actividades disponibles.';
          } else {
            apiError.message = 'No se encontraron datos. El recurso solicitado no existe.';
          }
        } else if (apiError.status === 500) {
          if (endpoint.includes('activities')) {
            apiError.message = 'Error interno del servidor al procesar actividades. Por favor, intenta nuevamente más tarde.';
          } else {
            apiError.message = 'Error interno del servidor. Por favor, intenta nuevamente más tarde.';
          }
        } else if (apiError.status === 403) {
          apiError.message = 'No tienes permisos para acceder a este recurso.';
        } else if (apiError.status === 401) {
          apiError.message = 'Sesión expirada o no válida. Por favor, inicia sesión nuevamente.';
        }
      } catch (jsonParseError) {
        // Si no se puede parsear la respuesta como JSON
        apiError.status = (error as any).response?.status || 500;
        apiError.error = 'Error al procesar la respuesta';
        apiError.message = `No se pudo procesar la respuesta del servidor: ${(jsonParseError as Error).message}`;
      }
    } else if (kyError.name === 'TimeoutError') {
      apiError.message = 'La solicitud ha excedido el tiempo de espera. Por favor, intenta nuevamente.';
    } else if (kyError.message?.includes('Failed to fetch') || kyError.message?.includes('Network Error')) {
      apiError.message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet y que el servidor esté en funcionamiento.';
    }

    // Mostrar información detallada del error en la consola
    console.error(`Error API (${apiError.status}):`, apiError.message);
    console.error('Detalles:', apiError);

    throw apiError;
  }
};

export default api;
