/**
 * Enumeración de tipos de actividad
 */
export enum ActivityType {
  REUNION = 'REUNION',
  AUDIENCIA = 'AUDIENCIA',
  ENTREVISTA = 'ENTREVISTA',
  INVESTIGACION = 'INVESTIGACION',
  DICTAMEN = 'DICTAMEN',
  INFORME = 'INFORME',
  OTRO = 'OTRO'
}

/**
 * Enumeración de estados de actividad
 */
export enum ActivityStatus {
  REQUESTED = 'REQUESTED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED'
}

/**
 * Interfaz para categorías de actividad
 */
export interface ActivityCategory {
  id: number;
  name: string;
  description: string;
  color: string;
}

/**
 * Interfaz para prioridades de actividad
 */
export interface ActivityPriority {
  name: string;
  displayName: string;
  color: string;
}

/**
 * Enumeración de roles de usuario
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  USUARIO = 'USUARIO',
  CONSULTA = 'CONSULTA',
  SOLICITANTE = 'SOLICITANTE',
  ASIGNADOR = 'ASIGNADOR',
  EJECUTOR = 'EJECUTOR'
}

/**
 * Interfaz para el modelo de Usuario
 */
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  position?: string;
  department?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
  token?: string;
  tokenType?: string;
}

/**
 * Interfaz para el modelo de Actividad
 */
export interface Activity {
  id: number;
  title?: string;
  date: string;
  type?: ActivityType;
  description: string;
  person?: string;
  role?: string;
  dependency?: string;
  situation?: string;
  result?: string;
  status: ActivityStatus;
  lastStatusChangeDate?: string;
  comments?: string;
  agent?: string;
  duration?: number; // Duración en minutos
  createdAt: string;
  updatedAt: string;
  userId: number;

  // Campos adicionales para el flujo de solicitudes
  category?: string;
  priority?: string;
  dueDate?: string;
  requestDate?: string;
  requesterId?: number;
  requesterName?: string;
  assignerId?: number;
  assignerName?: string;
  executorId?: number;
  executorName?: string;
  attachments?: ActivityAttachment[];
  commentList?: ActivityComment[];
}

/**
 * Interfaz para archivos adjuntos de actividad
 */
export interface ActivityAttachment {
  id: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  downloadUrl: string;
  uploadedBy: string;
}

/**
 * Interfaz para comentarios de actividad
 */
export interface ActivityComment {
  id: number;
  activityId: number;
  userId: number;
  userName: string;
  userRole: string;
  comment: string;
  createdAt: string;
}

/**
 * Interfaz para la paginación
 */
export interface Pagination {
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

/**
 * Interfaz para las notificaciones
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  createdAt: number;
}

/**
 * Tipo para las notificaciones toast
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';
