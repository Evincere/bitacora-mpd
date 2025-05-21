import { AuthResponse, LoginCredentials } from '@/types/api';
import tokenService from '@/core/utils/tokenService';
import errorHandlingService, { ApiError } from '@/core/utils/errorHandlingService';
import apiClient from '@/core/api/apiClient';
import { toast } from 'react-toastify';
import { authEvents } from '@/core/events/AuthEventEmitter';
import { AuthEventType } from '@/core/types/auth-events';

// Constante para la clave de almacenamiento del usuario
const USER_KEY = 'bitacora_user';

/**
 * Inicia sesión con las credenciales proporcionadas
 * @param credentials Credenciales de inicio de sesión
 * @returns Datos del usuario autenticado
 */
const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  console.log('Intentando iniciar sesión con:', credentials);
  console.log('URL de login:', '/api/auth/login');

  try {
    // Usar el cliente HTTP con manejo automático de errores
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials, { skipAuth: true });

    console.log('Respuesta de login:', response);
    toast.success('Inicio de sesión exitoso');

    if (response) {
      // Guardar tokens usando el servicio de tokens
      tokenService.setToken(response.token);

      // Si hay refreshToken en la respuesta, guardarlo
      if (response.refreshToken) {
        tokenService.setRefreshToken(response.refreshToken);
      }

      // Guardar datos del usuario
      let permissions = response.permissions || [];

      // Asegurarse de que el usuario tenga los permisos necesarios según su rol
      if (response.role === 'SOLICITANTE' && !permissions.includes('REQUEST_ACTIVITIES')) {
        console.log('Añadiendo permiso REQUEST_ACTIVITIES al usuario SOLICITANTE');
        permissions = [...permissions, 'REQUEST_ACTIVITIES'];
      }

      const userData = {
        id: response.userId,
        username: response.username,
        name: response.fullName,
        email: response.email,
        role: response.role, // Guardar el rol como un valor único
        permissions: permissions // Guardar los permisos actualizados
      };

      // Depuración
      console.log('authService: Datos del usuario a guardar en localStorage:', userData);

      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      // Verificar que los datos se hayan guardado correctamente
      const token = tokenService.getToken();
      const savedUser = localStorage.getItem(USER_KEY);

      console.log('Datos guardados:');
      console.log('- Token guardado:', !!token);
      console.log('- Usuario guardado:', !!savedUser);

      // Si no se guardaron los datos correctamente, lanzar un error
      if (!token || !savedUser) {
        throw new Error('No se pudieron guardar los datos de autenticación');
      }

      // Verificar si el token es válido y no ha expirado
      if (tokenService.isTokenExpired(response.token)) {
        console.warn('El token recibido ya ha expirado');
      } else {
        const expirationTime = tokenService.getTokenExpirationTime();
        console.log(`El token expirará en ${expirationTime} segundos`);
      }

      // Emitir evento de login exitoso
      authEvents.emit(AuthEventType.LOGIN, {
        timestamp: Date.now(),
        userId: response.userId,
        username: response.username,
        role: response.role,
        permissions: permissions
      });
    }

    return response;
  } catch (error) {
    console.error('Error en login:', error);

    // Emitir evento de error de autenticación
    const apiError = error as ApiError;
    authEvents.emit(AuthEventType.AUTH_ERROR, {
      timestamp: Date.now(),
      errorCode: apiError.status || 500,
      errorMessage: apiError.message || 'Error desconocido al iniciar sesión',
      errorType: 'credentials',
      attemptedAction: 'login',
      username: credentials.username
    });

    throw error;
  }
};

/**
 * Cierra la sesión del usuario actual
 * @param sendRequest Indica si se debe enviar una petición al servidor para invalidar el token
 * @returns Promesa que se resuelve cuando se completa el cierre de sesión
 */
const logout = async (sendRequest: boolean = true): Promise<void> => {
  try {
    // Si se debe enviar una petición al servidor
    if (sendRequest) {
      const token = tokenService.getToken();

      if (token) {
        // Usar el cliente HTTP con manejo automático de errores
        await apiClient.post('/auth/logout', {});
        toast.info('Sesión cerrada correctamente');
      }
    }
  } catch (error) {
    console.error('Error al cerrar sesión en el servidor:', error);
    // No mostrar error al usuario, ya que de todas formas se limpiará la sesión localmente
  } finally {
    // Obtener datos del usuario antes de limpiar
    const userJson = localStorage.getItem(USER_KEY);
    let userId: number | undefined;
    let username: string | undefined;

    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        userId = userData.id;
        username = userData.username;
      } catch (e) {
        console.error('Error al parsear datos de usuario:', e);
      }
    }

    // Limpiar tokens y datos de usuario localmente
    tokenService.clearTokens();
    localStorage.removeItem(USER_KEY);

    // Emitir evento de logout
    authEvents.emit(AuthEventType.LOGOUT, {
      timestamp: Date.now(),
      userId,
      username,
      reason: 'user_initiated'
    });

    // Redirigir al login si no estamos ya en esa página
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
};

const authService = {
  login,
  logout,
};

export default authService;
