/**
 * @file auth-events.ts
 * @description Tipos para el sistema de eventos de autenticación
 */

/**
 * Tipos de eventos de autenticación
 */
export enum AuthEventType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  TOKEN_EXPIRED = 'tokenExpired',
  TOKEN_REFRESHED = 'tokenRefreshed',
  AUTH_ERROR = 'authError',
  SESSION_EXPIRED = 'sessionExpired',
  PERMISSIONS_CHANGED = 'permissionsChanged',
  USER_UPDATED = 'userUpdated'
}

/**
 * Interfaz base para los datos de eventos de autenticación
 */
export interface AuthEventData {
  timestamp: number;
}

/**
 * Datos para el evento de inicio de sesión
 */
export interface LoginEventData extends AuthEventData {
  userId: number;
  username: string;
  role: string;
  permissions: string[];
  token?: string;
}

/**
 * Datos para el evento de cierre de sesión
 */
export interface LogoutEventData extends AuthEventData {
  userId?: number;
  username?: string;
  reason?: 'user_initiated' | 'session_expired' | 'token_expired' | 'security_violation' | 'system';
}

/**
 * Datos para el evento de token expirado
 */
export interface TokenExpiredEventData extends AuthEventData {
  userId?: number;
  username?: string;
  tokenExpirationTime: number;
}

/**
 * Datos para el evento de token refrescado
 */
export interface TokenRefreshedEventData extends AuthEventData {
  userId: number;
  username: string;
  newExpirationTime: number;
  oldToken?: string;
  newToken?: string;
}

/**
 * Datos para el evento de error de autenticación
 */
export interface AuthErrorEventData extends AuthEventData {
  errorCode?: number;
  errorMessage: string;
  errorType: 'credentials' | 'token' | 'network' | 'server' | 'permissions' | 'unknown';
  attemptedAction?: 'login' | 'refresh' | 'validate' | 'access';
  userId?: number;
  username?: string;
}

/**
 * Datos para el evento de sesión expirada
 */
export interface SessionExpiredEventData extends AuthEventData {
  userId?: number;
  username?: string;
  sessionId?: string;
  lastActiveTime?: number;
}

/**
 * Datos para el evento de cambio de permisos
 */
export interface PermissionsChangedEventData extends AuthEventData {
  userId: number;
  username: string;
  oldPermissions: string[];
  newPermissions: string[];
}

/**
 * Datos para el evento de actualización de usuario
 */
export interface UserUpdatedEventData extends AuthEventData {
  userId: number;
  username: string;
  updatedFields: string[];
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
}

/**
 * Tipo unión para todos los datos de eventos de autenticación
 */
export type AuthEventDataType = 
  | LoginEventData
  | LogoutEventData
  | TokenExpiredEventData
  | TokenRefreshedEventData
  | AuthErrorEventData
  | SessionExpiredEventData
  | PermissionsChangedEventData
  | UserUpdatedEventData;

/**
 * Interfaz para los listeners de eventos de autenticación
 */
export interface AuthEventListener {
  (eventType: AuthEventType, data: AuthEventDataType): void;
}

/**
 * Interfaz para los listeners específicos de eventos de autenticación
 */
export interface TypedAuthEventListener<T extends AuthEventDataType> {
  (data: T): void;
}
