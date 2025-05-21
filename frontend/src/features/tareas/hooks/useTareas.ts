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

  // Obtener tareas asignadas (unificadas desde ambos endpoints)
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
    onSuccess: (data) => {
      console.log('Tarea iniciada exitosamente. Datos recibidos:', data);

      // Actualizar manualmente la caché de tareas en progreso
      if (data && data.id) {
        try {
          // Obtener la caché actual de tareas asignadas
          const currentAssignedTasks = queryClient.getQueryData<any[]>(['assignedTasks']) || [];

          // Buscar la tarea que acabamos de iniciar
          const taskToUpdate = currentAssignedTasks.find(task => task.id === data.id);

          if (taskToUpdate) {
            // Crear una copia de la tarea con estado actualizado
            const updatedTask = {
              ...taskToUpdate,
              status: 'IN_PROGRESS'
            };

            // Obtener la caché actual de tareas en progreso
            const currentInProgressTasks = queryClient.getQueryData<any[]>(['inProgressTasks']) || [];

            // Actualizar la caché de tareas en progreso
            queryClient.setQueryData(['inProgressTasks'], [...currentInProgressTasks, updatedTask]);

            console.log('Caché de tareas en progreso actualizada manualmente:',
              queryClient.getQueryData(['inProgressTasks']));
          }
        } catch (cacheError) {
          console.warn('Error al actualizar manualmente la caché:', cacheError);
          // No interrumpimos el flujo si hay un error al actualizar la caché
        }
      }

      // Invalidar todas las consultas para asegurar que la UI se actualice correctamente
      queryClient.invalidateQueries({ queryKey: ['assignedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['inProgressTasks'] });
      queryClient.invalidateQueries({ queryKey: ['completedTasks'] });

      // Forzar una recarga inmediata de los datos
      setTimeout(() => {
        console.log('Recargando datos después de iniciar tarea...');

        // Primero invalidar las consultas
        queryClient.invalidateQueries({ queryKey: ['assignedTasks'] });
        queryClient.invalidateQueries({ queryKey: ['inProgressTasks'] });
        queryClient.invalidateQueries({ queryKey: ['completedTasks'] });

        // Luego recargar los datos
        Promise.all([
          refetchAssignedTasks(),
          refetchInProgressTasks(),
          refetchCompletedTasks()
        ]).then((results) => {
          console.log('Datos actualizados después de iniciar tarea:', {
            assignedTasks: results[0].data,
            inProgressTasks: results[1].data,
            completedTasks: results[2].data
          });
        }).catch(err => {
          console.error('Error al actualizar datos después de iniciar tarea:', err);
        });
      }, 1000);

      // Recargar nuevamente después de un tiempo más largo para asegurar que los datos estén actualizados
      setTimeout(() => {
        console.log('Recarga final de datos...');
        refreshAllData();

        // Forzar una recarga de la página después de un tiempo adicional
        setTimeout(() => {
          console.log('Forzando recarga de la página...');
          window.location.reload();
        }, 1000);
      }, 3000);
    },
    onError: (error: any) => {
      console.error('Error al iniciar tarea:', error);

      // Si el error es porque la tarea ya está iniciada, no mostrar error
      if (error.message && (
        error.message.includes('ya ha sido iniciada') ||
        error.message.includes('already started') ||
        error.message.includes('estado actual no permite') ||
        error.message.includes('403') ||
        error.message.includes('Forbidden'))) {
        console.log('La tarea posiblemente ya está iniciada o no se tienen permisos. Actualizando datos...');

        // Actualizar los datos para reflejar el estado actual
        queryClient.invalidateQueries({ queryKey: ['assignedTasks'] });
        queryClient.invalidateQueries({ queryKey: ['inProgressTasks'] });
        queryClient.invalidateQueries({ queryKey: ['completedTasks'] });

        // Recargar datos inmediatamente
        refreshAllData();

        // Y recargar nuevamente después de un tiempo para asegurar que los datos estén actualizados
        setTimeout(() => {
          console.log('Recarga final de datos después de error...');
          refreshAllData();

          // Forzar una recarga de la página después de un tiempo adicional
          setTimeout(() => {
            console.log('Forzando recarga de la página después de error...');
            window.location.reload();
          }, 1000);
        }, 2000);
      } else if (error.message && error.message.includes('getInProgressTasks is not a function')) {
        // Error específico que estamos viendo, forzar recarga de la página
        console.log('Error detectado en el servicio de tareas, forzando recarga...');

        // Invalidar todas las consultas
        queryClient.invalidateQueries({ queryKey: ['assignedTasks'] });
        queryClient.invalidateQueries({ queryKey: ['inProgressTasks'] });
        queryClient.invalidateQueries({ queryKey: ['completedTasks'] });

        // Forzar una recarga de la página
        setTimeout(() => {
          console.log('Forzando recarga de la página...');
          window.location.reload();
        }, 1000);
      }
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
    onSuccess: (data) => {
      console.log('Tarea completada exitosamente. Datos recibidos:', data);

      // Invalidar todas las consultas para asegurar que la UI se actualice correctamente
      queryClient.invalidateQueries({ queryKey: ['assignedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['inProgressTasks'] });
      queryClient.invalidateQueries({ queryKey: ['completedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });

      toast.success('Tarea completada correctamente');

      // Forzar una recarga inmediata de los datos
      setTimeout(() => {
        console.log('Recargando datos después de completar tarea...');

        // Recargar los datos
        Promise.all([
          refetchAssignedTasks(),
          refetchInProgressTasks(),
          refetchCompletedTasks()
        ]).then((results) => {
          console.log('Datos actualizados después de completar tarea:', {
            assignedTasks: results[0].data,
            inProgressTasks: results[1].data,
            completedTasks: results[2].data
          });
        }).catch(err => {
          console.error('Error al actualizar datos después de completar tarea:', err);
        });
      }, 1000);

      // Recargar nuevamente después de un tiempo más largo para asegurar que los datos estén actualizados
      setTimeout(() => {
        console.log('Recarga final de datos después de completar tarea...');
        refreshAllData();
      }, 3000);
    },
    onError: (error: any) => {
      console.error('Error al completar tarea:', error);

      // Si el error es porque la tarea ya está completada, no mostrar error
      if (error.message && (
        error.message.includes('ya ha sido completada') ||
        error.message.includes('already completed') ||
        error.message.includes('estado actual no permite') ||
        error.message.includes('403') ||
        error.message.includes('Forbidden'))) {
        console.log('La tarea posiblemente ya está completada o no se tienen permisos. Actualizando datos...');

        // Actualizar los datos para reflejar el estado actual
        queryClient.invalidateQueries({ queryKey: ['assignedTasks'] });
        queryClient.invalidateQueries({ queryKey: ['inProgressTasks'] });
        queryClient.invalidateQueries({ queryKey: ['completedTasks'] });

        // Recargar datos inmediatamente
        refreshAllData();
      } else {
        toast.error(error.message || 'Error al completar la tarea');
      }
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

  // Subir archivos adjuntos
  const [isUploading, setIsUploading] = useState(false);
  const uploadAttachmentsMutation = useMutation({
    mutationFn: async ({ taskId, files }: { taskId: number, files: File[] }) => {
      setIsUploading(true);
      try {
        return await tareasService.uploadAttachments(taskId, files);
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      // Invalidar todas las consultas para asegurar que la UI se actualice correctamente
      queryClient.invalidateQueries({ queryKey: ['assignedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['inProgressTasks'] });
      queryClient.invalidateQueries({ queryKey: ['completedTasks'] });

      toast.success('Archivos adjuntos subidos correctamente');
    },
    onError: (error: any) => {
      console.error('Error al subir archivos adjuntos:', error);
      toast.error(`Error al subir archivos: ${error.message || 'Error desconocido'}`);
    }
  });

  // Refrescar todos los datos
  const refreshAllData = async () => {
    try {
      console.log('Iniciando refreshAllData...');

      // Invalidar todas las consultas para forzar una recarga desde el servidor
      queryClient.invalidateQueries({ queryKey: ['assignedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['inProgressTasks'] });
      queryClient.invalidateQueries({ queryKey: ['completedTasks'] });

      console.log('Consultas invalidadas, recargando datos...');

      // Ejecutar todas las consultas en paralelo
      const results = await Promise.allSettled([
        refetchAssignedTasks(),
        refetchInProgressTasks(),
        refetchCompletedTasks()
      ]);

      // Verificar si alguna consulta falló
      const failedQueries = results.filter(result => result.status === 'rejected');
      if (failedQueries.length > 0) {
        console.warn(`${failedQueries.length} consultas fallaron al actualizar los datos:`, failedQueries);
      } else {
        console.log('Datos actualizados correctamente');

        // Mostrar los datos actualizados para depuración
        const successfulQueries = results.filter(result => result.status === 'fulfilled') as PromiseFulfilledResult<any>[];
        console.log('Datos actualizados:', {
          assignedTasks: successfulQueries[0]?.value?.data,
          inProgressTasks: successfulQueries[1]?.value?.data,
          completedTasks: successfulQueries[2]?.value?.data
        });
      }

      // Forzar una segunda recarga después de un breve retraso
      setTimeout(() => {
        console.log('Realizando segunda recarga de datos...');
        Promise.allSettled([
          refetchAssignedTasks(),
          refetchInProgressTasks(),
          refetchCompletedTasks()
        ]).then(() => {
          console.log('Segunda recarga completada');
        });
      }, 1000);
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    }
  };

  return {
    // Datos
    assignedTasks,
    inProgressTasks,
    completedTasks,

    // Estados de carga
    isLoadingAssignedTasks,
    isLoadingInProgressTasks,
    isLoadingCompletedTasks,
    isStartingTask: startTaskMutation.isPending,
    isUpdatingProgress: updateProgressMutation.isPending,
    isCompletingTask: completeTaskMutation.isPending,
    isAddingComment: addCommentMutation.isPending,
    isUploading,

    // Errores
    assignedTasksError,
    inProgressTasksError,
    completedTasksError,
    startTaskError: startTaskMutation.error,
    updateProgressError: updateProgressMutation.error,
    completeTaskError: completeTaskMutation.error,
    addCommentError: addCommentMutation.error,
    uploadAttachmentsError: uploadAttachmentsMutation.error,

    // Métodos
    startTask: startTaskMutation.mutate,
    updateProgress: updateProgressMutation.mutate,
    completeTask: completeTaskMutation.mutate,
    addComment: addCommentMutation.mutate,
    uploadAttachments: uploadAttachmentsMutation.mutate,
    refreshAllData,

    // Funciones auxiliares
    getTaskDetails: tareasService.getTaskDetails
  };
};

export default useTareas;
