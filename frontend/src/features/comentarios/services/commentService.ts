import { api } from '@/core/api/api';

export interface Comment {
  id: number;
  taskRequestId?: number;
  activityId?: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
  readBy?: number[];
  readByCurrentUser?: boolean;
  mentions?: number[];
}

export interface CommentCreateDto {
  content: string;
  mentions?: number[];
}

/**
 * Servicio para gestionar comentarios
 */
const commentService = {
  /**
   * Obtiene los comentarios de una tarea
   * @param taskId ID de la tarea
   * @returns Lista de comentarios
   */
  async getTaskComments(taskId: number): Promise<Comment[]> {
    try {
      const response = await api.get(`activities/${taskId}/comments`).json<Comment[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener comentarios de la tarea:', error);
      throw error;
    }
  },

  /**
   * Obtiene los comentarios de una solicitud de tarea
   * @param taskRequestId ID de la solicitud de tarea
   * @returns Lista de comentarios
   */
  async getTaskRequestComments(taskRequestId: number): Promise<Comment[]> {
    try {
      const response = await api.get(`task-requests/${taskRequestId}/comments`).json<Comment[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener comentarios de la solicitud:', error);
      throw error;
    }
  },

  /**
   * Obtiene los comentarios de una solicitud de tarea con estado de lectura
   * @param taskRequestId ID de la solicitud de tarea
   * @returns Lista de comentarios con estado de lectura
   */
  async getTaskRequestCommentsWithReadStatus(taskRequestId: number): Promise<Comment[]> {
    try {
      const response = await api.get(`task-requests/${taskRequestId}/comments/with-read-status`).json<Comment[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener comentarios con estado de lectura:', error);
      throw error;
    }
  },

  /**
   * Agrega un comentario a una tarea
   * @param taskId ID de la tarea
   * @param comment Comentario a agregar
   * @returns Comentario creado
   */
  async addTaskComment(taskId: number, comment: CommentCreateDto): Promise<Comment> {
    try {
      const response = await api.post(`activities/${taskId}/comments`, {
        json: comment
      }).json<Comment>();
      return response;
    } catch (error) {
      console.error('Error al agregar comentario a la tarea:', error);
      throw error;
    }
  },

  /**
   * Agrega un comentario a una solicitud de tarea
   * @param taskRequestId ID de la solicitud de tarea
   * @param comment Comentario a agregar
   * @returns Comentario creado
   */
  async addTaskRequestComment(taskRequestId: number, comment: CommentCreateDto): Promise<Comment> {
    try {
      const response = await api.post(`task-requests/${taskRequestId}/comments`, {
        json: {
          taskRequestId,
          content: comment.content,
          mentions: comment.mentions
        }
      }).json<Comment>();
      return response;
    } catch (error) {
      console.error('Error al agregar comentario a la solicitud:', error);
      throw error;
    }
  },

  /**
   * Edita un comentario
   * @param commentId ID del comentario
   * @param content Nuevo contenido
   * @returns Comentario actualizado
   */
  async editComment(commentId: number, content: string): Promise<Comment> {
    try {
      const response = await api.put(`comments/${commentId}`, {
        json: { content }
      }).json<Comment>();
      return response;
    } catch (error) {
      console.error('Error al editar comentario:', error);
      throw error;
    }
  },

  /**
   * Elimina un comentario
   * @param commentId ID del comentario
   * @returns Respuesta de eliminación
   */
  async deleteComment(commentId: number): Promise<void> {
    try {
      await api.delete(`comments/${commentId}`);
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      throw error;
    }
  },

  /**
   * Marca un comentario como leído
   * @param commentId ID del comentario
   * @returns Comentario actualizado
   */
  async markAsRead(commentId: number): Promise<Comment> {
    try {
      const response = await api.post(`comments/${commentId}/read`).json<Comment>();
      return response;
    } catch (error) {
      console.error('Error al marcar comentario como leído:', error);
      throw error;
    }
  }
};

export default commentService;
