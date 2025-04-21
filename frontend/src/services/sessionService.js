import { apiRequest } from '@/utils/api-ky';

const API_URL = 'api/sessions';

/**
 * Servicio para gestionar las sesiones de usuario
 */
const sessionService = {
  /**
   * Obtiene todas las sesiones activas del usuario
   * @returns {Promise<Array>} - Lista de sesiones activas
   */
  getActiveSessions: async () => {
    try {
      return await apiRequest({
        method: 'GET',
        url: `${API_URL}/active`,
      });
    } catch (error) {
      console.error('Error al obtener sesiones activas:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las sesiones del usuario (activas e inactivas)
   * @returns {Promise<Array>} - Lista de todas las sesiones
   */
  getAllSessions: async () => {
    try {
      return await apiRequest({
        method: 'GET',
        url: `${API_URL}/all`,
      });
    } catch (error) {
      console.error('Error al obtener todas las sesiones:', error);
      throw error;
    }
  },

  /**
   * Cierra una sesión específica
   * @param {number} sessionId - ID de la sesión a cerrar
   * @returns {Promise<Object>} - Respuesta del servidor
   */
  closeSession: async (sessionId) => {
    try {
      return await apiRequest({
        method: 'DELETE',
        url: `${API_URL}/${sessionId}`,
      });
    } catch (error) {
      console.error(`Error al cerrar la sesión ${sessionId}:`, error);
      throw error;
    }
  },

  /**
   * Cierra todas las sesiones excepto la actual
   * @param {string} token - Token JWT de la sesión actual
   * @returns {Promise<Object>} - Respuesta del servidor
   */
  closeOtherSessions: async (token) => {
    try {
      return await apiRequest({
        method: 'POST',
        url: `${API_URL}/close-others`,
        data: token,
      });
    } catch (error) {
      console.error('Error al cerrar otras sesiones:', error);
      throw error;
    }
  },
};

export default sessionService;
