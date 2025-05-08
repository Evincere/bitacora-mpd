/**
 * Tipos de notificaciones soportados por el sistema.
 */
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  TASK_ASSIGNMENT = 'task_assignment',
  TASK_STATUS_CHANGE = 'task_status_change',
  TASK_COMPLETED = 'task_completed',
  TASK_STARTED = 'task_started',
  TASK_REJECTED = 'task_rejected',
  TASK_APPROVED = 'task_approved',
  DEADLINE_REMINDER = 'deadline_reminder',
  ANNOUNCEMENT = 'announcement',
  COLLABORATION = 'collaboration',
  USER_CONNECTED = 'user_connected',
  USER_DISCONNECTED = 'user_disconnected'
}

/**
 * Niveles de urgencia para las notificaciones.
 */
export enum UrgencyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Interfaz base para todas las notificaciones en tiempo real.
 */
export interface RealTimeNotification {
  id: string;
  type: NotificationType | string;
  title: string;
  message: string;
  timestamp: number;
  read?: boolean;
  notificationClass?: string;
  urgency?: UrgencyLevel;
  highlight?: boolean;
}

/**
 * Interfaz para notificaciones de asignación de tareas.
 */
export interface TaskAssignmentNotification extends RealTimeNotification {
  activityId: number;
  activityTitle: string;
  assignerId: number;
  assignerName: string;
  dueDate?: number;
}

/**
 * Interfaz para notificaciones de cambio de estado de tareas.
 */
export interface TaskStatusChangeNotification extends RealTimeNotification {
  activityId: number;
  activityTitle: string;
  previousStatus: string;
  newStatus: string;
  changedById: number;
  changedByName: string;
}

/**
 * Tipos de recordatorio disponibles.
 */
export enum ReminderType {
  ONE_DAY = 'ONE_DAY',
  FOUR_HOURS = 'FOUR_HOURS',
  ONE_HOUR = 'ONE_HOUR'
}

/**
 * Interfaz para notificaciones de recordatorio de fechas límite.
 */
export interface DeadlineReminderNotification extends RealTimeNotification {
  activityId: number;
  activityTitle: string;
  dueDate: number;
  hoursRemaining: number;
  reminderType: ReminderType;
}

/**
 * Tipos de anuncio disponibles.
 */
export enum AnnouncementType {
  GLOBAL = 'GLOBAL',
  DEPARTMENTAL = 'DEPARTMENTAL',
  EVENT = 'EVENT'
}

/**
 * Interfaz para notificaciones de anuncios y comunicados.
 */
export interface AnnouncementNotification extends RealTimeNotification {
  announcementType: AnnouncementType;
  createdById: number;
  createdByName: string;
  department?: string;
  eventDate?: number;
  location?: string;
}

/**
 * Acciones de colaboración disponibles.
 */
export enum CollaborationAction {
  VIEWING = 'VIEWING',
  EDITING = 'EDITING',
  COMMENTED = 'COMMENTED'
}

/**
 * Interfaz para notificaciones de colaboración en tiempo real.
 */
export interface CollaborationNotification extends RealTimeNotification {
  activityId: number;
  activityTitle: string;
  userId: number;
  userName: string;
  action: CollaborationAction;
}

/**
 * Interfaz para notificaciones de tarea completada.
 */
export interface TaskCompletedNotification extends RealTimeNotification {
  activityId: number;
  activityTitle: string;
  completedById: number;
  completedByName: string;
  completionDate: number;
  actualHours: number;
  notes?: string;
}

/**
 * Interfaz para notificaciones de tarea iniciada.
 */
export interface TaskStartedNotification extends RealTimeNotification {
  activityId: number;
  activityTitle: string;
  startedById: number;
  startedByName: string;
  startDate: number;
  notes?: string;
}

/**
 * Interfaz para notificaciones de tarea rechazada.
 */
export interface TaskRejectedNotification extends RealTimeNotification {
  activityId: number;
  activityTitle: string;
  rejectedById: number;
  rejectedByName: string;
  rejectionDate: number;
  reason: string;
  notes?: string;
}

/**
 * Interfaz para notificaciones de tarea aprobada.
 */
export interface TaskApprovedNotification extends RealTimeNotification {
  activityId: number;
  activityTitle: string;
  approvedById: number;
  approvedByName: string;
  approvalDate: number;
  notes?: string;
}

/**
 * Interfaz para notificaciones de usuario conectado.
 */
export interface UserConnectedNotification extends RealTimeNotification {
  userId: number;
  userName: string;
  connectionTime: number;
  deviceInfo?: string;
  ipAddress?: string;
}

/**
 * Interfaz para notificaciones de usuario desconectado.
 */
export interface UserDisconnectedNotification extends RealTimeNotification {
  userId: number;
  userName: string;
  disconnectionTime: number;
  sessionDuration?: number; // en segundos
}

/**
 * Función para determinar el tipo específico de notificación.
 *
 * @param notification La notificación a verificar
 * @returns El tipo específico de notificación
 */
export function getNotificationType(notification: RealTimeNotification): string {
  if (notification.notificationClass) {
    return notification.notificationClass;
  }

  // Fallback basado en el tipo
  switch (notification.type) {
    case NotificationType.TASK_ASSIGNMENT:
      return 'TaskAssignment';
    case NotificationType.TASK_STATUS_CHANGE:
      return 'TaskStatusChange';
    case NotificationType.TASK_COMPLETED:
      return 'TaskCompleted';
    case NotificationType.TASK_STARTED:
      return 'TaskStarted';
    case NotificationType.TASK_REJECTED:
      return 'TaskRejected';
    case NotificationType.TASK_APPROVED:
      return 'TaskApproved';
    case NotificationType.DEADLINE_REMINDER:
      return 'DeadlineReminder';
    case NotificationType.ANNOUNCEMENT:
      return 'Announcement';
    case NotificationType.COLLABORATION:
      return 'Collaboration';
    case NotificationType.USER_CONNECTED:
      return 'UserConnected';
    case NotificationType.USER_DISCONNECTED:
      return 'UserDisconnected';
    default:
      return 'RealTimeNotification';
  }
}

/**
 * Función para verificar si una notificación es de un tipo específico.
 *
 * @param notification La notificación a verificar
 * @param type El tipo específico a comprobar
 * @returns true si la notificación es del tipo especificado
 */
export function isNotificationType<T extends RealTimeNotification>(
  notification: RealTimeNotification,
  type: string
): notification is T {
  return getNotificationType(notification) === type;
}

/**
 * Función para convertir una notificación genérica a un tipo específico.
 *
 * @param notification La notificación a convertir
 * @returns La notificación convertida al tipo específico
 */
export function asNotificationType<T extends RealTimeNotification>(
  notification: RealTimeNotification
): T {
  return notification as T;
}
