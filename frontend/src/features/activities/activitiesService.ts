import {
  ActivitiesResponse,
  ActivityCreateRequest,
  ActivityQueryParams,
  ActivityUpdateRequest,
  ApiError
} from '@/types/api';
import { Activity } from '@/types/models';
import { apiRequest } from '@/utils/api-ky';

// Asegurarse de que la URL no incluya el prefijo /app
const API_URL = 'activities';

// Nota: No incluimos '/api/' porque ya está en la configuración base de la API

// Mostrar información sobre el modo de servicio
console.log(`Servicio de actividades configurado en modo real`);
console.log(`API URL: ${API_URL}`);

// Verificar si estamos en modo de desarrollo
const isDevelopment = import.meta.env.DEV;
if (isDevelopment) {
  console.log('Modo de desarrollo activo - Proxy configurado para redirigir /api a http://localhost:8080');
}

// Caché para evitar peticiones duplicadas
const requestCache = new Map();

/**
 * Función auxiliar para manejar errores de API
 * @param error Error capturado
 * @returns Error tipado como ApiError
 */
const handleApiError = (error: unknown): ApiError => {
  // Convertir error a ApiError para acceder a sus propiedades
  return error as ApiError;
};

// Función para generar una clave única para la caché
const getCacheKey = (method: string, url: string, params?: any) => {
  if (params) {
    // Ordenar las claves para asegurar consistencia
    const sortedParams = Object.keys(params).sort().reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {} as Record<string, any>);

    return `${method}:${url}:${JSON.stringify(sortedParams)}`;
  }
  return `${method}:${url}`;
};

/**
 * Obtiene actividades con filtros y paginación
 * @param params Parámetros de consulta
 * @returns Lista de actividades y total
 */
const getActivities = async (params?: ActivityQueryParams): Promise<ActivitiesResponse> => {
  // Generar clave de caché para esta petición
  const cacheKey = getCacheKey('GET', API_URL, params);

  // Verificar si la petición ya está en caché
  if (requestCache.has(cacheKey)) {
    console.log(`Usando resultado en caché para: ${cacheKey}`);
    return requestCache.get(cacheKey);
  }

  // Si no, usar el servicio real
  // Construir query params
  const searchParams = new URLSearchParams();

  if (params) {
    if (params.page !== undefined) searchParams.append('page', String(params.page));
    if (params.size !== undefined) searchParams.append('size', String(params.size));
    if (params.sort) searchParams.append('sort', params.sort);
    if (params.type) searchParams.append('type', params.type);
    if (params.status) searchParams.append('status', params.status);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    if (params.search) searchParams.append('search', params.search);
  }

  // Agregar ordenamiento por defecto si no se especifica
  if (!params?.sort) {
    searchParams.append('sort', 'createdAt,desc');
  }

  const queryString = searchParams.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  try {
    // Crear la promesa
    const promise = apiRequest<ActivitiesResponse>(url);

    // Almacenar en caché
    requestCache.set(cacheKey, promise);

    // Eliminar de la caché cuando se complete
    promise.finally(() => {
      setTimeout(() => requestCache.delete(cacheKey), 2000);
    });

    // Esperar la respuesta y validar su estructura
    const response = await promise;

    // Verificar que la respuesta tenga la estructura esperada
    if (!response || typeof response !== 'object') {
      console.error('Respuesta inválida del servidor:', response);
      throw new Error('Respuesta inválida del servidor');
    }

    // Verificar que la respuesta tenga las propiedades esperadas
    if (!Array.isArray(response.activities)) {
      console.error('La propiedad "activities" no es un array o no existe:', response);

      // Intentar adaptar la respuesta si es posible
      if (Array.isArray(response)) {
        console.log('Adaptando respuesta del servidor (array) a formato esperado');
        return {
          activities: response,
          totalCount: response.length
        };
      } else if (response.content && Array.isArray(response.content)) {
        console.log('Adaptando respuesta del servidor (paginada) a formato esperado');
        return {
          activities: response.content,
          totalCount: response.totalElements || response.content.length
        };
      }

      // Si no se puede adaptar, crear una respuesta vacía
      console.warn('No se pudo adaptar la respuesta, devolviendo estructura vacía');
      return {
        activities: [],
        totalCount: 0
      };
    }

    // Devolver la respuesta validada
    return response;
  } catch (error) {
    console.error('Error al obtener actividades de la API:', error);

    // Convertir error a ApiError para acceder a sus propiedades
    const apiError = error as ApiError;

    // Mostrar mensaje de error más descriptivo
    if (apiError.status === 404) {
      console.warn('No se encontraron actividades en el servidor');
    } else if (apiError.status === 500) {
      console.error('Error interno del servidor al procesar actividades');
    } else if (apiError.message?.includes('Failed to fetch') || apiError.message?.includes('Network Error')) {
      console.error('Error de conexión con el servidor');
    }

    // Crear una respuesta vacía en caso de error
    return {
      activities: [],
      totalCount: 0
    };
  }
};

/**
 * Obtiene una actividad por su ID
 * @param id ID de la actividad
 * @returns Actividad
 */
