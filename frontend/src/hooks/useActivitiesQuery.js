import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import activitiesService from "../features/activities/activitiesService";

// Claves de consulta para React Query
export const ACTIVITIES_KEYS = {
  all: ["activities"],
  lists: () => [...ACTIVITIES_KEYS.all, "list"],
  list: (filters) => [...ACTIVITIES_KEYS.lists(), filters],
  details: () => [...ACTIVITIES_KEYS.all, "detail"],
  detail: (id) => [...ACTIVITIES_KEYS.details(), id],
};

/**
 * Hook para obtener actividades con filtros y paginación
 * @param {Object} params - Parámetros de consulta
 * @param {Object} options - Opciones adicionales para useQuery
 * @returns {Object} Resultado de la consulta
 */
export const useActivitiesQuery = (params = {}, options = {}) => {
  // Validar parámetros antes de crear la clave de consulta
  const validatedParams = {
    ...params,
    // Asegurar que page nunca sea negativo
    page: Math.max(0, params.page || 0),
    // Asegurar que size esté entre 1 y 100
    size: Math.min(Math.max(1, params.size || 10), 100),
    // Ordenar por fecha descendente por defecto si no se especifica
    sort: params.sort || "date,desc",
  };

  return useQuery({
    queryKey: ACTIVITIES_KEYS.list(validatedParams),
    queryFn: () => activitiesService.getActivities(validatedParams),
    ...options,
  });
};

/**
 * Hook para obtener una actividad por su ID
 * @param {number} id - ID de la actividad
 * @param {Object} options - Opciones adicionales para useQuery
 * @returns {Object} Resultado de la consulta
 */
export const useActivityQuery = (id, options = {}) => {
  return useQuery({
    queryKey: ACTIVITIES_KEYS.detail(id),
    queryFn: () => activitiesService.getActivityById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook para crear una nueva actividad
 * @returns {Object} Resultado de la mutación
 */
export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityData) =>
      activitiesService.createActivity(activityData),
    onSuccess: () => {
      // Invalidar consultas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_KEYS.lists() });
    },
  });
};

/**
 * Hook para actualizar una actividad existente
 * @returns {Object} Resultado de la mutación
 */
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activityData }) =>
      activitiesService.updateActivity(id, activityData),
    onSuccess: (data, variables) => {
      // Invalidar consultas para refrescar los datos
      queryClient.invalidateQueries({
        queryKey: ACTIVITIES_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_KEYS.lists() });
    },
  });
};

/**
 * Hook para eliminar una actividad
 * @returns {Object} Resultado de la mutación
 */
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => activitiesService.deleteActivity(id),
    onSuccess: () => {
      // Invalidar consultas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_KEYS.lists() });
    },
  });
};
