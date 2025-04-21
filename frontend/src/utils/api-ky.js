import ky from 'ky';
import config from '../config';

/**
 * Cliente HTTP basado en ky para realizar peticiones a la API
 */
const api = ky.create({
  prefixUrl: '',
  timeout: 30000,
  hooks: {
    beforeRequest: [
      request => {
        const token = localStorage.getItem(config.auth.tokenKey);
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem(config.auth.tokenKey);
          localStorage.removeItem(config.auth.userKey);
          window.location.href = '/login';
        }
        return response;
      }
    ]
  }
});

/**
 * Realiza una petición a la API
 * @param {Object} options - Opciones de la petición
 * @param {string} options.method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {string} options.url - URL de la petición
 * @param {Object} options.data - Datos a enviar en la petición
 * @param {Object} options.params - Parámetros de la URL
 * @returns {Promise<any>} - Respuesta de la API
 */
export const apiRequest = async ({ method = 'GET', url, data, params }) => {
  try {
    const options = {
      method,
      json: data,
      searchParams: params
    };

    const response = await api(url, options);
    return await response.json();
  } catch (error) {
    console.error('Error en la petición API:', error);
    
    // Manejar errores específicos
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401) {
        // Ya manejado en afterResponse
        throw new Error('Sesión expirada');
      }
      
      try {
        const errorData = await error.response.json();
        throw new Error(errorData.message || 'Error en la petición');
      } catch (e) {
        throw new Error(`Error ${status}: ${error.response.statusText}`);
      }
    }
    
    throw error;
  }
};

export default api;
