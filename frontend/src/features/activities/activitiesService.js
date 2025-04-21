import {
  getActivities as getMockActivities,
  getActivityById as getMockActivityById,
  createActivity as createMockActivity,
  updateActivity as updateMockActivity,
  deleteActivity as deleteMockActivity,
} from "./mockData";
import api, { apiRequest } from "../../utils/api";

// Simulación de delay para emular llamadas a API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Obtener actividades con filtros y paginación
const getActivities = async (params) => {
  try {
    // Intentar obtener datos reales de la API
    const { page = 0, size = 10, ...filters } = params || {};

    // Validar parámetros para evitar errores 500
    const validatedParams = {
      // Asegurar que page nunca sea negativo
      page: Math.max(0, page),
      // Asegurar que size esté entre 1 y 100
      size: Math.min(Math.max(1, size), 100),
      sort: filters.sort || "createdAt,desc",
      ...filters,
    };

    console.log("Enviando parámetros validados a la API:", validatedParams);

    const response = await apiRequest({
      method: "GET",
      url: "/api/activities",
      params: validatedParams,
    });

    // Transformar respuesta de Spring Data a formato esperado por el frontend
    if (response.activities && response.totalCount !== undefined) {
      // Ya está en el formato esperado
      return response;
    } else if (response.content && response.totalElements !== undefined) {
      // Formato de Spring Data
      return {
        activities: response.content || [],
        totalCount: response.totalElements || 0,
      };
    } else {
      // Otro formato, intentar adaptarlo
      return {
        activities: Array.isArray(response) ? response : [],
        totalCount: Array.isArray(response) ? response.length : 0,
      };
    }
  } catch (error) {
    console.warn(
      "Error al obtener actividades de la API, usando datos de prueba:",
      error
    );

    // Fallback a datos de prueba
    const { page = 1, limit = 10, ...filters } = params || {};
    return getMockActivities(page, limit, filters);
  }
};

// Obtener una actividad por ID
const getActivityById = async (id) => {
  try {
    // Intentar obtener datos reales de la API
    const response = await apiRequest({
      method: "GET",
      url: `/api/activities/${id}`,
    });
    return response;
  } catch (error) {
    console.warn(
      `Error al obtener actividad ${id} de la API, usando datos de prueba:`,
      error
    );

    // Fallback a datos de prueba
    const activity = getMockActivityById(Number(id));
    if (!activity) {
      throw new Error("Actividad no encontrada");
    }
    return activity;
  }
};

// Crear una nueva actividad
const createActivity = async (activityData) => {
  try {
    // Intentar crear en la API real
    const response = await apiRequest({
      method: "POST",
      url: "/api/activities",
      data: activityData,
    });
    return response;
  } catch (error) {
    console.warn(
      "Error al crear actividad en la API, usando datos de prueba:",
      error
    );

    // Fallback a datos de prueba
    return createMockActivity(activityData);
  }
};

// Actualizar una actividad
const updateActivity = async (id, activityData) => {
  try {
    // Intentar actualizar en la API real
    const response = await apiRequest({
      method: "PUT",
      url: `/api/activities/${id}`,
      data: activityData,
    });
    return response;
  } catch (error) {
    console.warn(
      `Error al actualizar actividad ${id} en la API, usando datos de prueba:`,
      error
    );

    // Fallback a datos de prueba
    const updatedActivity = updateMockActivity(Number(id), activityData);
    if (!updatedActivity) {
      throw new Error("Actividad no encontrada");
    }
    return updatedActivity;
  }
};

// Eliminar una actividad
const deleteActivity = async (id) => {
  try {
    // Intentar eliminar en la API real
    await apiRequest({
      method: "DELETE",
      url: `/api/activities/${id}`,
    });
    return { success: true };
  } catch (error) {
    console.warn(
      `Error al eliminar actividad ${id} en la API, usando datos de prueba:`,
      error
    );

    // Fallback a datos de prueba
    const success = deleteMockActivity(Number(id));
    if (!success) {
      throw new Error("Actividad no encontrada");
    }
    return { success: true };
  }
};

const activitiesService = {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
};

export default activitiesService;
