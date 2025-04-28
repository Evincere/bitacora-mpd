import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import solicitudesService, { SolicitudRequest } from '../services/solicitudesService';

/**
 * Hook personalizado para gestionar solicitudes
 */
export const useSolicitudes = () => {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

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
    mutationFn: async ({ solicitud, files }: { solicitud: SolicitudRequest, files: File[] }) => {
      // Paso 1: Crear la solicitud
      const createdSolicitud = await solicitudesService.createSolicitud(solicitud);
      
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
    onSuccess: () => {
      // Invalidar consultas para actualizar la lista de solicitudes
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
      toast.success('Solicitud creada correctamente');
    },
    onError: (error: any) => {
      console.error('Error al crear solicitud:', error);
      toast.error(error.message || 'Error al crear la solicitud');
    }
  });

  return {
    // Datos
    categories,
    priorities,
    
    // Estados de carga
    isLoadingCategories,
    isLoadingPriorities,
    isCreatingSolicitud: createSolicitudMutation.isPending,
    isUploading,
    
    // Errores
    categoriesError,
    prioritiesError,
    createSolicitudError: createSolicitudMutation.error,
    
    // Métodos
    createSolicitud: createSolicitudMutation.mutate
  };
};

export default useSolicitudes;
