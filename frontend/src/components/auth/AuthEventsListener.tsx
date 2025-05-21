/**
 * @file AuthEventsListener.tsx
 * @description Componente que escucha eventos de autenticación y reacciona a ellos
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/core/hooks/useToast';
import { useAuthEvents } from '@/core/hooks/useAuthEvents';
import { AuthEventType } from '@/core/types/auth-events';
import { useAppDispatch } from '@/core/store';
import { logout as logoutAction } from '@/features/auth/store/authSlice';

interface AuthEventsListenerProps {
  showToasts?: boolean;
  redirectOnLogout?: boolean;
  redirectOnSessionExpired?: boolean;
  redirectOnTokenExpired?: boolean;
  logoutRedirectPath?: string;
}

/**
 * Componente que escucha eventos de autenticación y reacciona a ellos
 * @param props Propiedades del componente
 * @returns Componente React
 */
const AuthEventsListener: React.FC<AuthEventsListenerProps> = ({
  showToasts = true,
  redirectOnLogout = true,
  redirectOnSessionExpired = true,
  redirectOnTokenExpired = false,
  logoutRedirectPath = '/login'
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const { subscribe } = useAuthEvents();

  useEffect(() => {
    // Suscribirse a eventos de autenticación
    const unsubscribeLogin = subscribe(AuthEventType.LOGIN, (eventType, data) => {
      if (showToasts) {
        toast.success(`Bienvenido, ${data.username}`);
      }
      console.log('Evento de login:', data);
    });

    const unsubscribeLogout = subscribe(AuthEventType.LOGOUT, (eventType, data) => {
      if (showToasts) {
        toast.info('Has cerrado sesión correctamente');
      }
      
      // Actualizar el estado global
      dispatch(logoutAction());
      
      // Redirigir si es necesario
      if (redirectOnLogout) {
        navigate(logoutRedirectPath);
      }
      
      console.log('Evento de logout:', data);
    });

    const unsubscribeTokenExpired = subscribe(AuthEventType.TOKEN_EXPIRED, (eventType, data) => {
      if (showToasts) {
        toast.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
      
      // Actualizar el estado global
      dispatch(logoutAction());
      
      // Redirigir si es necesario
      if (redirectOnTokenExpired) {
        navigate(logoutRedirectPath);
      }
      
      console.log('Evento de token expirado:', data);
    });

    const unsubscribeSessionExpired = subscribe(AuthEventType.SESSION_EXPIRED, (eventType, data) => {
      if (showToasts) {
        toast.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
      
      // Actualizar el estado global
      dispatch(logoutAction());
      
      // Redirigir si es necesario
      if (redirectOnSessionExpired) {
        navigate(logoutRedirectPath);
      }
      
      console.log('Evento de sesión expirada:', data);
    });

    const unsubscribeAuthError = subscribe(AuthEventType.AUTH_ERROR, (eventType, data) => {
      if (showToasts) {
        toast.error(`Error de autenticación: ${data.errorMessage}`);
      }
      console.log('Evento de error de autenticación:', data);
    });

    const unsubscribeTokenRefreshed = subscribe(AuthEventType.TOKEN_REFRESHED, (eventType, data) => {
      if (showToasts && process.env.NODE_ENV === 'development') {
        toast.success('Token de autenticación actualizado correctamente');
      }
      console.log('Evento de token refrescado:', data);
    });

    // Limpiar suscripciones al desmontar
    return () => {
      unsubscribeLogin();
      unsubscribeLogout();
      unsubscribeTokenExpired();
      unsubscribeSessionExpired();
      unsubscribeAuthError();
      unsubscribeTokenRefreshed();
    };
  }, [
    subscribe, 
    toast, 
    navigate, 
    dispatch, 
    showToasts, 
    redirectOnLogout, 
    redirectOnSessionExpired, 
    redirectOnTokenExpired, 
    logoutRedirectPath
  ]);

  // Este componente no renderiza nada visible
  return null;
};

export default AuthEventsListener;
