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
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
  ARCHIVADA = 'ARCHIVADA'
}

/**
 * Enumeración de roles de usuario
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  USUARIO = 'USUARIO',
  CONSULTA = 'CONSULTA'
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
  date: string;
  type: ActivityType;
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
