import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import solicitudesService, { SolicitudRequest, TaskRequestPageDto } from '../services/solicitudesService';

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
      submitImmediately = true
    }: {
      solicitud: SolicitudRequest,
      files: File[],
      submitImmediately?: boolean
    }) => {
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
    isUploading,

    // Errores
    mySolicitudesError,
    categoriesError,
    prioritiesError,
    createSolicitudError: createSolicitudMutation.error,

    // Métodos
    createSolicitud: createSolicitudMutation.mutate,
    refetchMySolicitudes
  };
};

export default useSolicitudes;
