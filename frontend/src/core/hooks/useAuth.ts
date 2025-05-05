/**
 * @file Hook personalizado para gestionar la autenticación de usuarios.
 * @module core/hooks/useAuth
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clearAuth, setToken, setRefreshToken, setUser } from '@/core/utils/auth';
import { api, AUTH_URL } from '@/core/api/api';
import { User, UserRole } from '@/core/types/models';
import { toast } from 'react-toastify';
import { setUser as setUserAction } from '@/features/auth/store/authSlice';
// Importación de ky eliminada para usar fetch directamente

/**
 * Credenciales para iniciar sesión.
 *
 * @interface LoginCredentials
 * @property {string} username - Nombre de usuario
 * @property {string} password - Contraseña del usuario
 */
interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Respuesta del servidor al iniciar sesión.
 *
 * @interface LoginResponse
 * @property {string} token - Token JWT de acceso
 * @property {string} refreshToken - Token de actualización para renovar el token de acceso
 * @property {string} tokenType - Tipo de token (ej: 'Bearer')
 * @property {number} userId - ID del usuario autenticado
 * @property {string} username - Nombre de usuario
 * @property {string} name - Nombre completo del usuario (campo legacy)
 * @property {string} firstName - Nombre del usuario
 * @property {string} lastName - Apellido del usuario
 * @property {string} fullName - Nombre completo del usuario
 * @property {string} email - Correo electrónico del usuario
 * @property {string[]} roles - Roles del usuario
 */
interface LoginResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  username: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  roles?: string[];
  role?: string;
  permissions?: string[];
}

/**
 * Hook personalizado para gestionar la autenticación de usuarios.
 * Proporciona funciones para iniciar y cerrar sesión, así como estados relacionados.
 *
 * @returns {Object} Objeto con funciones y estados de autenticación
 * @returns {(credentials: LoginCredentials) => void} login - Función para iniciar sesión
 * @returns {() => void} logout - Función para cerrar sesión
 * @returns {boolean} isLoggingIn - Indica si se está procesando el inicio de sesión
 * @returns {boolean} isLoggingOut - Indica si se está procesando el cierre de sesión
 * @returns {Error | null} error - Error de autenticación, si existe
 *
 * @example
 * ```tsx
 * const { login, logout, isLoggingIn, error } = useAuth();
 *
 * const handleLogin = (event) => {
 *   event.preventDefault();
 *   login({ username, password });
 * };
 * ```
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  // Usar toast directamente desde react-toastify

  // Mutación para iniciar sesión
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      console.log('Intentando iniciar sesión con:', { username: credentials.username, password: credentials.password });
      console.log('URL de login:', `${AUTH_URL}/login`);

      // Usar la URL relativa para que el proxy funcione correctamente
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error(`Error en login: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Respuesta de login:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Login exitoso, datos recibidos:', data);

      // Guardar datos de autenticación
      setToken(data.token);
      console.log('Token guardado:', data.token);

      if (data.refreshToken) {
        setRefreshToken(data.refreshToken);
        console.log('RefreshToken guardado:', data.refreshToken);
      } else {
        console.warn('No se recibió refreshToken del servidor');
      }

      // Verificar la estructura de los datos recibidos
      console.log('Estructura de datos recibidos:', {
        userId: data.userId,
        username: data.username,
        email: data.email,
        name: data.name,
        roles: data.roles
      });

      // Depuración de la respuesta del servidor
      console.log('Respuesta completa del servidor:', data);
      console.log('Rol recibido del servidor:', data.role);

      // Determinar el rol correcto
      let userRole = UserRole.USUARIO;
      if (data.role === 'ADMIN') userRole = UserRole.ADMIN;
      else if (data.role === 'ASIGNADOR') userRole = UserRole.ASIGNADOR;
      else if (data.role === 'SOLICITANTE') userRole = UserRole.SOLICITANTE;
      else if (data.role === 'EJECUTOR') userRole = UserRole.EJECUTOR;
      else if (data.role === 'SUPERVISOR') userRole = UserRole.SUPERVISOR;
      else if (data.role === 'CONSULTA') userRole = UserRole.CONSULTA;

      console.log('Rol mapeado:', userRole);

      // Crear objeto de usuario a partir de los datos recibidos
      const user: User = {
        id: data.userId,
        username: data.username,
        email: data.email,
        firstName: data.firstName || (data.name ? data.name.split(' ')[0] : ''),
        lastName: data.lastName || (data.name ? data.name.split(' ').slice(1).join(' ') : ''),
        fullName: data.fullName || data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.username,
        role: userRole,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: data.permissions || [],
        token: data.token,
        tokenType: data.tokenType
      };

      console.log('Objeto de usuario creado:', user);

      setUser(user);
      console.log('Usuario guardado en localStorage');

      // Actualizar estado global
      dispatch(setUserAction(user));
      console.log('Estado global actualizado con el usuario');

      // Mostrar mensaje de éxito
      toast.success('Bienvenido - Sesión iniciada correctamente');

      // Redirigir al dashboard
      console.log('useAuth: Redirigiendo a /app después de login exitoso');

      // Verificar que el token se haya guardado correctamente
      const savedToken = localStorage.getItem('bitacora_token');
      console.log('Token guardado en localStorage:', !!savedToken, savedToken ? savedToken.substring(0, 20) + '...' : '');

      // Verificar que el usuario se haya guardado correctamente
      const savedUser = localStorage.getItem('bitacora_user');
      console.log('Usuario guardado en localStorage:', !!savedUser, savedUser ? 'Datos completos' : '');

      // Redirigir inmediatamente a /app usando React Router
      console.log('Redirigiendo a /app con navigate');
      navigate('/app', { replace: true });

      // Como respaldo, intentar también con window.location después de un breve retraso
      setTimeout(() => {
        if (window.location.pathname === '/login') {
          console.log('Redirección con navigate no funcionó, intentando con window.location');
          window.location.href = '/app';
        }
      }, 100);
    },
    onError: (error: any) => {
      console.error('Error de autenticación:', error);
      let message = 'Error al iniciar sesión';

      // Intentar extraer el mensaje de error de diferentes formatos de respuesta
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      }

      toast.error(`Error de autenticación: ${message}`);
    }
  });

  // Mutación para cerrar sesión
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('bitacora_token');
      if (token) {
        try {
          await api.post('auth/logout', null, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error('Error al cerrar sesión en el servidor:', error);
        }
      }
      return true;
    },
    onSuccess: () => {
      // Limpiar datos de autenticación
      clearAuth();

      // Invalidar todas las consultas
      queryClient.clear();

      // Mostrar mensaje de éxito
      toast.info('Hasta pronto - Sesión cerrada correctamente');

      // Redirigir a la página de login
      navigate('/login');
    },
    onError: (error: any) => {
      console.error('Error al cerrar sesión:', error);
      // Incluso si hay un error, limpiar los datos locales
      clearAuth();
      queryClient.clear();
      navigate('/login');
    }
  });

  /**
   * Inicia sesión con las credenciales proporcionadas.
   *
   * @param {LoginCredentials} credentials - Credenciales de usuario (nombre y contraseña)
   */
  const login = useCallback((credentials: LoginCredentials) => {
    loginMutation.mutate(credentials);
  }, [loginMutation]);

  /**
   * Cierra la sesión actual del usuario.
   * Elimina los tokens de autenticación, limpia la caché y redirige al login.
   */
  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  return {
    login,
    logout,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    error: loginMutation.error
  };
};
