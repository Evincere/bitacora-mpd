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
 * @param startDate Fecha de inicio (opcional)
 * @param endDate Fecha de fin (opcional)
 */
export const useTaskStatusMetrics = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['taskStatusMetrics', startDate, endDate],
    queryFn: () => dashboardService.getTaskStatusMetrics(startDate, endDate),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener métricas de actividad de usuarios
 * @param startDate Fecha de inicio (opcional)
 * @param endDate Fecha de fin (opcional)
 */
export const useUserActivityMetrics = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['userActivityMetrics', startDate, endDate],
    queryFn: () => dashboardService.getUserActivityMetrics(startDate, endDate),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener distribución de categorías
 * @param startDate Fecha de inicio (opcional)
 * @param endDate Fecha de fin (opcional)
 */
export const useCategoryDistribution = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['categoryDistribution', startDate, endDate],
    queryFn: () => dashboardService.getCategoryDistribution(startDate, endDate),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener distribución de prioridades
 * @param startDate Fecha de inicio (opcional)
 * @param endDate Fecha de fin (opcional)
 */
export const usePriorityDistribution = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['priorityDistribution', startDate, endDate],
    queryFn: () => dashboardService.getPriorityDistribution(startDate, endDate),
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
