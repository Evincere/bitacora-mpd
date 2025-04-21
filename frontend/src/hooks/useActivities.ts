import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import activitiesService from '@/features/activities/activitiesService';
import {
  ActivityCreateRequest,
  ActivityQueryParams,
  ActivityUpdateRequest
} from '@/types/api';
import { Activity } from '@/types/models';
import { useToast } from '@/hooks/useToast';

// Claves para las consultas
export const ACTIVITIES_KEYS = {
  all: ['activities'] as const,
  lists: () => [...ACTIVITIES_KEYS.all, 'list'] as const,
  list: (filters: ActivityQueryParams) => [...ACTIVITIES_KEYS.lists(), filters] as const,
  details: () => [...ACTIVITIES_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...ACTIVITIES_KEYS.details(), id] as const,
};

/**
 * Hook para obtener actividades con filtros y paginación
 */
export const useActivities = (params?: ActivityQueryParams) => {
  // Usar una referencia para mantener estable la clave de consulta
  const stableParams = React.useRef(params || {});

  // Actualizar la referencia solo si los parámetros cambian significativamente
  React.useEffect(() => {
    const hasSignificantChanges = Object.entries(params || {}).some(
      ([key, value]) => {
        // Ignorar cambios en parámetros vacíos
        if (value === '' && (stableParams.current[key] === '' || stableParams.current[key] === undefined)) {
          return false;
        }
        return stableParams.current[key] !== value;
      }
    );

    if (hasSignificantChanges) {
      stableParams.current = { ...params };
    }
  }, [params]);

  return useQuery({
    queryKey: ACTIVITIES_KEYS.list(stableParams.current),
    queryFn: () => activitiesService.getActivities(params),
    placeholderData: (previousData) => previousData,
    // La configuración global se aplica automáticamente
  });
};

/**
 * Hook para obtener una actividad por ID
 */
export const useActivity = (id: number) => {
  return useQuery({
    queryKey: ACTIVITIES_KEYS.detail(id),
    queryFn: () => activitiesService.getActivityById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para crear una actividad
 */
export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (activityData: ActivityCreateRequest) =>
      activitiesService.createActivity(activityData),
    onSuccess: () => {
      // Invalidar consultas para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_KEYS.lists() });

      // Mostrar notificación de éxito
      toast.success('La actividad ha sido creada exitosamente', 'Actividad creada');
    },
    onError: (error: any) => {
      // Mostrar notificación de error
      toast.error(error.message || 'Error al crear la actividad');
    }
  });
};

/**
 * Hook para actualizar una actividad
 */
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, activityData }: { id: number; activityData: ActivityUpdateRequest }) =>
      activitiesService.updateActivity(id, activityData),
    onSuccess: (updatedActivity: Activity) => {
      // Actualizar la actividad en la caché
      queryClient.setQueryData(
        ACTIVITIES_KEYS.detail(updatedActivity.id),
        updatedActivity
      );

      // Invalidar consultas para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_KEYS.lists() });

      // Mostrar notificación de éxito
      toast.success('La actividad ha sido actualizada exitosamente', 'Actividad actualizada');
    },
    onError: (error: any) => {
      // Mostrar notificación de error
      toast.error(error.message || 'Error al actualizar la actividad');
    }
  });
};

/**
 * Hook para eliminar una actividad
 */
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: number) => activitiesService.deleteActivity(id),
    onSuccess: (_, id) => {
      // Invalidar consultas para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_KEYS.lists() });

      // Eliminar la actividad de la caché
      queryClient.removeQueries({ queryKey: ACTIVITIES_KEYS.detail(id) });

      // Mostrar notificación de éxito
      toast.success('La actividad ha sido eliminada exitosamente', 'Actividad eliminada');
    },
    onError: (error: any) => {
      // Mostrar notificación de error
      toast.error(error.message || 'Error al eliminar la actividad');
    }
  });
};
