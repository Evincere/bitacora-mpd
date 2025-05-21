import { useQuery } from '@tanstack/react-query';
import dashboardService from '../services/dashboardService';
import { DashboardFilters } from '../types/dashboardTypes';

/**
 * Hook para obtener todas las métricas del dashboard
 */
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: () => dashboardService.getDashboardMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener métricas de estado de tareas
 */
export const useTaskStatusMetrics = () => {
  return useQuery({
    queryKey: ['taskStatusMetrics'],
    queryFn: () => dashboardService.getTaskStatusMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener métricas de actividad de usuarios
 */
export const useUserActivityMetrics = () => {
  return useQuery({
    queryKey: ['userActivityMetrics'],
    queryFn: () => dashboardService.getUserActivityMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener distribución de categorías
 */
export const useCategoryDistribution = () => {
  return useQuery({
    queryKey: ['categoryDistribution'],
    queryFn: () => dashboardService.getCategoryDistribution(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener distribución de prioridades
 */
export const usePriorityDistribution = () => {
  return useQuery({
    queryKey: ['priorityDistribution'],
    queryFn: () => dashboardService.getPriorityDistribution(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener métricas de línea de tiempo
 */
export const useTimelineMetrics = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['timelineMetrics', startDate, endDate],
    queryFn: () => dashboardService.getTimelineMetrics(startDate, endDate),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!startDate && !!endDate,
  });
};

/**
 * Hook para obtener métricas de rendimiento
 */
export const usePerformanceMetrics = () => {
  return useQuery({
    queryKey: ['performanceMetrics'],
    queryFn: () => dashboardService.getPerformanceMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