const getActivityById = async (id: number): Promise<Activity> => {
  try {
    // Asegurarse de que la URL no tenga barras duplicadas
    return await apiRequest<Activity>(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error al obtener actividad con ID ${id}:`, error);

    // Convertir error a ApiError para acceder a sus propiedades
    const apiError = handleApiError(error);

    // Mostrar mensaje de error más descriptivo
    if (apiError.status === 404) {
      console.warn(`No se encontró la actividad con ID ${id}`);
    } else if (apiError.status === 500) {
      console.error('Error interno del servidor al obtener la actividad');
    } else if (apiError.message?.includes('Failed to fetch') || apiError.message?.includes('Network Error')) {
      console.error('Error de conexión con el servidor');
    }

    // Propagar el error para que se maneje en el componente
    throw error;
  }
};

/**
 * Crea una nueva actividad
 * @param activityData Datos de la actividad
 * @returns Actividad creada
 */
const createActivity = async (activityData: ActivityCreateRequest): Promise<Activity> => {
  try {
    return await apiRequest<Activity>(API_URL, {
      method: 'POST',
      json: activityData
    });
  } catch (error) {
    console.error('Error al crear actividad:', error);

    // Convertir error a ApiError para acceder a sus propiedades
    const apiError = handleApiError(error);

    // Mostrar mensaje de error más descriptivo
    if (apiError.status === 400) {
      console.warn('Datos de actividad inválidos');
      if (apiError.details && apiError.details.details && apiError.details.details.length > 0) {
        console.warn('Detalles de validación:', apiError.details.details);
      }
    } else if (apiError.status === 500) {
      console.error('Error interno del servidor al crear la actividad');
    } else if (apiError.message?.includes('Failed to fetch') || apiError.message?.includes('Network Error')) {
      console.error('Error de conexión con el servidor');
    }

    // Propagar el error para que se maneje en el componente
    throw error;
  }
};

/**
 * Actualiza una actividad existente
 * @param id ID de la actividad
 * @param activityData Datos a actualizar
 * @returns Actividad actualizada
 */
const updateActivity = async (id: number, activityData: ActivityUpdateRequest): Promise<Activity> => {
  try {
    return await apiRequest<Activity>(`${API_URL}/${id}`, {
      method: 'PUT',
      json: activityData
    });
  } catch (error) {
    console.error(`Error al actualizar actividad con ID ${id}:`, error);

    // Convertir error a ApiError para acceder a sus propiedades
    const apiError = handleApiError(error);

    // Mostrar mensaje de error más descriptivo
    if (apiError.status === 404) {
      console.warn(`No se encontró la actividad con ID ${id} para actualizar`);
    } else if (apiError.status === 400) {
      console.warn('Datos de actualización inválidos');
      if (apiError.details && apiError.details.details && apiError.details.details.length > 0) {
        console.warn('Detalles de validación:', apiError.details.details);
      }
    } else if (apiError.status === 500) {
      console.error('Error interno del servidor al actualizar la actividad');
    } else if (apiError.message?.includes('Failed to fetch') || apiError.message?.includes('Network Error')) {
      console.error('Error de conexión con el servidor');
    }

    // Propagar el error para que se maneje en el componente
    throw error;
  }
};

/**
 * Elimina una actividad
 * @param id ID de la actividad
 * @returns Respuesta vacía
 */
const deleteActivity = async (id: number): Promise<void> => {
  try {
    return await apiRequest<void>(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error(`Error al eliminar actividad con ID ${id}:`, error);

    // Convertir error a ApiError para acceder a sus propiedades
    const apiError = handleApiError(error);

    // Mostrar mensaje de error más descriptivo
    if (apiError.status === 404) {
      console.warn(`No se encontró la actividad con ID ${id} para eliminar`);
    } else if (apiError.status === 500) {
      console.error('Error interno del servidor al eliminar la actividad');
    } else if (apiError.message?.includes('Failed to fetch') || apiError.message?.includes('Network Error')) {
      console.error('Error de conexión con el servidor');
    }

    // Propagar el error para que se maneje en el componente
    throw error;
  }
};

/**
 * Obtiene estadísticas de actividades por tipo
 * @returns Estadísticas de actividades por tipo
 */
const getStatsByType = async (): Promise<any[]> => {
  try {
    // Asegurarse de que la URL no tenga barras duplicadas
    return await apiRequest<any[]>(`${API_URL}/stats/by-type`);
  } catch (error) {
    console.error('Error al obtener estadísticas por tipo:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de actividades por estado
 * @returns Estadísticas de actividades por estado
 */
const getStatsByStatus = async (): Promise<any[]> => {
  try {
    // Asegurarse de que la URL no tenga barras duplicadas
    return await apiRequest<any[]>(`${API_URL}/stats/by-status`);
  } catch (error) {
    console.error('Error al obtener estadísticas por estado:', error);
    throw error;
  }
};

/**
 * Obtiene resúmenes de actividades con paginación
 * @param page Número de página
 * @param size Tamaño de página
 * @returns Resúmenes de actividades
 */
const getActivitySummaries = async (page: number = 0, size: number = 10): Promise<any> => {
  try {
    // Asegurarse de que la URL no tenga barras duplicadas
    return await apiRequest<any>(`${API_URL}/summaries?page=${page}&size=${size}`);
  } catch (error) {
    console.error('Error al obtener resúmenes de actividades:', error);
    throw error;
  }
};

const activitiesService = {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getStatsByType,
  getStatsByStatus,
  getActivitySummaries
};

export default activitiesService;
