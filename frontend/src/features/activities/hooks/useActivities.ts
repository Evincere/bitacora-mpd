import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/api';
import { Activity, Page } from '@/core/types/models';

// Tipos para los parámetros de consulta
interface ActivityQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// Hook para obtener actividades con paginación y filtros
export const useActivities = (params: ActivityQueryParams = {}) => {
  return useQuery({
    queryKey: ['activities', params],
    queryFn: async () => {
      const { page = 0, size = 10, ...restParams } = params;
      const queryParams = new URLSearchParams();

      // Añadir parámetros de paginación
      queryParams.append('page', page.toString());
      queryParams.append('size', size.toString());

      // Añadir otros parámetros si existen
      Object.entries(restParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      // Usar 'activities' sin barra inicial para evitar problemas con la URL base
      const response = await api.get<Page<Activity>>(`activities?${queryParams.toString()}`);
      console.log('useActivities: Respuesta recibida:', response.data);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener una actividad por ID
export const useActivity = (id: number | undefined) => {
  return useQuery({
    queryKey: ['activity', id],
    queryFn: async () => {
      if (!id) throw new Error('ID de actividad no proporcionado');
      // Usar 'activities' sin barra inicial para evitar problemas con la URL base
      const response = await api.get<Activity>(`activities/${id}`);
      console.log(`useActivity: Respuesta recibida para ID ${id}:`, response.data);
      return response.data;
    },
    enabled: !!id, // Solo ejecutar si hay un ID
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para crear una nueva actividad
export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityData: Omit<Activity, 'id'>) => {
      // Usar 'activities' sin barra inicial para evitar problemas con la URL base
      const response = await api.post<Activity>('activities', activityData);
      console.log('useCreateActivity: Actividad creada:', response.data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar consultas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

// Hook para actualizar una actividad existente
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, activityData }: { id: number; activityData: Partial<Activity> }) => {
      // Usar 'activities' sin barra inicial para evitar problemas con la URL base
      const response = await api.put<Activity>(`activities/${id}`, activityData);
      console.log(`useUpdateActivity: Actividad ${id} actualizada:`, response.data);
      return response.data;
    },
    onSuccess: (data) => {
      // Actualizar la caché para la actividad específica
      queryClient.setQueryData(['activity', data.id], data);
      // Invalidar consultas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

// Hook para eliminar una actividad
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Usar 'activities' sin barra inicial para evitar problemas con la URL base
      await api.delete(`activities/${id}`);
      console.log(`useDeleteActivity: Actividad ${id} eliminada`);
      return id;
    },
    onSuccess: (id) => {
      // Eliminar la actividad de la caché
      queryClient.removeQueries({ queryKey: ['activity', id] });
      // Invalidar consultas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};
