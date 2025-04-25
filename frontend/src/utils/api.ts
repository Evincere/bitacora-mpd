import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '@/types';

// Obtener la URL base de la API desde las variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    // Intentar obtener el token directamente
    const token = localStorage.getItem('bitacora_token');
    if (token) {
      console.log('api.ts: Añadiendo token a la petición:', token.substring(0, 10) + '...');
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    // Si no hay token directo, intentar obtenerlo del objeto usuario
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.token) {
      console.log('api.ts: Usando token del objeto usuario:', user.token.substring(0, 10) + '...');
      config.headers.Authorization = `${user.tokenType || 'Bearer'} ${user.token}`;
    } else {
      console.warn('api.ts: No se encontró token para la petición');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Si el error es 401 (Unauthorized), limpiar localStorage y redirigir a login
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Función genérica para realizar peticiones
export const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api(config);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw {
      status: axiosError.response?.status || 500,
      error: axiosError.response?.data?.error || 'Error desconocido',
      message: axiosError.response?.data?.message || axiosError.message || 'Error en la petición',
      path: axiosError.response?.data?.path || config.url || '',
      details: axiosError.response?.data?.details || [],
    } as ApiError;
  }
};

export default api;
