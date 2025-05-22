/**
 * @file tokenService.ts
 * @description Servicio para la gestión segura de tokens JWT
 */

import { authEvents } from '../events/AuthEventEmitter';
import { AuthEventType } from '../types/auth-events';

// Constantes para las claves de almacenamiento
const TOKEN_KEY = 'bitacora_token';
const REFRESH_TOKEN_KEY = 'bitacora_refresh_token';
const USER_KEY = 'bitacora_user';

// Interfaz para el token decodificado
interface DecodedToken {
  exp: number;
  sub: string;
  id: number;
  authorities: string[];
  [key: string]: any;
}

/**
 * Decodifica un token JWT sin verificar la firma
 * @param token Token JWT a decodificar
 * @returns Payload del token decodificado o null si el token no es válido
 */
const decodeToken = (token: string): DecodedToken | null => {
  try {
    // Dividir el token en sus partes: header, payload, signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decodificar el payload (segunda parte)
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};

/**
 * Verifica si un token ha expirado
 * @param token Token JWT a verificar
 * @returns true si el token ha expirado, false en caso contrario
 */
const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  // Obtener la fecha de expiración del token (en segundos)
  const expirationDate = decoded.exp * 1000; // Convertir a milisegundos
  const currentDate = Date.now();

  const isExpired = currentDate >= expirationDate;

  // Si el token ha expirado, emitir un evento
  if (isExpired) {
    authEvents.emit(AuthEventType.TOKEN_EXPIRED, {
      timestamp: Date.now(),
      userId: decoded.id,
      username: decoded.sub,
      tokenExpirationTime: expirationDate
    });
  }

  return isExpired;
};

/**
 * Obtiene el token JWT del almacenamiento
 * @returns Token JWT o null si no existe
 */
const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log('tokenService.getToken:', token ? `${token.substring(0, 20)}...` : 'null');
  return token;
};

/**
 * Obtiene el token de refresco del almacenamiento
 * @returns Token de refresco o null si no existe
 */
const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Guarda el token JWT en el almacenamiento
 * @param token Token JWT a guardar
 */
const setToken = (token: string): void => {
  const oldToken = localStorage.getItem(TOKEN_KEY);
  localStorage.setItem(TOKEN_KEY, token);

  // Si había un token anterior y es diferente al nuevo, emitir evento de token refrescado
  if (oldToken && oldToken !== token) {
    const decoded = decodeToken(token);
    if (decoded) {
      authEvents.emit(AuthEventType.TOKEN_REFRESHED, {
        timestamp: Date.now(),
        userId: decoded.id,
        username: decoded.sub,
        newExpirationTime: decoded.exp * 1000,
        oldToken: oldToken,
        newToken: token
      });
    }
  }
};

/**
 * Guarda el token de refresco en el almacenamiento
 * @param refreshToken Token de refresco a guardar
 */
const setRefreshToken = (refreshToken: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Elimina todos los tokens del almacenamiento
 */
const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Verifica si el usuario está autenticado
 * @returns true si el usuario está autenticado, false en caso contrario
 */
const isAuthenticated = (): boolean => {
  const token = getToken();
  const authenticated = !!token && !isTokenExpired(token);
  console.log('tokenService.isAuthenticated:', authenticated);
  return authenticated;
};

/**
 * Obtiene el tiempo restante en segundos antes de que expire el token
 * @returns Tiempo restante en segundos o 0 si el token ha expirado o no existe
 */
const getTokenExpirationTime = (): number => {
  const token = getToken();
  if (!token) return 0;

  const decoded = decodeToken(token);
  if (!decoded) return 0;

  const expirationDate = decoded.exp * 1000; // Convertir a milisegundos
  const currentDate = Date.now();

  return Math.max(0, Math.floor((expirationDate - currentDate) / 1000));
};

/**
 * Obtiene el ID del usuario del token
 * @returns ID del usuario o null si el token no existe o no es válido
 */
const getUserIdFromToken = (): number | null => {
  const token = getToken();
  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded?.id || null;
};

/**
 * Obtiene los permisos del usuario del token
 * @returns Array de permisos o array vacío si el token no existe o no es válido
 */
const getPermissionsFromToken = (): string[] => {
  const token = getToken();
  if (!token) return [];

  const decoded = decodeToken(token);
  return decoded?.authorities || [];
};

// Exportar el servicio
const tokenService = {
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  clearTokens,
  isAuthenticated,
  isTokenExpired,
  decodeToken,
  getTokenExpirationTime,
  getUserIdFromToken,
  getPermissionsFromToken
};

export default tokenService;
