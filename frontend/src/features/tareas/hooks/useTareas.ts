import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import tareasService, { ProgresoRequest, CompletarTareaRequest } from '../services/tareasService';
import { taskRequestService } from '../../../services/taskRequestService';

/**
 * Hook personalizado para gestionar tareas del ejecutor
 */
export const useTareas = () => {
  const queryClient = useQueryClient();

  // Obtener tareas asignadas (desde el endpoint de actividades)
  const {
    data: assignedTasks,
    isLoading: isLoadingAssignedTasks,
    error: assignedTasksError,
    refetch: refetchAssignedTasks
  } = useQuery({
    queryKey: ['assignedTasks'],
    queryFn: tareasService.getAssignedTasks,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Obtener tareas asignadas al ejecutor (desde el endpoint de task-requests)
  const {
    data: tasksAssignedToExecutor,
    isLoading: isLoadingTasksAssignedToExecutor,
    error: tasksAssignedToExecutorError,
    refetch: refetchTasksAssignedToExecutor
  } = useQuery({
    queryKey: ['tasksAssignedToExecutor'],
    queryFn: () => taskRequestService.getTasksAssignedToExecutor(0, 10), // Pasar explícitamente los parámetros
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Obtener tareas en progreso
  const {
    data: inProgressTasks,
    isLoading: isLoadingInProgressTasks,
    error: inProgressTasksError,
    refetch: refetchInProgressTasks
  } = useQuery({
    queryKey: ['inProgressTasks'],
    queryFn: tareasService.getInProgressTasks,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Obtener tareas completadas
  const {
    data: completedTasks,
    isLoading: isLoadingCompletedTasks,
    error: completedTasksError,
    refetch: refetchCompletedTasks
  } = useQuery({
    queryKey: ['completedTasks'],
    queryFn: tareasService.getCompletedTasks,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Iniciar tarea
  const startTaskMutation = useMutation({
    mutationFn: tareasService.startTask,
    onSuccess: () => {
      // Invalidar consultas para actualizar los datos
      queryClient.invalidateQueries({ queryKey: ['assignedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['inProgressTasks'] });
      toast.success('Tarea iniciada correctamente');
    },
    onError: (error: any) => {
      console.error('Error al iniciar tarea:', error);
      toast.error(error.message || 'Error al iniciar la tarea');
    }
  });

  // Actualizar progreso
  const updateProgressMutation = useMutation({
    mutationFn: tareasService.updateProgress,
    onSuccess: () => {
      // Invalidar consultas para actualizar los datos
      queryClient.invalidateQueries({ queryKey: ['inProgressTasks'] });
      toast.success('Progreso actualizado correctamente');
    },
    onError: (error: any) => {
      console.error('Error al actualizar progreso:', error);
      toast.error(error.message || 'Error al actualizar el progreso');
    }
  });

  // Completar tarea
  const completeTaskMutation = useMutation({
    mutationFn: tareasService.completeTask,
    onSuccess: () => {
      // Invalidar consultas para actualizar los datos
      queryClient.invalidateQueries({ queryKey: ['inProgressTasks'] });
      queryClient.invalidateQueries({ queryKey: ['completedTasks'] });
      toast.success('Tarea completada correctamente');
    },
    onError: (error: any) => {
      console.error('Error al completar tarea:', error);
      toast.error(error.message || 'Error al completar la tarea');
    }
  });

  // Agregar comentario
  const addCommentMutation = useMutation({
    mutationFn: ({ activityId, comment }: { activityId: number; comment: string }) =>
      tareasService.addComment(activityId, comment),
    onSuccess: () => {
      // Invalidar consultas para actualizar los datos
      queryClient.invalidateQueries({ queryKey: ['assignedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['inProgressTasks'] });
      queryClient.invalidateQueries({ queryKey: ['completedTasks'] });
      toast.success('Comentario agregado correctamente');
    },
    onError: (error: any) => {
      console.error('Error al agregar comentario:', error);
      toast.error(error.message || 'Error al agregar el comentario');
    }
  });

  // Refrescar todos los datos
  const refreshAllData = () => {
    refetchAssignedTasks();
    refetchInProgressTasks();
    refetchCompletedTasks();
    refetchTasksAssignedToExecutor();
  };

  return {
    // Datos
    assignedTasks,
    inProgressTasks,
    completedTasks,
    tasksAssignedToExecutor,

    // Estados de carga
    isLoadingAssignedTasks,
    isLoadingInProgressTasks,
    isLoadingCompletedTasks,
    isLoadingTasksAssignedToExecutor,
    isStartingTask: startTaskMutation.isPending,
    isUpdatingProgress: updateProgressMutation.isPending,
    isCompletingTask: completeTaskMutation.isPending,
    isAddingComment: addCommentMutation.isPending,

    // Errores
    assignedTasksError,
    inProgressTasksError,
    completedTasksError,
    tasksAssignedToExecutorError,
    startTaskError: startTaskMutation.error,
    updateProgressError: updateProgressMutation.error,
    completeTaskError: completeTaskMutation.error,
    addCommentError: addCommentMutation.error,

    // Métodos
    startTask: startTaskMutation.mutate,
    updateProgress: updateProgressMutation.mutate,
    completeTask: completeTaskMutation.mutate,
    addComment: addCommentMutation.mutate,
    refreshAllData,

    // Funciones auxiliares
    getTaskDetails: tareasService.getTaskDetails
  };
};

export default useTareas;
