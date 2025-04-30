import { api } from '@/core/api/api';
import { Activity, ActivityCategory, ActivityPriority } from '@/types/models';
import { formatDateForBackend } from '@/utils/dateUtils';

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
   * Obtiene las solicitudes del usuario actual
   * @param page Número de página
   * @param size Tamaño de página
   * @returns Lista de solicitudes del usuario
   */
  async getMySolicitudes(page = 0, size = 10): Promise<{
    activities: Activity[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      console.log('Solicitando mis solicitudes a la API...');
      // Usar la URL correcta sin duplicar el prefijo /api
      const response = await api.get(`activities/user/my-requests?page=${page}&size=${size}`).json();
      console.log('Respuesta de mis solicitudes:', response);
      return response;
    } catch (error) {
      console.error('Error al obtener mis solicitudes:', error);
      throw error;
    }
  },

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
        date: formatDateForBackend(new Date()),
        notes: `Solicitud: ${solicitud.titulo}`,
        dueDate: formatDateForBackend(solicitud.fechaLimite),
      };

      // Añadir encabezados específicos para esta solicitud
      console.log('Enviando solicitud de creación a la API:', requestData);
      const response = await api.post('activities/request', {
        json: requestData,
        headers: {
          'X-User-Permissions': 'REQUEST_ACTIVITIES'
        }
      }).json();
      console.log('Respuesta de creación de solicitud:', response);
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
      console.log('Solicitando categorías a la API...');
      const response = await api.get('activities/categories').json<ActivityCategory[]>();
      console.log('Respuesta de categorías:', response);
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
      console.log('Solicitando prioridades a la API...');
      const response = await api.get('activities/priorities').json<ActivityPriority[]>();
      console.log('Respuesta de prioridades:', response);
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

      console.log(`Subiendo archivos adjuntos para la actividad ${activityId}...`);
      const response = await api.post(`activities/${activityId}/attachments`, {
        body: formData,
      }).json();
      console.log('Respuesta de subida de archivos:', response);

      return response;
    } catch (error) {
      console.error('Error al subir archivos:', error);
      throw error;
    }
  }
};

export default solicitudesService;
