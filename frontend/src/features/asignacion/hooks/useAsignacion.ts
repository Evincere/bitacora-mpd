import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import asignacionService, { AsignacionRequest } from '../services/asignacionService';

/**
 * Hook personalizado para gestionar asignaciones
 */
export const useAsignacion = () => {
  const queryClient = useQueryClient();

  // Obtener solicitudes pendientes
  const {
    data: pendingRequests,
    isLoading: isLoadingPendingRequests,
    error: pendingRequestsError,
    refetch: refetchPendingRequests
  } = useQuery({
    queryKey: ['pendingRequests'],
    queryFn: asignacionService.getPendingRequests,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Obtener tareas asignadas por ejecutor
  const {
    data: assignedTasksByExecutor,
    isLoading: isLoadingAssignedTasks,
    error: assignedTasksError,
    refetch: refetchAssignedTasks
  } = useQuery({
    queryKey: ['assignedTasksByExecutor'],
    queryFn: asignacionService.getAssignedTasksByExecutor,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Obtener distribución de carga
  const {
    data: workloadDistribution,
    isLoading: isLoadingWorkload,
    error: workloadError,
    refetch: refetchWorkload
  } = useQuery({
    queryKey: ['workloadDistribution'],
    queryFn: asignacionService.getWorkloadDistribution,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Obtener ejecutores disponibles
  const {
    data: availableExecutors,
    isLoading: isLoadingExecutors,
    error: executorsError
  } = useQuery({
    queryKey: ['availableExecutors'],
    queryFn: asignacionService.getAvailableExecutors,
    staleTime: 1000 * 60 * 30, // 30 minutos
  });

  // Asignar tarea
  const assignTaskMutation = useMutation({
    mutationFn: asignacionService.assignTask,
    onSuccess: () => {
      // Invalidar consultas para actualizar los datos
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['assignedTasksByExecutor'] });
      queryClient.invalidateQueries({ queryKey: ['workloadDistribution'] });
      toast.success('Tarea asignada correctamente');
    },
    onError: (error: any) => {
      console.error('Error al asignar tarea:', error);
      toast.error(error.message || 'Error al asignar la tarea');
    }
  });

  // Refrescar todos los datos
  const refreshAllData = () => {
    refetchPendingRequests();
    refetchAssignedTasks();
    refetchWorkload();
  };

  return {
    // Datos
    pendingRequests,
    assignedTasksByExecutor,
    workloadDistribution,
    availableExecutors,
    
    // Estados de carga
    isLoadingPendingRequests,
    isLoadingAssignedTasks,
    isLoadingWorkload,
    isLoadingExecutors,
    isAssigningTask: assignTaskMutation.isPending,
    
    // Errores
    pendingRequestsError,
    assignedTasksError,
    workloadError,
    executorsError,
    assignTaskError: assignTaskMutation.error,
    
    // Métodos
    assignTask: assignTaskMutation.mutate,
    refreshAllData
  };
};

export default useAsignacion;
