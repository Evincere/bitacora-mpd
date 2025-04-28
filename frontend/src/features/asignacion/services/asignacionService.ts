import { api } from '@/core/api/api';
import { Activity, User } from '@/types/models';

export interface AsignacionRequest {
  activityId: number;
  executorId: number;
  notes?: string;
  dueDate?: string;
  priority?: string;
}

export interface AsignacionResponse {
  id: number;
  status: string;
  executorId: number;
  executorName: string;
  assignerId: number;
  assignerName: string;
  assignmentDate: string;
  dueDate?: string;
  notes?: string;
}

/**
 * Servicio para gestionar las asignaciones
 */
const asignacionService = {
  /**
   * Obtiene las solicitudes pendientes de asignación
   * @returns Lista de solicitudes pendientes
   */
  async getPendingRequests(): Promise<Activity[]> {
    try {
      const response = await api.get('activities/pending').json<Activity[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener solicitudes pendientes:', error);
      throw error;
    }
  },

  /**
   * Obtiene las tareas asignadas agrupadas por ejecutor
   * @returns Lista de tareas asignadas por ejecutor
   */
  async getAssignedTasksByExecutor(): Promise<{ executor: User; tasks: Activity[] }[]> {
    try {
      const response = await api.get('activities/assigned/by-executor').json<{ executor: User; tasks: Activity[] }[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener tareas asignadas por ejecutor:', error);
      throw error;
    }
  },

  /**
   * Obtiene las estadísticas de distribución de carga
   * @returns Estadísticas de distribución de carga
   */
  async getWorkloadDistribution(): Promise<any> {
    try {
      const response = await api.get('activities/stats/workload').json();
      return response;
    } catch (error) {
      console.error('Error al obtener distribución de carga:', error);
      throw error;
    }
  },

  /**
   * Obtiene los ejecutores disponibles
   * @returns Lista de ejecutores disponibles
   */
  async getAvailableExecutors(): Promise<User[]> {
    try {
      const response = await api.get('users/executors').json<User[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener ejecutores disponibles:', error);
      // Devolver datos de ejemplo en caso de error
      return [
        { id: 1, username: 'ejecutor1', firstName: 'Ana', lastName: 'Martínez', fullName: 'Ana Martínez', email: 'ana@example.com', role: 'EJECUTOR', active: true, createdAt: '', updatedAt: '', permissions: [] },
        { id: 2, username: 'ejecutor2', firstName: 'Luis', lastName: 'Sánchez', fullName: 'Luis Sánchez', email: 'luis@example.com', role: 'EJECUTOR', active: true, createdAt: '', updatedAt: '', permissions: [] },
        { id: 3, username: 'ejecutor3', firstName: 'María', lastName: 'López', fullName: 'María López', email: 'maria@example.com', role: 'EJECUTOR', active: true, createdAt: '', updatedAt: '', permissions: [] },
        { id: 4, username: 'ejecutor4', firstName: 'Pedro', lastName: 'Gómez', fullName: 'Pedro Gómez', email: 'pedro@example.com', role: 'EJECUTOR', active: true, createdAt: '', updatedAt: '', permissions: [] }
      ];
    }
  },

  /**
   * Asigna una tarea a un ejecutor
   * @param asignacion Datos de la asignación
   * @returns Respuesta de la asignación
   */
  async assignTask(asignacion: AsignacionRequest): Promise<AsignacionResponse> {
    try {
      const requestData = {
        executorId: asignacion.executorId,
        notes: asignacion.notes,
        dueDate: asignacion.dueDate,
        priority: asignacion.priority
      };

      const response = await api.post(`activities/${asignacion.activityId}/assign`, { json: requestData }).json();
      return response;
    } catch (error) {
      console.error('Error al asignar tarea:', error);
      throw error;
    }
  }
};

export default asignacionService;
