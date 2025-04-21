import { Activity } from '@/types/models';
import { ActivitiesResponse, ActivityCreateRequest, ActivityQueryParams, ActivityUpdateRequest } from '@/types/api';

/**
 * Interfaz para el servicio simulado de actividades
 */
declare const mockService: {
  /**
   * Obtiene actividades con filtros y paginación
   * @param params Parámetros de consulta
   * @returns Lista de actividades y total
   */
  getActivities: (params?: ActivityQueryParams) => Promise<ActivitiesResponse>;

  /**
   * Obtiene una actividad por su ID
   * @param id ID de la actividad
   * @returns Actividad
   */
  getActivityById: (id: number) => Promise<Activity>;

  /**
   * Crea una nueva actividad
   * @param activityData Datos de la actividad
   * @returns Actividad creada
   */
  createActivity: (activityData: ActivityCreateRequest) => Promise<Activity>;

  /**
   * Actualiza una actividad existente
   * @param id ID de la actividad
   * @param activityData Datos a actualizar
   * @returns Actividad actualizada
   */
  updateActivity: (id: number, activityData: ActivityUpdateRequest) => Promise<Activity>;

  /**
   * Elimina una actividad
   * @param id ID de la actividad
   * @returns Respuesta vacía
   */
  deleteActivity: (id: number) => Promise<void>;
};

export default mockService;
