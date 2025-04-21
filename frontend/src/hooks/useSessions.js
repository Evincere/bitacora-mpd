import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import sessionService from '@/services/sessionService';
import { useToast } from '@/hooks/useToast';

/**
 * Hook personalizado para gestionar las sesiones de usuario
 */
export const useSessions = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  // Obtener sesiones activas
  const {
    data: activeSessions = [],
    isLoading: isLoadingActiveSessions,
    isError: isErrorActiveSessions,
    error: activeSessionsError,
    refetch: refetchActiveSessions,
  } = useQuery({
    queryKey: ['activeSessions'],
    queryFn: sessionService.getActiveSessions,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Obtener todas las sesiones
  const {
    data: allSessions = [],
    isLoading: isLoadingAllSessions,
    isError: isErrorAllSessions,
    error: allSessionsError,
    refetch: refetchAllSessions,
  } = useQuery({
    queryKey: ['allSessions'],
    queryFn: sessionService.getAllSessions,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Cerrar una sesión específica
  const closeSessionMutation = useMutation({
    mutationFn: sessionService.closeSession,
    onSuccess: () => {
      toast.success('Sesión cerrada correctamente', 'Sesiones');
      // Invalidar consultas para actualizar los datos
      queryClient.invalidateQueries({ queryKey: ['activeSessions'] });
      queryClient.invalidateQueries({ queryKey: ['allSessions'] });
    },
    onError: (error) => {
      toast.error(`Error al cerrar la sesión: ${error.message}`, 'Sesiones');
    },
  });

  // Cerrar todas las sesiones excepto la actual
  const closeOtherSessionsMutation = useMutation({
    mutationFn: sessionService.closeOtherSessions,
    onSuccess: (data) => {
      toast.success(`${data.message || 'Sesiones cerradas correctamente'}`, 'Sesiones');
      // Invalidar consultas para actualizar los datos
      queryClient.invalidateQueries({ queryKey: ['activeSessions'] });
      queryClient.invalidateQueries({ queryKey: ['allSessions'] });
    },
    onError: (error) => {
      toast.error(`Error al cerrar otras sesiones: ${error.message}`, 'Sesiones');
    },
  });

  return {
    // Datos
    activeSessions,
    allSessions,
    
    // Estados de carga
    isLoadingActiveSessions,
    isLoadingAllSessions,
    
    // Estados de error
    isErrorActiveSessions,
    isErrorAllSessions,
    activeSessionsError,
    allSessionsError,
    
    // Funciones para refrescar datos
    refetchActiveSessions,
    refetchAllSessions,
    
    // Funciones para cerrar sesiones
    closeSession: closeSessionMutation.mutate,
    closeOtherSessions: closeOtherSessionsMutation.mutate,
    
    // Estados de las mutaciones
    isClosingSession: closeSessionMutation.isPending,
    isClosingOtherSessions: closeOtherSessionsMutation.isPending,
  };
};
