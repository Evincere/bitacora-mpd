import { api } from '@/core/api/api';
import { Activity, ActivityCategory, ActivityPriority } from '@/types/models';

export interface SolicitudRequest {
  titulo: string;
  descripcion: string;
  categoria: string;
  prioridad: string;
  fechaLimite?: string;
}

export interface SolicitudResponse {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  prioridad: string;
  fechaCreacion: string;
  fechaLimite?: string;
  estado: string;
  solicitante: string;
}

/**
 * Servicio para gestionar las solicitudes
 */
const solicitudesService = {
  /**
   * Crea una nueva solicitud
   * @param solicitud Datos de la solicitud
   * @returns La solicitud creada
   */
  async createSolicitud(solicitud: SolicitudRequest): Promise<SolicitudResponse> {
    try {
      // Mapear los datos del formulario al formato esperado por el endpoint
      const requestData = {
        type: solicitud.categoria,
        description: solicitud.descripcion,
        priority: solicitud.prioridad,
        date: new Date().toISOString(),
        notes: `Solicitud: ${solicitud.titulo}`,
        dueDate: solicitud.fechaLimite,
      };

      const response = await api.post('api/activities/request', { json: requestData }).json();
      return {
        id: response.id,
        titulo: response.title || response.titulo,
        descripcion: response.description || response.descripcion,
        categoria: response.category || response.categoria,
        prioridad: response.priority || response.prioridad,
        fechaCreacion: response.requestDate || response.fechaCreacion,
        fechaLimite: response.dueDate || response.fechaLimite,
        estado: response.status || response.estado,
        solicitante: response.requesterName || response.solicitante,
      };
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      throw error;
    }
  },

  /**
   * Obtiene las categorías disponibles
   * @returns Lista de categorías
   */
  async getCategories(): Promise<ActivityCategory[]> {
    try {
      const response = await api.get('api/activities/categories').json<ActivityCategory[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      // Devolver categorías por defecto en caso de error
      return [
        { id: 1, name: 'ADMINISTRATIVA', description: 'Tareas administrativas', color: '#4CAF50' },
        { id: 2, name: 'LEGAL', description: 'Tareas legales', color: '#2196F3' },
        { id: 3, name: 'TECNICA', description: 'Tareas técnicas', color: '#FF9800' },
        { id: 4, name: 'FINANCIERA', description: 'Tareas financieras', color: '#9C27B0' },
        { id: 5, name: 'RECURSOS_HUMANOS', description: 'Tareas de recursos humanos', color: '#F44336' },
        { id: 6, name: 'OTRA', description: 'Otras tareas', color: '#607D8B' }
      ];
    }
  },

  /**
   * Obtiene las prioridades disponibles
   * @returns Lista de prioridades
   */
  async getPriorities(): Promise<ActivityPriority[]> {
    try {
      const response = await api.get('api/activities/priorities').json<ActivityPriority[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener prioridades:', error);
      // Devolver prioridades por defecto en caso de error
      return [
        { name: 'CRITICAL', displayName: 'Crítica', color: '#F44336' },
        { name: 'HIGH', displayName: 'Alta', color: '#FF9800' },
        { name: 'MEDIUM', displayName: 'Media', color: '#2196F3' },
        { name: 'LOW', displayName: 'Baja', color: '#4CAF50' },
        { name: 'TRIVIAL', displayName: 'Trivial', color: '#9E9E9E' }
      ];
    }
  },

  /**
   * Sube archivos adjuntos para una solicitud
   * @param activityId ID de la actividad
   * @param files Archivos a subir
   * @returns Información de los archivos subidos
   */
  async uploadAttachments(activityId: number, files: File[]): Promise<any[]> {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await api.post(`api/activities/${activityId}/attachments`, {
        body: formData,
      }).json();

      return response;
    } catch (error) {
      console.error('Error al subir archivos:', error);
      throw error;
    }
  }
};

export default solicitudesService;
