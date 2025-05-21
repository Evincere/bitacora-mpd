/**
 * @file useAuthEvents.ts
 * @description Hook personalizado para trabajar con eventos de autenticación
 */

import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './useToast';
import { authEvents } from '../events/AuthEventEmitter';
import { 
  AuthEventType, 
  AuthEventListener,
  TypedAuthEventListener,
  LoginEventData,
  LogoutEventData,
  TokenExpiredEventData,
  TokenRefreshedEventData,
  AuthErrorEventData,
  SessionExpiredEventData,
  PermissionsChangedEventData,
  UserUpdatedEventData
} from '../types/auth-events';

/**
 * Hook para suscribirse y reaccionar a eventos de autenticación
 */
export const useAuthEvents = () => {
  const navigate = useNavigate();
  const toast = useToast();

  /**
   * Suscribe un listener a todos los eventos de autenticación
   * @param listener Función que se ejecutará cuando ocurra cualquier evento
   */
  const subscribeToAll = useCallback((listener: AuthEventListener) => {
    return authEvents.subscribe(listener);
  }, []);

  /**
   * Suscribe un listener a un tipo específico de evento
   * @param eventType Tipo de evento
   * @param listener Función que se ejecutará cuando ocurra el evento
   */
  const subscribe = useCallback((eventType: AuthEventType, listener: AuthEventListener) => {
    return authEvents.on(eventType, listener);
  }, []);

  /**
   * Suscribe un listener al evento de inicio de sesión
   * @param listener Función que se ejecutará cuando ocurra el evento
   */
  const onLogin = useCallback((listener: TypedAuthEventListener<LoginEventData>) => {
    return authEvents.onLogin(listener);
  }, []);

  /**
   * Suscribe un listener al evento de cierre de sesión
   * @param listener Función que se ejecutará cuando ocurra el evento
   */
  const onLogout = useCallback((listener: TypedAuthEventListener<LogoutEventData>) => {
    return authEvents.onLogout(listener);
  }, []);

  /**
   * Suscribe un listener al evento de token expirado
   * @param listener Función que se ejecutará cuando ocurra el evento
   */
  const onTokenExpired = useCallback((listener: TypedAuthEventListener<TokenExpiredEventData>) => {
    return authEvents.onTokenExpired(listener);
  }, []);

  /**
   * Suscribe un listener al evento de token refrescado
   * @param listener Función que se ejecutará cuando ocurra el evento
   */
  const onTokenRefreshed = useCallback((listener: TypedAuthEventListener<TokenRefreshedEventData>) => {
    return authEvents.onTokenRefreshed(listener);
  }, []);

  /**
   * Suscribe un listener al evento de error de autenticación
   * @param listener Función que se ejecutará cuando ocurra el evento
   */
  const onAuthError = useCallback((listener: TypedAuthEventListener<AuthErrorEventData>) => {
    return authEvents.onAuthError(listener);
  }, []);

  /**
   * Suscribe un listener al evento de sesión expirada
   * @param listener Función que se ejecutará cuando ocurra el evento
   */
  const onSessionExpired = useCallback((listener: TypedAuthEventListener<SessionExpiredEventData>) => {
    return authEvents.onSessionExpired(listener);
  }, []);

  /**
   * Suscribe un listener al evento de cambio de permisos
   * @param listener Función que se ejecutará cuando ocurra el evento
   */
  const onPermissionsChanged = useCallback((listener: TypedAuthEventListener<PermissionsChangedEventData>) => {
    return authEvents.onPermissionsChanged(listener);
  }, []);

  /**
   * Suscribe un listener al evento de actualización de usuario
   * @param listener Función que se ejecutará cuando ocurra el evento
   */
  const onUserUpdated = useCallback((listener: TypedAuthEventListener<UserUpdatedEventData>) => {
    return authEvents.onUserUpdated(listener);
  }, []);

  /**
   * Configura listeners por defecto para manejar eventos comunes de autenticación
   * @param options Opciones de configuración
   */
  const setupDefaultListeners = useCallback((options: {
    redirectOnLogout?: boolean;
    redirectOnSessionExpired?: boolean;
    redirectOnTokenExpired?: boolean;
    showToasts?: boolean;
    logoutRedirectPath?: string;
  } = {}) => {
    const {
      redirectOnLogout = true,
      redirectOnSessionExpired = true,
      redirectOnTokenExpired = false,
      showToasts = true,
      logoutRedirectPath = '/login'
    } = options;

    const unsubscribers: Array<() => void> = [];

    // Listener para logout
    if (redirectOnLogout) {
      unsubscribers.push(
        authEvents.onLogout((data) => {
          if (showToasts) {
            toast.info('Has cerrado sesión correctamente');
          }
          navigate(logoutRedirectPath);
        })
      );
    }

    // Listener para sesión expirada
    if (redirectOnSessionExpired) {
      unsubscribers.push(
        authEvents.onSessionExpired((data) => {
          if (showToasts) {
            toast.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          }
          navigate(logoutRedirectPath);
        })
      );
    }

    // Listener para token expirado
    if (redirectOnTokenExpired) {
      unsubscribers.push(
        authEvents.onTokenExpired((data) => {
          if (showToasts) {
            toast.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          }
          navigate(logoutRedirectPath);
        })
      );
    }

    // Listener para errores de autenticación
    unsubscribers.push(
      authEvents.onAuthError((data) => {
        if (showToasts) {
          toast.error(`Error de autenticación: ${data.errorMessage}`);
        }
      })
    );

    // Listener para token refrescado
    unsubscribers.push(
      authEvents.onTokenRefreshed((data) => {
        if (showToasts && process.env.NODE_ENV === 'development') {
          toast.success('Token de autenticación actualizado correctamente');
        }
      })
    );

    // Devolver función para cancelar todas las suscripciones
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [navigate, toast]);

  return {
    subscribeToAll,
    subscribe,
    onLogin,
    onLogout,
    onTokenExpired,
    onTokenRefreshed,
    onAuthError,
    onSessionExpired,
    onPermissionsChanged,
    onUserUpdated,
    setupDefaultListeners,
    // Métodos para emitir eventos
    emitEvent: authEvents.emit.bind(authEvents),
    getEventHistory: authEvents.getHistory.bind(authEvents)
  };
};

export default useAuthEvents;
