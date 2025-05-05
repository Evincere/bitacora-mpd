import { api } from '@/core/api/api';
import { Activity } from '@/types/models';

export interface ProgresoRequest {
  activityId: number;
  progress: number;
  notes?: string;
}

export interface CompletarTareaRequest {
  activityId: number;
  result: string;
  notes?: string;
}

/**
 * Servicio para gestionar las tareas del ejecutor
 */
const tareasService = {
  /**
   * Obtiene las tareas asignadas al ejecutor actual
   * @returns Lista de tareas asignadas
   */
  async getAssignedTasks(): Promise<Activity[]> {
    try {
      const response = await api.get('activities/assigned').json<Activity[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener tareas asignadas:', error);
      throw error;
    }
  },

  /**
   * Obtiene las tareas en progreso del ejecutor actual
   * @returns Lista de tareas en progreso
   */
  async getInProgressTasks(): Promise<Activity[]> {
    try {
      const response = await api.get('activities/in-progress').json<Activity[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener tareas en progreso:', error);
      throw error;
    }
  },

  /**
   * Obtiene el historial de tareas completadas del ejecutor actual
   * @returns Lista de tareas completadas
   */
  async getCompletedTasks(): Promise<Activity[]> {
    try {
      const response = await api.get('activities/completed').json<Activity[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener tareas completadas:', error);
      throw error;
    }
  },

  /**
   * Obtiene los detalles de una tarea específica
   * @param id ID de la tarea
   * @returns Detalles de la tarea
   */
  async getTaskDetails(id: number): Promise<Activity> {
    try {
      const response = await api.get(`activities/${id}`).json<Activity>();
      return response;
    } catch (error) {
      console.error('Error al obtener detalles de la tarea:', error);
      throw error;
    }
  },

  /**
   * Inicia una tarea asignada
   * @param id ID de la tarea
   * @param notes Notas opcionales para el inicio de la tarea
   * @returns Tarea actualizada
   */
  async startTask(id: number, notes?: string): Promise<Activity> {
    try {
      // Crear un objeto con las notas (si existen)
      const requestData = notes ? { notes } : { notes: "" };

      // Primero intentamos iniciar la tarea como una actividad
      try {
        const response = await api.post(`activities/${id}/start`, { json: requestData }).json<Activity>();
        console.log('Tarea iniciada como actividad:', response);
        return response;
      } catch (activityError) {
        console.warn('Error al iniciar tarea como actividad, intentando como solicitud:', activityError);

        // Si falla, intentamos iniciar la tarea como una solicitud
        try {
          const response = await api.post(`task-requests/${id}/start`, { json: requestData }).json<Activity>();
          console.log('Tarea iniciada como solicitud:', response);
          return response;
        } catch (taskRequestError) {
          console.error('Error al iniciar tarea como solicitud:', taskRequestError);
          throw taskRequestError;
        }
      }
    } catch (error) {
      console.error('Error al iniciar la tarea:', error);
      throw error;
    }
  },

  /**
   * Actualiza el progreso de una tarea
   * @param progreso Datos del progreso
   * @returns Tarea actualizada
   */
  async updateProgress(progreso: ProgresoRequest): Promise<Activity> {
    try {
      const requestData = {
        progress: progreso.progress,
        notes: progreso.notes
      };

      const response = await api.post(`activities/${progreso.activityId}/progress`, { json: requestData }).json<Activity>();
      return response;
    } catch (error) {
      console.error('Error al actualizar el progreso:', error);
      throw error;
    }
  },

  /**
   * Completa una tarea
   * @param completar Datos para completar la tarea
   * @returns Tarea actualizada
   */
  async completeTask(completar: CompletarTareaRequest): Promise<Activity> {
    try {
      const requestData = {
        result: completar.result,
        notes: completar.notes
      };

      const response = await api.post(`activities/${completar.activityId}/complete`, { json: requestData }).json<Activity>();
      return response;
    } catch (error) {
      console.error('Error al completar la tarea:', error);
      throw error;
    }
  },

  /**
   * Agrega un comentario a una tarea
   * @param activityId ID de la tarea
   * @param comment Comentario a agregar
   * @returns Tarea actualizada
   */
  async addComment(activityId: number, comment: string): Promise<Activity> {
    try {
      const response = await api.post(`activities/${activityId}/comment`, { json: { comment } }).json<Activity>();
      return response;
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      throw error;
    }
  }
};

export default tareasService;
