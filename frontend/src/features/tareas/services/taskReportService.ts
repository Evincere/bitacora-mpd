import { api } from '@/core/api/api';

// Interfaces
export interface TaskHistory {
  id: number;
  date: string;
  previousStatus: string;
  newStatus: string;
  userId: number;
  userName: string;
  notes?: string;
}

export interface TaskComment {
  id: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  downloadUrl: string;
  uploadedBy: string;
}

export interface TaskReportData {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  dueDate: string;
  requestDate: string;
  completionDate?: string;
  requesterName: string;
  assignerId?: number;
  assignerName: string;
  executorId?: number;
  executorName: string;
  timeSpent?: number; // en días
  approvalComment?: string;
  rejectionReason?: string;
  history: TaskHistory[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
}

/**
 * Servicio para obtener datos detallados de informes de tareas
 */
const taskReportService = {
  /**
   * Obtiene un informe detallado de una tarea
   * @param taskId ID de la tarea
   * @returns Datos detallados del informe
   */
  async getTaskReport(taskId: number): Promise<TaskReportData> {
    try {
      // Obtener los detalles básicos de la tarea
      const taskDetails = await api.get(`task-requests/${taskId}`).json();
      
      // Obtener el historial de la tarea
      const taskHistory = await api.get(`task-requests/${taskId}/history`).json();
      
      // Obtener los comentarios de la tarea
      const taskComments = await api.get(`task-requests/${taskId}/comments`).json();
      
      // Obtener los archivos adjuntos de la tarea
      const taskAttachments = await api.get(`task-requests/${taskId}/attachments`).json();
      
      // Calcular el tiempo dedicado (en días)
      let timeSpent = 0;
      if (taskDetails.requestDate && taskDetails.completionDate) {
        const requestDate = new Date(taskDetails.requestDate);
        const completionDate = new Date(taskDetails.completionDate);
        const diffTime = Math.abs(completionDate.getTime() - requestDate.getTime());
        timeSpent = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      
      // Mapear los datos al formato requerido
      const reportData: TaskReportData = {
        id: taskDetails.id,
        title: taskDetails.title,
        description: taskDetails.description,
        category: taskDetails.category?.name || 'Sin categoría',
        priority: taskDetails.priority,
        status: taskDetails.status,
        dueDate: taskDetails.dueDate,
        requestDate: taskDetails.requestDate,
        completionDate: taskDetails.completionDate,
        requesterName: taskDetails.requesterName,
        assignerId: taskDetails.assignerId,
        assignerName: taskDetails.assignerName,
        executorId: taskDetails.executorId,
        executorName: taskDetails.executorName,
        timeSpent,
        approvalComment: taskDetails.approvalComment,
        rejectionReason: taskDetails.rejectionReason,
        
        // Mapear el historial
        history: taskHistory.map((item: any) => ({
          id: item.id,
          date: item.createdAt,
          previousStatus: item.previousStatus,
          newStatus: item.newStatus,
          userId: item.userId,
          userName: item.userName,
          notes: item.notes
        })),
        
        // Mapear los comentarios
        comments: taskComments.map((comment: any) => ({
          id: comment.id,
          userId: comment.userId,
          userName: comment.userName,
          content: comment.content,
          createdAt: comment.createdAt
        })),
        
        // Mapear los archivos adjuntos
        attachments: taskAttachments.map((attachment: any) => ({
          id: attachment.id,
          fileName: attachment.fileName,
          fileSize: attachment.fileSize,
          fileType: attachment.fileType,
          uploadDate: attachment.uploadedAt,
          downloadUrl: `/api/task-requests/attachments/${attachment.id}/download`,
          uploadedBy: attachment.userName || 'Usuario'
        }))
      };
      
      return reportData;
    } catch (error) {
      console.error('Error al obtener el informe de la tarea:', error);
      throw error;
    }
  },
  
  /**
   * Descarga un archivo adjunto
   * @param attachmentId ID del archivo adjunto
   */
  async downloadAttachment(attachmentId: number): Promise<void> {
    try {
      window.open(`/api/task-requests/attachments/${attachmentId}/download`, '_blank');
    } catch (error) {
      console.error('Error al descargar el archivo adjunto:', error);
      throw error;
    }
  }
};

export default taskReportService;
