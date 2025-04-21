import { Activity, User } from './models';

/**
 * Interfaz para las credenciales de inicio de sesión
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Interfaz para la respuesta de autenticación
 */
export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  permissions: string[];
}

/**
 * Interfaz para la creación de una actividad
 */
export interface ActivityCreateRequest {
  date: string;
  type: string;
  description: string;
  person?: string;
  role?: string;
  dependency?: string;
  situation?: string;
  result?: string;
  status: string;
  comments?: string;
  agent?: string;
}

/**
 * Interfaz para la actualización de una actividad
 */
export interface ActivityUpdateRequest {
  date?: string;
  type?: string;
  description?: string;
  person?: string;
  role?: string;
  dependency?: string;
  situation?: string;
  result?: string;
  status?: string;
  comments?: string;
  agent?: string;
}

/**
 * Interfaz para la respuesta de actividades paginadas
 */
export interface ActivitiesResponse {
  activities: Activity[];
  totalCount: number;

  // Propiedades adicionales para compatibilidad con respuestas de Spring
  content?: Activity[];
  totalElements?: number;
  totalPages?: number;
  currentPage?: number;
  size?: number;
  number?: number;
}

/**
 * Interfaz para la creación de un usuario
 */
export interface UserCreateRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  position?: string;
  department?: string;
  permissions?: string[];
}

/**
 * Interfaz para la actualización de un usuario
 */
export interface UserUpdateRequest {
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  position?: string;
  department?: string;
  active?: boolean;
  permissions?: string[];
}

/**
 * Interfaz para la respuesta de usuarios paginados
 */
export interface UsersResponse {
  users: User[];
  totalCount: number;
}

/**
 * Interfaz para errores de API
 */
export interface ApiError {
  status: number;
  error: string;
  message: string;
  path: string;
  details?: {
    details?: string[];
    [key: string]: any;
  };
  timestamp?: string;
}

/**
 * Interfaz para parámetros de consulta de actividades
 */
export interface ActivityQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;

  // Índice de firma para permitir acceso dinámico a propiedades
  [key: string]: string | number | undefined;
}
