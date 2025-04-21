import {
  ActivitiesResponse,
  ActivityCreateRequest,
  ActivityQueryParams,
  ActivityUpdateRequest,
  ApiError
} from '@/types/api';
import { Activity } from '@/types/models';
import { apiRequest } from '@/utils/api-ky';
import mockService from './mockService';

const API_URL = 'api/activities';

// Variable para controlar si se usa el servicio simulado - leer de variables de entorno
const USE_MOCK_SERVICE = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Verificar si el servicio simulado está disponible
const isMockServiceAvailable = typeof mockService !== 'undefined' && mockService !== null;

// Mostrar información sobre el modo de servicio
console.log(`Servicio de actividades configurado en modo ${USE_MOCK_SERVICE ? 'simulado' : 'real'}`);
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

  // Verificar si la petición ya está en curso
  if (requestCache.has(cacheKey)) {
    console.log(`Usando resultado en caché para: ${cacheKey}`);
    return requestCache.get(cacheKey);
  }

  // Si estamos usando el servicio simulado y está disponible, usarlo
  if (USE_MOCK_SERVICE && isMockServiceAvailable) {
    try {
      console.log('Usando servicio simulado para getActivities');
      const result = mockService.getActivities(params);
      // Almacenar en caché
      requestCache.set(cacheKey, result);
      // Eliminar de la caché después de un tiempo
      setTimeout(() => requestCache.delete(cacheKey), 2000);
      return await result;
    } catch (error) {
      console.error('Error en servicio simulado:', error);
      throw error;
    }
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

    // Si estamos en modo de desarrollo o el error es grave, usar datos simulados
    if (USE_MOCK_SERVICE || isDevelopment || apiError.status >= 500 || apiError.status === 0) {
      console.log('Error al obtener actividades de la API, usando datos de prueba:', error);
      if (isMockServiceAvailable) {
        return await mockService.getActivities(params);
      } else {
        // Si el servicio simulado no está disponible, crear una respuesta vacía
        console.warn('Servicio simulado no disponible, devolviendo datos vacíos');
        return {
          activities: [],
          totalCount: 0
        };
      }
    }

    // Si no estamos en modo de desarrollo y el error no es grave, propagar el error
    throw error;
  }
};

/**
 * Obtiene una actividad por su ID
 * @param id ID de la actividad
 * @returns Actividad
 */
const getActivityById = async (id: number): Promise<Activity> => {
  // Si estamos usando el servicio simulado y está disponible, usarlo
  if (USE_MOCK_SERVICE && isMockServiceAvailable) {
    try {
      console.log(`Usando servicio simulado para getActivityById(${id})`);
      return await mockService.getActivityById(id);
    } catch (error) {
      console.error('Error en servicio simulado:', error);
      throw error;
    }
  }

  // Si no, usar el servicio real
  try {
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

    // Si estamos en modo de desarrollo o el error es grave, usar datos simulados
    if (USE_MOCK_SERVICE || isDevelopment || apiError.status >= 500 || apiError.status === 0) {
      console.log(`Error en API real, usando servicio simulado como fallback para ID ${id}:`, error);
      if (isMockServiceAvailable) {
        return await mockService.getActivityById(id);
      } else {
        // Si el servicio simulado no está disponible, lanzar error
        console.warn('Servicio simulado no disponible');
        throw new Error(`No se pudo obtener la actividad con ID ${id}`);
      }
    }

    // Si no estamos en modo de desarrollo y el error no es grave, propagar el error
    throw error;
  }
};

/**
 * Crea una nueva actividad
 * @param activityData Datos de la actividad
 * @returns Actividad creada
 */
const createActivity = async (activityData: ActivityCreateRequest): Promise<Activity> => {
  // Si estamos usando el servicio simulado y está disponible, usarlo
  if (USE_MOCK_SERVICE && isMockServiceAvailable) {
    try {
      console.log('Usando servicio simulado para createActivity');
      return await mockService.createActivity(activityData);
    } catch (error) {
      console.error('Error en servicio simulado:', error);
      throw error;
    }
  }

  // Si no, usar el servicio real
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

    // Si estamos en modo de desarrollo o el error es grave, usar datos simulados
    if (USE_MOCK_SERVICE || isDevelopment || apiError.status >= 500 || apiError.status === 0) {
      console.log('Error en API real, usando servicio simulado como fallback:', error);
      if (isMockServiceAvailable) {
        return await mockService.createActivity(activityData);
      } else {
        // Si el servicio simulado no está disponible, lanzar error
        console.warn('Servicio simulado no disponible, no se puede crear la actividad');
        throw new Error('No se pudo crear la actividad');
      }
    }

    // Si no estamos en modo de desarrollo y el error no es grave, propagar el error
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
  // Si estamos usando el servicio simulado y está disponible, usarlo
  if (USE_MOCK_SERVICE && isMockServiceAvailable) {
    try {
      console.log(`Usando servicio simulado para updateActivity(${id})`);
      return await mockService.updateActivity(id, activityData);
    } catch (error) {
      console.error('Error en servicio simulado:', error);
      throw error;
    }
  }

  // Si no, usar el servicio real
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

    // Si estamos en modo de desarrollo o el error es grave, usar datos simulados
    if (USE_MOCK_SERVICE || isDevelopment || apiError.status >= 500 || apiError.status === 0) {
      console.log(`Error en API real, usando servicio simulado como fallback para ID ${id}:`, error);
      if (isMockServiceAvailable) {
        return await mockService.updateActivity(id, activityData);
      } else {
        // Si el servicio simulado no está disponible, lanzar error
        console.warn(`Servicio simulado no disponible, no se puede actualizar la actividad ${id}`);
        throw new Error(`No se pudo actualizar la actividad con ID ${id}`);
      }
    }

    // Si no estamos en modo de desarrollo y el error no es grave, propagar el error
    throw error;
  }
};

/**
 * Elimina una actividad
 * @param id ID de la actividad
 * @returns Respuesta vacía
 */
const deleteActivity = async (id: number): Promise<void> => {
  // Si estamos usando el servicio simulado y está disponible, usarlo
  if (USE_MOCK_SERVICE && isMockServiceAvailable) {
    try {
      console.log(`Usando servicio simulado para deleteActivity(${id})`);
      return await mockService.deleteActivity(id);
    } catch (error) {
      console.error('Error en servicio simulado:', error);
      throw error;
    }
  }

  // Si no, usar el servicio real
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

    // Si estamos en modo de desarrollo o el error es grave, usar datos simulados
    if (USE_MOCK_SERVICE || isDevelopment || apiError.status >= 500 || apiError.status === 0) {
      console.log(`Error en API real, usando servicio simulado como fallback para ID ${id}:`, error);
      if (isMockServiceAvailable) {
        return await mockService.deleteActivity(id);
      } else {
        // Si el servicio simulado no está disponible, lanzar error
        console.warn(`Servicio simulado no disponible, no se puede eliminar la actividad ${id}`);
        throw new Error(`No se pudo eliminar la actividad con ID ${id}`);
      }
    }

    // Si no estamos en modo de desarrollo y el error no es grave, propagar el error
    throw error;
  }
};

const activitiesService = {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
};

export default activitiesService;
