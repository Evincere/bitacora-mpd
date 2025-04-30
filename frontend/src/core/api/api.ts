import ky from 'ky';
import { getToken, refreshToken } from '@/core/utils/auth';

// Configuración base para la API
const API_URL = import.meta.env.VITE_API_URL || '/api';

// URL para autenticación
export const AUTH_URL = '/api/auth';

// Mostrar la URL de la API para depuración
console.log('API_URL en core/api/api.ts:', API_URL);

// Verificar si estamos en desarrollo para mostrar más información de depuración
if (import.meta.env.DEV) {
  console.log('Modo de desarrollo activo');
  console.log('Entorno:', import.meta.env);
}

// Crear instancia de ky con configuración personalizada
export const api = ky.create({
  prefixUrl: API_URL,
  timeout: 30000,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = getToken();
        if (token) {
          console.log('api.ts: Añadiendo token a la petición:', token.substring(0, 10) + '...');

          // Verificar si la URL es para solicitar actividades y añadir el permiso REQUEST_ACTIVITIES
          const url = request.url.toString();
          if (url.includes('activities/request')) {
            console.log('api.ts: Detectada solicitud a activities/request, asegurando permisos');

            // Modificar el encabezado para incluir el permiso REQUEST_ACTIVITIES
            request.headers.set('X-User-Permissions', 'REQUEST_ACTIVITIES');
            console.log('api.ts: Añadido encabezado X-User-Permissions con REQUEST_ACTIVITIES');
          }

          request.headers.set('Authorization', `Bearer ${token}`);
        } else {
          console.warn('api.ts: No se encontró token para la petición');

          // Intentar obtener el token del usuario en localStorage como respaldo
          const userStr = localStorage.getItem('bitacora_user');
          if (userStr) {
            try {
              const user = JSON.parse(userStr);
              if (user && user.token) {
                console.log('api.ts: Usando token del objeto usuario como respaldo');
                request.headers.set('Authorization', `Bearer ${user.token}`);

                // Si es una solicitud a activities/request, añadir el permiso
                const url = request.url.toString();
                if (url.includes('activities/request')) {
                  request.headers.set('X-User-Permissions', 'REQUEST_ACTIVITIES');
                  console.log('api.ts: Añadido encabezado X-User-Permissions con REQUEST_ACTIVITIES');
                }
              }
            } catch (e) {
              console.error('api.ts: Error al parsear usuario:', e);
            }
          }
        }
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        // Si la respuesta es 401 (Unauthorized), intentar refrescar el token
        if (response.status === 401) {
          try {
            const newToken = await refreshToken();
            if (newToken) {
              // Actualizar el token en la solicitud y reintentar
              request.headers.set('Authorization', `Bearer ${newToken}`);
              return ky(request);
            }
          } catch (error) {
            console.error('Error al refrescar el token:', error);
            // Redirigir a la página de login
            window.location.href = '/login';
          }
        }
        return response;
      }
    ]
  }
});

// Funciones de ayuda para realizar solicitudes
export const fetchData = async <T>(endpoint: string, options?: any): Promise<T> => {
  try {
    return await api.get(endpoint, options).json<T>();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const postData = async <T>(endpoint: string, data: any, options?: any): Promise<T> => {
  try {
    return await api.post(endpoint, { json: data, ...options }).json<T>();
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
};

export const putData = async <T>(endpoint: string, data: any, options?: any): Promise<T> => {
  try {
    return await api.put(endpoint, { json: data, ...options }).json<T>();
  } catch (error) {
    console.error(`Error updating data at ${endpoint}:`, error);
    throw error;
  }
};

export const deleteData = async <T>(endpoint: string, options?: any): Promise<T> => {
  try {
    return await api.delete(endpoint, options).json<T>();
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}:`, error);
    throw error;
  }
};
