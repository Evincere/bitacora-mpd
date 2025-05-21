import api from '@/utils/api-ky';

export interface TaskPriority {
  name: string;
  displayName: string;
  color: string;
  value?: number;
}

/**
 * Servicio para la gestión de prioridades de tareas
 */
const priorityService = {
  /**
   * Obtiene todas las prioridades de tareas
   * @returns Lista de prioridades
   */
  async getAllPriorities(): Promise<TaskPriority[]> {
    try {
      // Intentar obtener prioridades del endpoint específico para TaskRequest
      try {
        const response = await api.get('task-request-priorities').json();
        return response as TaskPriority[];
      } catch (error) {
        // Si falla, usar el endpoint de actividades como fallback
        console.log('Fallback a endpoint de actividades para prioridades');
        const response = await api.get('activities/metadata/priorities').json();
        return response as TaskPriority[];
      }
    } catch (error) {
      console.error('Error al obtener prioridades:', error);
      
      // Devolver prioridades predefinidas como último recurso
      return [
        { name: 'CRITICAL', displayName: 'Crítica', color: '#F44336', value: 1 },
        { name: 'HIGH', displayName: 'Alta', color: '#FF9800', value: 2 },
        { name: 'MEDIUM', displayName: 'Media', color: '#2196F3', value: 3 },
        { name: 'LOW', displayName: 'Baja', color: '#4CAF50', value: 4 },
        { name: 'TRIVIAL', displayName: 'Trivial', color: '#9E9E9E', value: 5 }
      ];
    }
  }
};

export default priorityService;
