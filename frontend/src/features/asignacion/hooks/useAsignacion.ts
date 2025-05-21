import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import asignacionService, { AsignacionRequest, Ejecutor, RechazoRequest, EjecutorConTareas } from '../services/asignacionService';
import solicitudesService, { TaskRequest, TaskRequestPageDto } from '@/features/solicitudes/services/solicitudesService';
import { useRealTimeNotifications } from '@/features/notifications/hooks/useRealTimeNotifications';

/**
 * Hook personalizado para gestionar asignaciones
 */
export const useAsignacion = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Obtener solicitudes pendientes (estado SUBMITTED)
  const {
    data: pendingRequests,
    isLoading: isLoadingPendingRequests,
    error: pendingRequestsError,
    refetch: refetchPendingRequests
  } = useQuery({
    queryKey: ['pendingRequests', currentPage, pageSize],
    queryFn: () => asignacionService.getPendingRequests(currentPage, pageSize),
    staleTime: 1000 * 30, // 30 segundos
    refetchInterval: 1000 * 60, // Refrescar automáticamente cada minuto
    refetchOnWindowFocus: true, // Refrescar cuando la ventana recupera el foco
  });

  // Obtener ejecutores disponibles
  const {
    data: availableExecutors,
    isLoading: isLoadingExecutors,
    error: executorsError,
    refetch: refetchExecutors
  } = useQuery({
    queryKey: ['availableExecutors'],
    queryFn: asignacionService.getAvailableExecutors,
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
    staleTime: 1000 * 30, // 30 segundos
    refetchInterval: 1000 * 60, // Refrescar automáticamente cada minuto
    refetchOnWindowFocus: true, // Refrescar cuando la ventana recupera el foco
  });

  // Obtener distribución de carga de trabajo
  const {
    data: workloadDistribution,
    isLoading: isLoadingWorkload,
    error: workloadError,
    refetch: refetchWorkload
  } = useQuery({
    queryKey: ['workloadDistribution'],
    queryFn: asignacionService.getWorkloadDistribution,
    staleTime: 1000 * 30, // 30 segundos
    refetchInterval: 1000 * 60, // Refrescar automáticamente cada minuto
    refetchOnWindowFocus: true, // Refrescar cuando la ventana recupera el foco
  });

  // Asignar solicitud de tarea
  const assignTaskRequestMutation = useMutation({
    mutationFn: asignacionService.assignTaskRequest,
    onSuccess: (data) => {
      // Invalidar consultas para actualizar los datos
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });

      // También invalidar la consulta de tareas asignadas por ejecutor
      // para que se actualice la vista de distribución de carga
      queryClient.invalidateQueries({ queryKey: ['assignedTasksByExecutor'] });

      toast.success(`Solicitud asignada correctamente al ejecutor ${data.executorName || data.executorId}.`);
    },
    onError: (error: any) => {
      console.error('Error al asignar solicitud:', error);
      if (error.message && error.message.includes('Solo se pueden asignar solicitudes en estado SUBMITTED')) {
        toast.error('Esta solicitud ya ha sido asignada o no está en estado de espera.');
      } else if (error.message && error.message.includes('Solo se pueden asignar ejecutores a solicitudes en estado ASSIGNED')) {
        toast.error('La solicitud debe estar en estado ASSIGNED para asignar un ejecutor.');
      } else {
        toast.error(error.message || 'Error al asignar la solicitud');
      }
    }
  });

  // Reasignar tarea
  const reassignTaskMutation = useMutation({
    mutationFn: (params: { taskId: number, executorId: number, notes?: string }) =>
      asignacionService.reassignTask(params.taskId, params.executorId, params.notes),
    onSuccess: (data) => {
      // Invalidar consultas para actualizar los datos
      queryClient.invalidateQueries({ queryKey: ['assignedTasksByExecutor'] });

      toast.success(`Tarea reasignada correctamente al ejecutor ${data.executorName || data.executorId}.`);
    },
    onError: (error: any) => {
      console.error('Error al reasignar tarea:', error);
      toast.error(error.message || 'Error al reasignar la tarea');
    }
  });

  // Rechazar solicitud de tarea
  const rejectTaskRequestMutation = useMutation({
    mutationFn: async (params: { taskRequestId: number, rechazo: RechazoRequest }) => {
      try {
        // Intentar obtener la solicitud primero para verificar su estado
        const taskRequest = await solicitudesService.getTaskRequestById(params.taskRequestId);

        // Verificar si la solicitud está en estado SUBMITTED
        if (taskRequest && taskRequest.status !== 'SUBMITTED') {
          throw new Error(`Solo se pueden rechazar solicitudes en estado SUBMITTED. Estado actual: ${taskRequest.status}`);
        }

        // Si todo está bien, proceder con el rechazo
        return await asignacionService.rejectTaskRequest(params.taskRequestId, params.rechazo);
      } catch (error) {
        console.error('Error en mutationFn de rejectTaskRequest:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidar consultas para actualizar los datos
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['assignedTasksByExecutor'] });
      queryClient.invalidateQueries({ queryKey: ['workloadDistribution'] });

      toast.success('Solicitud rechazada correctamente.');
    },
    onError: (error: any) => {
      console.error('Error al rechazar solicitud:', error);

      // Extraer el mensaje de error del servidor si existe
      let errorMessage = '';
      try {
        if (error.response) {
          if (typeof error.response.text === 'function') {
            error.response.text().then((text: string) => {
              console.error('Texto de error del servidor:', text);
              try {
                const errorData = JSON.parse(text);
                errorMessage = errorData.message || text;
                showErrorToast(error, errorMessage);
              } catch (e) {
                errorMessage = text;
                showErrorToast(error, errorMessage);
              }
            }).catch((e: any) => {
              console.error('Error al obtener texto de respuesta:', e);
              showErrorToast(error, '');
            });
            return; // Salir temprano ya que estamos manejando el error de forma asíncrona
          }
        }
      } catch (e) {
        console.error('Error al parsear respuesta de error:', e);
      }

      // Si no pudimos manejar el error de forma asíncrona, mostrarlo directamente
      showErrorToast(error, errorMessage);
    }
  });

  // Función auxiliar para mostrar mensajes de error
  const showErrorToast = (error: any, errorMessage: string) => {
    // Manejar diferentes tipos de errores
    if (errorMessage.includes('SUBMITTED') ||
      error.message?.includes('Solo se pueden rechazar solicitudes en estado SUBMITTED')) {
      toast.error('Esta solicitud no puede ser rechazada porque no está en estado de espera. Verifique el estado actual de la solicitud.');
    } else if (error.message?.includes('500')) {
      // Verificar si hay un mensaje específico del servidor
      if (errorMessage) {
        toast.error(`Error al rechazar la solicitud: ${errorMessage}`);
      } else {
        toast.error('Error en el servidor al rechazar la solicitud. Por favor, inténtelo de nuevo más tarde o contacte al administrador.');
      }
    } else if (error.message?.includes('403')) {
      toast.error('No tiene permisos para rechazar esta solicitud.');
    } else if (error.message?.includes('404')) {
      toast.error('La solicitud que intenta rechazar no existe o ha sido eliminada.');
    } else {
      toast.error(errorMessage || error.message || 'Error al rechazar la solicitud. Por favor, inténtelo de nuevo.');
    }

    // Refrescar los datos para asegurar que estamos mostrando el estado actual
    refreshAllData();
  };

  // Cambiar de página
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Cambiar tamaño de página
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0); // Volver a la primera página al cambiar el tamaño
  };

  // Refrescar todos los datos
  const refreshAllData = () => {
    refetchPendingRequests();
    refetchExecutors();
    refetchAssignedTasks();
    refetchWorkload();
  };

  // Obtener el contexto de notificaciones en tiempo real
  const { notifications } = useRealTimeNotifications();

  // Efecto para actualizar los datos cuando se reciben notificaciones relevantes
  useEffect(() => {
    // Si hay notificaciones nuevas, verificar si son relevantes para el asignador
    if (notifications && notifications.length > 0) {
      // Buscar notificaciones de tareas completadas o cambios de estado
      const hasTaskCompletedNotifications = notifications.some(
        notification =>
          notification.type === 'TASK_COMPLETED' ||
          notification.type === 'TASK_STATUS_CHANGE'
      );

      // Si hay notificaciones relevantes, actualizar los datos
      if (hasTaskCompletedNotifications) {
        console.log('Notificación de tarea completada detectada, actualizando datos del asignador...');
        refreshAllData();
      }
    }
  }, [notifications]);

  // Filtrar ejecutores por especialidad
  const filterExecutorsBySpecialty = (specialty: string): Ejecutor[] => {
    if (!availableExecutors) return [];

    return availableExecutors.filter(
      ejecutor => ejecutor.especialidad === specialty || ejecutor.especialidad === 'GENERAL'
    );
  };

  return {
    // Datos
    pendingRequests,
    availableExecutors,
    assignedTasksByExecutor,
    workloadDistribution,
    currentPage,
    pageSize,
    notifications,

    // Estados de carga
    isLoadingPendingRequests,
    isLoadingExecutors,
    isLoadingAssignedTasks,
    isLoadingWorkload,
    isAssigningTask: assignTaskRequestMutation.isPending,
    isReassigningTask: reassignTaskMutation.isPending,
    isRejectingTask: rejectTaskRequestMutation.isPending,

    // Errores
    pendingRequestsError,
    executorsError,
    assignedTasksError,
    workloadError,
    assignTaskError: assignTaskRequestMutation.error,
    reassignTaskError: reassignTaskMutation.error,
    rejectTaskError: rejectTaskRequestMutation.error,

    // Métodos
    assignTask: assignTaskRequestMutation.mutate,
    reassignTask: reassignTaskMutation.mutate,
    rejectTaskRequest: rejectTaskRequestMutation.mutate,
    handlePageChange,
    handlePageSizeChange,
    refreshAllData,
    filterExecutorsBySpecialty
  };
};

export default useAsignacion;
