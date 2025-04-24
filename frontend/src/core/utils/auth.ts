import { User } from '@/core/types/models';
import { api } from '@/core/api/api';

// Constantes para almacenamiento local
const TOKEN_KEY = 'bitacora_token';
const USER_KEY = 'bitacora_user';
const REFRESH_TOKEN_KEY = 'bitacora_refresh_token';

// Funciones para manejar el token
export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log('auth.ts: Obteniendo token:', token ? `${token.substring(0, 10)}...` : 'null');
  return token;
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Funciones para manejar el refresh token
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const removeRefreshToken = (): void => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Funciones para manejar el usuario
export const getUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    console.log('auth.ts: Usuario guardado en localStorage');
  } else {
    localStorage.removeItem(USER_KEY);
    console.log('auth.ts: Usuario eliminado de localStorage');
  }
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Función para refrescar el token
export const refreshToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await api.post('auth/refresh', {
      json: { refreshToken }
    }).json<{ token: string; refreshToken: string }>();

    setToken(response.token);
    setRefreshToken(response.refreshToken);
    return response.token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Si hay un error al refrescar el token, limpiar el almacenamiento
    removeToken();
    removeRefreshToken();
    removeUser();
    return null;
  }
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  return !!getToken() && !!getUser();
};

// Función para limpiar todos los datos de autenticación
export const clearAuth = (): void => {
  removeToken();
  removeRefreshToken();
  removeUser();
};
