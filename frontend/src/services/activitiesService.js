import api, { apiRequest } from "../utils/api";
import config from "../config";

/**
 * Servicio para gestionar las actividades
 */
const activitiesService = {
  /**
   * Obtiene una lista paginada de actividades
   * @param {Object} params - Parámetros de paginación y filtrado
   * @returns {Promise<Object>} - Respuesta con las actividades y metadatos de paginación
   */
  getActivities: async (params = {}) => {
    const defaultParams = {
      page: 0,
      size: config.pagination.defaultPageSize,
      sort: "createdAt,desc",
    };

    const queryParams = { ...defaultParams, ...params };

    // Validar que los parámetros sean válidos
    const validatedParams = {
      ...queryParams,
      // Asegurar que page nunca sea negativo
      page: Math.max(0, queryParams.page || 0),
      // Asegurar que size esté entre 1 y 100
      size: Math.min(Math.max(1, queryParams.size || 10), 100),
    };

    console.log("Enviando parámetros validados a la API:", validatedParams);

    try {
      return await apiRequest({
        method: "GET",
        url: "/api/activities",
        params: validatedParams,
      });
    } catch (error) {
      console.error("Error al obtener actividades:", error);
      throw error;
    }
  },

  /**
   * Obtiene una actividad por su ID
   * @param {number} id - ID de la actividad
   * @returns {Promise<Object>} - Datos de la actividad
   */
  getActivityById: async (id) => {
    try {
      return await apiRequest({
        method: "GET",
        url: `/api/activities/${id}`,
      });
    } catch (error) {
      console.error(`Error al obtener actividad con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva actividad
   * @param {Object} activityData - Datos de la actividad a crear
   * @returns {Promise<Object>} - Actividad creada
   */
  createActivity: async (activityData) => {
    try {
      return await apiRequest({
        method: "POST",
        url: "/api/activities",
        data: activityData,
      });
    } catch (error) {
      console.error("Error al crear actividad:", error);
      throw error;
    }
  },

  /**
   * Actualiza una actividad existente
   * @param {number} id - ID de la actividad
   * @param {Object} activityData - Datos actualizados de la actividad
   * @returns {Promise<Object>} - Actividad actualizada
   */
  updateActivity: async (id, activityData) => {
    try {
      return await apiRequest({
        method: "PUT",
        url: `/api/activities/${id}`,
        data: activityData,
      });
    } catch (error) {
      console.error(`Error al actualizar actividad con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una actividad
   * @param {number} id - ID de la actividad a eliminar
   * @returns {Promise<void>}
   */
  deleteActivity: async (id) => {
    try {
      return await apiRequest({
        method: "DELETE",
        url: `/api/activities/${id}`,
      });
    } catch (error) {
      console.error(`Error al eliminar actividad con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cambia el estado de una actividad
   * @param {number} id - ID de la actividad
   * @param {string} newStatus - Nuevo estado
   * @returns {Promise<Object>} - Actividad actualizada
   */
  changeActivityStatus: async (id, newStatus) => {
    try {
      return await apiRequest({
        method: "PATCH",
        url: `/api/activities/${id}/status`,
        data: { status: newStatus },
      });
    } catch (error) {
      console.error(
        `Error al cambiar estado de actividad con ID ${id}:`,
        error
      );
      throw error;
    }
  },
};

export default activitiesService;
