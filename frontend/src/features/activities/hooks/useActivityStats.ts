import { useQuery } from '@tanstack/react-query';
import activitiesService from '../activitiesService';

// Claves para las consultas
export const ACTIVITY_STATS_KEYS = {
  all: ['activityStats'] as const,
  byType: () => [...ACTIVITY_STATS_KEYS.all, 'byType'] as const,
  byStatus: () => [...ACTIVITY_STATS_KEYS.all, 'byStatus'] as const,
  summaries: (page: number, size: number) => [...ACTIVITY_STATS_KEYS.all, 'summaries', page, size] as const,
};

/**
 * Hook para obtener estadísticas de actividades por tipo
 */
export const useActivityStatsByType = () => {
  return useQuery({
    queryKey: ACTIVITY_STATS_KEYS.byType(),
    queryFn: () => activitiesService.getStatsByType(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener estadísticas de actividades por estado
 */
export const useActivityStatsByStatus = () => {
  return useQuery({
    queryKey: ACTIVITY_STATS_KEYS.byStatus(),
    queryFn: () => activitiesService.getStatsByStatus(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener resúmenes de actividades
 */
export const useActivitySummaries = (page: number = 0, size: number = 5) => {
  return useQuery({
    queryKey: ACTIVITY_STATS_KEYS.summaries(page, size),
    queryFn: () => activitiesService.getActivitySummaries(page, size),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

export default {
  useActivityStatsByType,
  useActivityStatsByStatus,
  useActivitySummaries,
};
