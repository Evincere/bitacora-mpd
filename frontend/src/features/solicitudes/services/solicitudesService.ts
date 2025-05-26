import { api } from '@/core/api/api';
import { ActivityCategory, ActivityPriority } from '@/core/types/models';
import { formatDateForBackend } from '@/core/utils/dateUtils';
import { retryService } from '@/shared/services/retryService';

export interface SolicitudRequest {
  titulo: string;
  descripcion: string;
  categoria: string;
  prioridad: string;
  fechaLimite?: string;
}

export interface UpdateSolicitudRequest {
  titulo?: string;
  descripcion?: string;
  categoria?: string;
  prioridad?: string;
  fechaLimite?: string;
  submit: boolean;
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

export interface TaskRequest {
  id: number;
  title: string;
  description: string;
  category: {
    id: number;
    name: string;
    description: string;
    color: string;
  };
  priority: string;
  status: string;
  requesterId: number;
  requesterName: string;
  requestDate: string;
  dueDate?: string;
  notes?: string;
  assignerId?: number;
  assignerName?: string;
  assignmentDate?: string;
  executorId?: number;
  executorName?: string;
  completionDate?: string;
  rejectionReason?: string;
}

export interface TaskRequestPageDto {
  taskRequests: TaskRequest[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface TaskRequestHistory {
  id: number;
  taskRequestId: number;
  userId: number;
  userName: string;
  previousStatus: string;
  newStatus: string;
  changeDate: string;
  notes: string;
}

export interface TaskRequestRequesterStats {
  totalRequests: number;
  pendingRequests: number;
  assignedRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  rejectedRequests: number;
  cancelledRequests: number;
  averageAssignmentTime: number;
  averageCompletionTime: number;
  onTimeCompletionPercentage: number;
  lateCompletionPercentage: number;
  requestsByCategory: Record<string, number>;
  requestsByPriority: Record<string, number>;
  requestsByMonth: Record<string, number>;
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
  async getMySolicitudes(page = 0, size = 10): Promise<TaskRequestPageDto> {
    try {
      console.log('Solicitando mis solicitudes a la API...');

      // Añadir un timestamp para evitar caché del navegador
      const timestamp = new Date().getTime();

      // Usar fetch directamente para evitar problemas con ky
      const token = localStorage.getItem('bitacora_token');
      console.log('Token para mis solicitudes:', token ? `${token.substring(0, 10)}...` : 'null');

      const response = await fetch(`/api/task-requests/my-requests?page=${page}&size=${size}&_t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        console.warn(`Error al obtener solicitudes: ${response.status} ${response.statusText}`);
        throw new Error(`Error al obtener solicitudes: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Respuesta de mis solicitudes:', data);

      // Verificar si la respuesta contiene datos
      if (!data || !data.taskRequests) {
        console.warn('La respuesta no contiene datos de solicitudes');
        throw new Error('La respuesta no contiene datos de solicitudes');
      }

      return data;
    } catch (error) {
      console.error('Error al obtener mis solicitudes:', error);
      // Devolver un objeto vacío en caso de error
      return {
        taskRequests: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 0
      };
    }
  },

  /**
   * Obtiene estadísticas detalladas para el usuario solicitante actual
   * @returns Estadísticas detalladas del solicitante
   */
  async getRequesterStats(): Promise<TaskRequestRequesterStats> {
    try {
      console.log('Solicitando estadísticas de solicitante a la API...');

      // Añadir un timestamp para evitar caché del navegador
      const timestamp = new Date().getTime();

      // Usar fetch directamente para evitar problemas con ky
      const token = localStorage.getItem('bitacora_token');
      console.log('Token para estadísticas:', token ? `${token.substring(0, 10)}...` : 'null');

      const response = await fetch(`/api/task-requests/stats/requester?_t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        console.warn(`Error al obtener estadísticas: ${response.status} ${response.statusText}`);
        throw new Error(`Error al obtener estadísticas: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Respuesta de estadísticas de solicitante:', data);

      // Verificar si la respuesta es válida
      if (!data) {
        console.warn('La respuesta de estadísticas no contiene datos');
        throw new Error('La respuesta de estadísticas no contiene datos');
      }

      // Verificar si hay datos reales o son valores por defecto/hardcodeados
      // Si no hay solicitudes, asegurarse de que los tiempos promedio sean 0
      if (data.totalRequests === 0) {
        data.averageAssignmentTime = 0;
        data.averageCompletionTime = 0;
        data.onTimeCompletionPercentage = 0;
        data.lateCompletionPercentage = 0;
      }

      return data;
    } catch (error) {
      console.error('Error al obtener estadísticas de solicitante:', error);
      // Devolver un objeto con valores por defecto en caso de error
      return {
        totalRequests: 0,
        pendingRequests: 0,
        assignedRequests: 0,
        inProgressRequests: 0,
        completedRequests: 0,
        rejectedRequests: 0,
        cancelledRequests: 0,
        averageAssignmentTime: 0,
        averageCompletionTime: 0,
        onTimeCompletionPercentage: 0,
        lateCompletionPercentage: 0,
        requestsByCategory: {},
        requestsByPriority: {},
        requestsByMonth: {}
      };
    }
  },

  /**
   * Obtiene los detalles de una solicitud específica
   * @param id ID de la solicitud
   * @returns Detalles de la solicitud
   */
  async getTaskRequestById(id: number): Promise<TaskRequest> {
    if (!id) {
      throw new Error('ID de solicitud no válido');
    }

    try {
      // Usar un identificador único para esta solicitud para evitar logs duplicados
      const requestId = `req_${id}_${Date.now()}`;
      console.log(`[${requestId}] Solicitando detalles de la solicitud ${id}...`);

      const response = await api.get(`task-requests/${id}`).json();
      console.log(`[${requestId}] Respuesta de detalles de solicitud recibida`);
      return response;
    } catch (error) {
      console.error(`Error al obtener detalles de la solicitud ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva solicitud
   * @param solicitud Datos de la solicitud
   * @param submitImmediately Indica si la solicitud debe enviarse inmediatamente o guardarse como borrador
   * @returns La solicitud creada
   */
  async createSolicitud(solicitud: SolicitudRequest, submitImmediately: boolean = true): Promise<SolicitudResponse> {
    try {
      // Mapear los datos del formulario al formato esperado por el nuevo endpoint
      const requestData = {
        title: solicitud.titulo,
        description: solicitud.descripcion,
        categoryId: null, // Se usará la categoría por defecto si no se especifica
        priority: solicitud.prioridad,
        dueDate: solicitud.fechaLimite ? formatDateForBackend(solicitud.fechaLimite) : null,
        notes: `Solicitud: ${solicitud.titulo}`,
        submitImmediately: submitImmediately // Indica si se debe enviar inmediatamente o guardar como borrador
      };

      console.log(`Enviando solicitud de creación a la API (${submitImmediately ? 'enviar' : 'borrador'}):`, requestData);
      const response = await api.post('task-requests', {
        json: requestData
      }).json();
      console.log('Respuesta de creación de solicitud:', response);

      return {
        id: response.id,
        titulo: response.title,
        descripcion: response.description,
        categoria: response.category?.name || '',
        prioridad: response.priority,
        fechaCreacion: response.requestDate,
        fechaLimite: response.dueDate,
        estado: response.status,
        solicitante: response.requesterName || '',
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
      const response = await api.get('task-request-categories').json();
      console.log('Respuesta de categorías:', response);

      // Mapear la respuesta al formato esperado
      return response.map((category: any) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color
      }));
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
      // No hay un endpoint específico para prioridades en TaskRequest, así que usamos valores predefinidos
      return [
        { name: 'CRITICAL', displayName: 'Crítica', color: '#F44336' },
        { name: 'HIGH', displayName: 'Alta', color: '#FF9800' },
        { name: 'MEDIUM', displayName: 'Media', color: '#2196F3' },
        { name: 'LOW', displayName: 'Baja', color: '#4CAF50' },
        { name: 'TRIVIAL', displayName: 'Trivial', color: '#9E9E9E' }
      ];
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
   * @param taskRequestId ID de la solicitud
   * @param files Archivos a subir
   * @returns Información de los archivos subidos
   */
  async uploadAttachments(taskRequestId: number, files: File[]): Promise<any[]> {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      console.log(`Subiendo archivos adjuntos para la solicitud ${taskRequestId}...`);
      const response = await api.post(`task-requests/${taskRequestId}/attachments`, {
        body: formData,
      }).json();
      console.log('Respuesta de subida de archivos:', response);

      return response;
    } catch (error) {
      console.error('Error al subir archivos:', error);
      throw error;
    }
  },

  /**
   * Agrega un comentario a una solicitud, opcionalmente con archivos adjuntos
   * @param taskRequestId ID de la solicitud
   * @param comment Texto del comentario
   * @param files Archivos adjuntos (opcional)
   * @returns El comentario creado
   */
  async addComment(taskRequestId: number, comment: string, files?: File[]): Promise<any> {
    const commentKey = `comment_${taskRequestId}_${Date.now()}`;

    // Si hay archivos adjuntos, usamos FormData para enviar el comentario y los archivos
    const hasAttachments = files && files.length > 0;

    try {
      console.log(`Enviando comentario para la solicitud ${taskRequestId}...`);

      // Intentar enviar el comentario con reintentos automáticos
      let response;

      if (hasAttachments) {
        // Si hay archivos adjuntos, usamos FormData
        console.log(`Enviando comentario con ${files!.length} archivos adjuntos...`);

        // Validar el tamaño de los archivos antes de enviarlos
        const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB en bytes
        const oversizedFiles = files!.filter(file => file.size > MAX_FILE_SIZE);

        if (oversizedFiles.length > 0) {
          const fileNames = oversizedFiles.map(file => file.name).join(', ');
          const errorMsg = `Los siguientes archivos exceden el tamaño máximo permitido (15MB): ${fileNames}`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }

        const formData = new FormData();
        formData.append('taskRequestId', taskRequestId.toString());
        formData.append('content', comment);

        // Añadir los archivos al FormData
        files!.forEach(file => {
          formData.append('files', file);
        });

        try {
          // No usamos retry para archivos adjuntos debido a la complejidad
          response = await api.post(`task-requests/comments/with-attachments`, {
            body: formData,
            timeout: 60000 // Aumentar el timeout para archivos grandes
          }).json();
        } catch (error: any) {
          console.error('Error al enviar comentario con archivos adjuntos:', error);

          // Mejorar el mensaje de error para problemas de tamaño de archivo
          if (error.response && error.response.status === 400) {
            if (error.message && error.message.includes('tamaño')) {
              throw new Error('El tamaño de los archivos adjuntos excede el límite permitido (15MB)');
            }
          }

          throw error;
        }
      } else {
        // Si no hay archivos adjuntos, usamos JSON
        const commentData = {
          taskRequestId: taskRequestId,
          content: comment
        };

        response = await retryService.retry(
          async () => {
            return await api.post(`task-requests/comments`, {
              json: commentData
            }).json();
          },
          {
            maxRetries: 3,
            initialDelay: 1000,
            backoffFactor: 2,
            onError: (error, attempt) => {
              console.error(`Error al enviar comentario (intento ${attempt}):`, error);

              // Si es el último intento, guardar el comentario para reintentarlo más tarde
              if (attempt === 3) {
                retryService.saveForRetry(commentKey, {
                  taskRequestId,
                  comment
                });
              }
            }
          }
        );
      }

      console.log('Respuesta de envío de comentario:', response);
      return response;
    } catch (error) {
      console.error(`Error al enviar comentario para la solicitud ${taskRequestId}:`, error);

      // Solo guardamos para reintentar si no hay archivos adjuntos
      if (!hasAttachments) {
        // Guardar el comentario para reintentarlo más tarde
        retryService.saveForRetry(commentKey, {
          taskRequestId,
          comment
        });
      }

      throw error;
    }
  },

  /**
   * Obtiene los comentarios de una solicitud
   * @param taskRequestId ID de la solicitud
   * @returns Lista de comentarios
   */
  async getComments(taskRequestId: number): Promise<any[]> {
    try {
      console.log(`Obteniendo comentarios de la solicitud ${taskRequestId}...`);
      const response = await api.get(`task-requests/${taskRequestId}/comments`).json();
      console.log('Respuesta de comentarios:', response);
      return response;
    } catch (error) {
      console.error(`Error al obtener comentarios de la solicitud ${taskRequestId}:`, error);
      return [];
    }
  },

  /**
   * Obtiene los archivos adjuntos de una solicitud
   * @param taskRequestId ID de la solicitud
   * @returns Lista de archivos adjuntos
   */
  async getAttachments(taskRequestId: number): Promise<any[]> {
    try {
      console.log(`Obteniendo archivos adjuntos de la solicitud ${taskRequestId}...`);
      const response = await api.get(`task-requests/${taskRequestId}/attachments`).json();
      console.log('Respuesta de archivos adjuntos:', response);
      return response;
    } catch (error) {
      console.error(`Error al obtener archivos adjuntos de la solicitud ${taskRequestId}:`, error);
      return [];
    }
  },

  /**
   * Obtiene los comentarios de una solicitud con información de lectura
   * @param taskRequestId ID de la solicitud
   * @returns Lista de comentarios con información de lectura
   */
  async getCommentsWithReadStatus(taskRequestId: number): Promise<any[]> {
    try {
      console.log(`Obteniendo comentarios con estado de lectura de la solicitud ${taskRequestId}...`);
      const response = await api.get(`task-requests/${taskRequestId}/comments-with-read-status`).json();
      console.log('Respuesta de comentarios con estado de lectura:', response);
      return response;
    } catch (error) {
      console.error(`Error al obtener comentarios con estado de lectura de la solicitud ${taskRequestId}:`, error);
      return [];
    }
  },

  /**
   * Marca un comentario como leído
   * @param commentId ID del comentario
   * @returns El comentario actualizado
   */
  async markCommentAsRead(commentId: number): Promise<any> {
    const readKey = `read_comment_${commentId}_${Date.now()}`;

    try {
      console.log(`Marcando comentario ${commentId} como leído...`);

      // Intentar marcar el comentario como leído con reintentos automáticos
      const response = await retryService.retry(
        async () => {
          return await api.post(`task-requests/comments/${commentId}/mark-as-read`).json();
        },
        {
          maxRetries: 2, // Menos reintentos para operaciones de lectura
          initialDelay: 500,
          backoffFactor: 2,
          onError: (error, attempt) => {
            console.error(`Error al marcar comentario como leído (intento ${attempt}):`, error);

            // No es necesario guardar para reintentar más tarde, ya que esta operación
            // no es crítica para la experiencia del usuario
          }
        }
      );

      console.log('Respuesta de marcar comentario como leído:', response);
      return response;
    } catch (error) {
      console.error(`Error al marcar comentario ${commentId} como leído:`, error);
      // No lanzamos el error para que no afecte la experiencia del usuario
      return null;
    }
  },

  /**
   * Obtiene el historial de cambios de estado de una solicitud
   * @param taskRequestId ID de la solicitud
   * @returns Lista de registros de historial
   */
  async getTaskRequestHistory(taskRequestId: number): Promise<TaskRequestHistory[]> {
    try {
      console.log(`Obteniendo historial de la solicitud ${taskRequestId}...`);
      const response = await api.get(`task-requests/${taskRequestId}/history`).json();
      console.log('Respuesta de historial:', response);
      return response;
    } catch (error) {
      console.error(`Error al obtener historial de la solicitud ${taskRequestId}:`, error);
      return [];
    }
  },

  /**
   * Descarga un archivo adjunto
   * @param attachmentId ID del archivo adjunto
   * @param fileName Nombre del archivo para la descarga
   */
  async downloadAttachment(attachmentId: number, fileName: string): Promise<void> {
    try {
      console.log(`Descargando archivo adjunto ${attachmentId}...`);

      // Realizar la solicitud para obtener el archivo como blob
      const response = await api.get(`task-requests/attachments/${attachmentId}/download`, {
        responseType: 'blob'
      });

      // Crear un objeto URL para el blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace temporal para la descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;

      // Añadir el enlace al documento, hacer clic y luego eliminarlo
      document.body.appendChild(link);
      link.click();

      // Limpiar después de la descarga
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      console.log(`Archivo ${fileName} descargado correctamente`);
    } catch (error) {
      console.error(`Error al descargar archivo adjunto ${attachmentId}:`, error);
      throw error;
    }
  },

  /**
   * Actualiza una solicitud existente
   * @param id ID de la solicitud
   * @param solicitud Datos actualizados de la solicitud
   * @returns La solicitud actualizada
   */
  async updateSolicitud(id: number, solicitud: UpdateSolicitudRequest): Promise<TaskRequest> {
    try {
      console.log(`Actualizando solicitud ${id}...`, solicitud);

      // Mapear los datos del formulario al formato esperado por el backend
      const requestData = {
        title: solicitud.titulo,
        description: solicitud.descripcion,
        categoryId: null, // Se usará la categoría por defecto si no se especifica
        priority: solicitud.prioridad,
        dueDate: solicitud.fechaLimite ? formatDateForBackend(solicitud.fechaLimite) : null,
        notes: `Solicitud actualizada: ${solicitud.titulo}`,
        submit: solicitud.submit // Indica si se debe enviar inmediatamente
      };

      const response = await api.put(`task-requests/${id}`, {
        json: requestData
      }).json();

      console.log('Respuesta de actualización de solicitud:', response);
      return response;
    } catch (error) {
      console.error(`Error al actualizar solicitud ${id}:`, error);
      throw error;
    }
  },

  /**
   * Reenvía una solicitud rechazada
   * @param taskRequestId ID de la solicitud
   * @param notes Notas adicionales (opcional)
   * @returns La solicitud actualizada
   */
  async resubmitTaskRequest(taskRequestId: number, notes?: string): Promise<TaskRequest> {
    // Validar que el ID sea válido
    if (!taskRequestId || isNaN(taskRequestId)) {
      console.error(`ID de solicitud inválido: ${taskRequestId}`);
      throw new Error(`ID de solicitud inválido: ${taskRequestId}`);
    }

    try {
      console.log(`Reenviando solicitud rechazada ${taskRequestId}...`);

      const resubmitData = notes ? { notes } : {};

      const response = await api.post(`task-requests/${taskRequestId}/resubmit`, {
        json: resubmitData
      }).json();

      console.log('Respuesta de reenvío de solicitud:', response);
      return response;
    } catch (error) {
      console.error(`Error al reenviar solicitud ${taskRequestId}:`, error);
      throw error;
    }
  },

  /**
   * Procesa los comentarios pendientes que no se pudieron enviar
   * @returns Promesa que se resuelve cuando se han procesado todos los comentarios pendientes
   */
  async processPendingComments(): Promise<void> {
    console.log('Procesando comentarios pendientes...');

    return retryService.processPendingOperations(async (key, data) => {
      if (key.startsWith('comment_')) {
        const { taskRequestId, comment } = data;
        console.log(`Reintentando envío de comentario para la solicitud ${taskRequestId}...`);

        // Enviar el comentario sin usar el método addComment para evitar bucles
        await api.post(`task-requests/comments`, {
          json: {
            taskRequestId: taskRequestId,
            content: comment
          }
        }).json();
      }
    });
  }
};

export default solicitudesService;
