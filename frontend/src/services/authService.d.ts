import { AuthResponse } from '@/types/api';

declare const authService: {
  /**
   * Inicia sesión con nombre de usuario y contraseña
   * @param credentials - Credenciales de usuario
   * @returns Datos del usuario y token
   */
  login: (credentials: { username: string; password: string }) => Promise<AuthResponse>;

  /**
   * Cierra la sesión del usuario
   * @returns Respuesta del servidor o void
   */
  logout: () => Promise<any> | void;

  /**
   * Verifica si el usuario está autenticado
   * @returns true si el usuario está autenticado
   */
  isAuthenticated: () => boolean;

  /**
   * Obtiene los datos del usuario actual
   * @returns Datos del usuario o null si no hay usuario autenticado
   */
  getCurrentUser: () => any | null;

  /**
   * Refresca el token de acceso usando el token de refresco
   * @returns Nuevo token de acceso
   */
  refreshToken: () => Promise<any>;
};

export default authService;
