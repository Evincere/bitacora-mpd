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
          request.headers.set('Authorization', `Bearer ${token}`);
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
