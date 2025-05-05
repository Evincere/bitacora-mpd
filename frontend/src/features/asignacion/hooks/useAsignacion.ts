import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import asignacionService, { AsignacionRequest, Ejecutor } from '../services/asignacionService';
import { TaskRequest, TaskRequestPageDto } from '@/features/solicitudes/services/solicitudesService';

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
    staleTime: 1000 * 60 * 2, // 2 minutos
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
    staleTime: 1000 * 60 * 10, // 10 minutos
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
  };

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
    currentPage,
    pageSize,

    // Estados de carga
    isLoadingPendingRequests,
    isLoadingExecutors,
    isAssigningTask: assignTaskRequestMutation.isPending,

    // Errores
    pendingRequestsError,
    executorsError,
    assignTaskError: assignTaskRequestMutation.error,

    // Métodos
    assignTaskRequest: assignTaskRequestMutation.mutate,
    handlePageChange,
    handlePageSizeChange,
    refreshAllData,
    filterExecutorsBySpecialty
  };
};

export default useAsignacion;
