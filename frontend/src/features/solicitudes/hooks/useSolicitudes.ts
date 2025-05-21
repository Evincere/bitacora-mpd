import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import solicitudesService, { SolicitudRequest, TaskRequestPageDto, UpdateSolicitudRequest } from '../services/solicitudesService';

/**
 * Hook personalizado para gestionar solicitudes
 */
export const useSolicitudes = () => {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Obtener mis solicitudes
  const {
    data: mySolicitudes,
    isLoading: isLoadingMySolicitudes,
    error: mySolicitudesError,
    refetch: refetchMySolicitudes
  } = useQuery<TaskRequestPageDto>({
    queryKey: ['mySolicitudes'],
    queryFn: () => solicitudesService.getMySolicitudes(),
    staleTime: 0, // Siempre considerar los datos como obsoletos para forzar la recarga
    refetchOnMount: true, // Recargar al montar el componente
    refetchOnWindowFocus: true, // Recargar cuando la ventana recupera el foco
  });

  // Obtener categorías
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: solicitudesService.getCategories,
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  // Obtener prioridades
  const {
    data: priorities,
    isLoading: isLoadingPriorities,
    error: prioritiesError
  } = useQuery({
    queryKey: ['priorities'],
    queryFn: solicitudesService.getPriorities,
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  // Crear solicitud
  const createSolicitudMutation = useMutation({
    mutationFn: async ({
      solicitud,
      files,
      submitImmediately = true,
      taskRequestId
    }: {
      solicitud: SolicitudRequest,
      files: File[],
      submitImmediately?: boolean,
      taskRequestId?: number
    }) => {
      // Si se proporciona un ID, solo subir archivos a una solicitud existente
      if (taskRequestId) {
        if (files.length > 0) {
          setIsUploading(true);
          try {
            await solicitudesService.uploadAttachments(taskRequestId, files);
          } finally {
            setIsUploading(false);
          }
        }
        return { id: taskRequestId };
      }

      // Paso 1: Crear la solicitud (como borrador o enviada)
      const createdSolicitud = await solicitudesService.createSolicitud(solicitud, submitImmediately);

      // Paso 2: Si hay archivos, subirlos
      if (files.length > 0) {
        setIsUploading(true);
        try {
          await solicitudesService.uploadAttachments(createdSolicitud.id, files);
        } finally {
          setIsUploading(false);
        }
      }

      return createdSolicitud;
    },
    onSuccess: (data) => {
      console.log('Solicitud creada exitosamente:', data);
      // Invalidar consultas para actualizar la lista de solicitudes
      queryClient.invalidateQueries({ queryKey: ['mySolicitudes'] });
      // Forzar una recarga inmediata de los datos
      setTimeout(() => {
        console.log('Recargando datos de solicitudes...');
        refetchMySolicitudes();
      }, 500);
      toast.success('Solicitud creada correctamente');
    },
    onError: (error: any) => {
      console.error('Error al crear solicitud:', error);
      toast.error(error.message || 'Error al crear la solicitud');
    }
  });

  // Actualizar solicitud existente
  const updateSolicitudMutation = useMutation({
    mutationFn: async ({ id, solicitud }: { id: number, solicitud: UpdateSolicitudRequest }) => {
      return await solicitudesService.updateSolicitud(id, solicitud);
    },
    onSuccess: (data) => {
      console.log('Solicitud actualizada exitosamente:', data);
      // Invalidar consultas para actualizar la lista de solicitudes
      queryClient.invalidateQueries({ queryKey: ['mySolicitudes'] });
      queryClient.invalidateQueries({ queryKey: ['taskRequest', data.id] });
      toast.success('Solicitud actualizada correctamente');
    },
    onError: (error: any) => {
      console.error('Error al actualizar solicitud:', error);
      toast.error(error.message || 'Error al actualizar la solicitud');
    }
  });

  // Obtener detalles de una solicitud usando useQuery para caché y evitar bucles infinitos
  const useTaskRequestDetails = (id: number | null) => {
    return useQuery({
      queryKey: ['taskRequest', id],
      queryFn: () => solicitudesService.getTaskRequestById(id!),
      enabled: !!id, // Solo ejecutar la consulta si hay un ID válido
      staleTime: 1000 * 60 * 5, // 5 minutos de caché
      refetchOnWindowFocus: false, // No recargar al recuperar el foco
      refetchOnMount: false, // No recargar al montar el componente
    });
  };

  // Función directa para casos donde no se puede usar el hook (mantener compatibilidad)
  const getTaskRequestById = async (id: number) => {
    // Intentar obtener de la caché primero
    const cachedData = queryClient.getQueryData(['taskRequest', id]);
    if (cachedData) {
      console.log(`Usando datos en caché para la solicitud ${id}`);
      return cachedData;
    }

    // Si no está en caché, obtener del servicio y guardar en caché
    const data = await solicitudesService.getTaskRequestById(id);
    queryClient.setQueryData(['taskRequest', id], data);
    return data;
  };

  // Reenviar solicitud rechazada
  const resubmitTaskRequestMutation = useMutation({
    mutationFn: async (params: { taskRequestId: number, notes?: string }) => {
      return await solicitudesService.resubmitTaskRequest(params.taskRequestId, params.notes);
    },
    onSuccess: (data) => {
      console.log('Solicitud reenviada exitosamente:', data);
      // Invalidar consultas para actualizar la lista de solicitudes
      queryClient.invalidateQueries({ queryKey: ['mySolicitudes'] });
      // Forzar una recarga inmediata de los datos
      setTimeout(() => {
        console.log('Recargando datos de solicitudes...');
        refetchMySolicitudes();
      }, 500);
      toast.success('Solicitud reenviada correctamente');
    },
    onError: (error: any) => {
      console.error('Error al reenviar solicitud:', error);
      toast.error(error.message || 'Error al reenviar la solicitud');
    }
  });

  return {
    // Datos
    mySolicitudes,
    categories,
    priorities,

    // Estados de carga
    isLoadingMySolicitudes,
    isLoadingCategories,
    isLoadingPriorities,
    isCreatingSolicitud: createSolicitudMutation.isPending,
    isUpdatingSolicitud: updateSolicitudMutation.isPending,
    isResubmittingTaskRequest: resubmitTaskRequestMutation.isPending,
    isUploading,

    // Errores
    mySolicitudesError,
    categoriesError,
    prioritiesError,
    createSolicitudError: createSolicitudMutation.error,
    updateSolicitudError: updateSolicitudMutation.error,
    resubmitTaskRequestError: resubmitTaskRequestMutation.error,

    // Métodos
    createSolicitud: createSolicitudMutation.mutate,
    updateSolicitud: updateSolicitudMutation.mutate,
    resubmitTaskRequest: resubmitTaskRequestMutation.mutate,
    getTaskRequestById,
    useTaskRequestDetails, // Nuevo hook para obtener detalles con caché
    refetchMySolicitudes
  };
};

export default useSolicitudes;
