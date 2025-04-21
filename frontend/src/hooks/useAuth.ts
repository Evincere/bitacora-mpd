import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import authService from '@/features/auth/authService';
import { LoginCredentials, AuthResponse } from '@/types/api';
import { useAppDispatch } from '@/store';
import { addNotification } from '@/store/uiSlice';

/**
 * Hook para manejar la autenticación
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  /**
   * Mutación para iniciar sesión
   */
  const loginMutation = useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Guardar datos en localStorage
      localStorage.setItem('user', JSON.stringify(data));

      // Mostrar notificación de éxito
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Inicio de sesión exitoso',
        message: '¡Bienvenido de nuevo!',
        createdAt: Date.now()
      }));

      // Recargar la página para actualizar el estado de autenticación
      // o redirigir al dashboard
      navigate('/app');
    },
    onError: (error: Error) => {
      // Mostrar notificación de error
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error de inicio de sesión',
        message: error.message || 'Credenciales inválidas',
        createdAt: Date.now()
      }));
    }
  });

  /**
   * Función para cerrar sesión
   */
  const logout = () => {
    // Eliminar datos de localStorage
    authService.logout();

    // Mostrar notificación
    dispatch(addNotification({
      id: Date.now().toString(),
      type: 'info',
      title: 'Sesión cerrada',
      message: 'Has cerrado sesión correctamente',
      createdAt: Date.now()
    }));

    // Redirigir al login
    navigate('/login');
  };

  return {
    login: loginMutation.mutate,
    logout,
    isPending: loginMutation.isPending,
    error: loginMutation.error
  };
};
