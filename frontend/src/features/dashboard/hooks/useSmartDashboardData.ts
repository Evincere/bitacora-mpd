/**
 * @file useSmartDashboardData hook
 * @description Custom hook for fetching dashboard data based on user role
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '@/core/store';
import { UserRole } from '@/core/types/models';
import { useQuery } from '@tanstack/react-query';

// Import role-specific hooks
import { useActivityStatsByStatus, useActivityStatsByType } from '@/features/activities/hooks';
import solicitudesService from '@/features/solicitudes/services/solicitudesService';
import asignacionService from '@/features/asignacion/services/asignacionService';
import tareasService from '@/features/tareas/services/tareasService';

/**
 * Custom hook for fetching dashboard data based on user role
 * @returns Dashboard data and loading state
 */
const useSmartDashboardData = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>({});

  // Common queries for all roles
  const {
    data: statusStats,
    isLoading: isLoadingStatusStats,
    error: statusStatsError
  } = useActivityStatsByStatus();

  const {
    data: typeStats,
    isLoading: isLoadingTypeStats,
    error: typeStatsError
  } = useActivityStatsByType();

  // Role-specific queries
  // SOLICITANTE: Get requests
  const {
    data: solicitudesData,
    isLoading: isLoadingSolicitudes,
    error: solicitudesError,
    refetch: refetchSolicitudes
  } = useQuery({
    queryKey: ['mySolicitudes'],
    queryFn: async () => {
      console.log('SmartDashboard: Obteniendo solicitudes del solicitante...');
      const result = await solicitudesService.getMySolicitudes(0, 10);
      console.log('SmartDashboard: Solicitudes obtenidas:', result);
      return result;
    },
    enabled: user?.role === UserRole.SOLICITANTE,
    staleTime: 0, // Forzar actualización inmediata
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // ASIGNADOR: Get pending requests and workload distribution
  const {
    data: pendingRequestsData,
    isLoading: isLoadingPendingRequests,
    error: pendingRequestsError
  } = useQuery({
    queryKey: ['pendingRequests'],
    queryFn: () => asignacionService.getPendingRequests(0, 10),
    enabled: user?.role === UserRole.ASIGNADOR,
    staleTime: 60000, // 1 minute
  });

  const {
    data: workloadData,
    isLoading: isLoadingWorkload,
    error: workloadError
  } = useQuery({
    queryKey: ['workloadDistribution'],
    queryFn: () => asignacionService.getWorkloadDistribution(),
    enabled: user?.role === UserRole.ASIGNADOR,
    staleTime: 60000, // 1 minute
  });

  // EJECUTOR: Get assigned tasks, in-progress tasks, and completed tasks
  const {
    data: assignedTasksData,
    isLoading: isLoadingAssignedTasks,
    error: assignedTasksError
  } = useQuery({
    queryKey: ['assignedTasks'],
    queryFn: () => tareasService.getAssignedTasks(),
    enabled: user?.role === UserRole.EJECUTOR,
    staleTime: 60000, // 1 minute
  });

  const {
    data: inProgressTasksData,
    isLoading: isLoadingInProgressTasks,
    error: inProgressTasksError
  } = useQuery({
    queryKey: ['inProgressTasks'],
    queryFn: () => tareasService.getInProgressTasks(),
    enabled: user?.role === UserRole.EJECUTOR,
    staleTime: 60000, // 1 minute
  });

  const {
    data: completedTasksData,
    isLoading: isLoadingCompletedTasks,
    error: completedTasksError
  } = useQuery({
    queryKey: ['completedTasks'],
    queryFn: () => tareasService.getCompletedTasks(),
    enabled: user?.role === UserRole.EJECUTOR,
    staleTime: 60000, // 1 minute
  });

  // Process and combine data based on user role
  useEffect(() => {
    if (!user) return;

    // Common data for all roles
    const commonData = {
      statusStats: statusStats || [],
      typeStats: typeStats || [],
    };

    // Calculate common statistics
    const stats = {
      enProgreso: statusStats?.find(stat => stat.status === 'EN_PROGRESO')?.count || 0,
      pendientes: statusStats?.find(stat => stat.status === 'PENDIENTE')?.count || 0,
      completadas: statusStats?.find(stat => stat.status === 'COMPLETADA')?.count || 0,
      total: statusStats?.reduce((sum, stat) => sum + stat.count, 0) || 0
    };

    // Role-specific data
    let roleData = {};
    let isRoleDataLoading = false;
    let roleError = null;

    switch (user.role) {
      case UserRole.SOLICITANTE:
        // Verificar la estructura de datos recibida
        console.log('SmartDashboard: Estructura de solicitudesData:', solicitudesData);

        // Usar la estructura correcta (taskRequests en lugar de content)
        const solicitudes = solicitudesData?.taskRequests || [];
        const totalSolicitudes = solicitudesData?.totalItems || 0;

        // Contar solicitudes por estado
        const solicitudesPendientes = solicitudes.filter(s => s.status === 'SUBMITTED').length;
        const solicitudesAsignadas = solicitudes.filter(s => s.status === 'ASSIGNED' || s.status === 'IN_PROGRESS').length;
        const solicitudesCompletadas = solicitudes.filter(s => s.status === 'COMPLETED' || s.status === 'APPROVED' || s.status === 'REJECTED').length;

        console.log('SmartDashboard: Conteo de solicitudes:', {
          total: totalSolicitudes,
          pendientes: solicitudesPendientes,
          asignadas: solicitudesAsignadas,
          completadas: solicitudesCompletadas
        });

        roleData = {
          solicitudes: solicitudes,
          totalSolicitudes: totalSolicitudes,
          solicitudesPendientes: solicitudesPendientes,
          solicitudesAsignadas: solicitudesAsignadas,
          solicitudesCompletadas: solicitudesCompletadas,
        };
        isRoleDataLoading = isLoadingSolicitudes;
        roleError = solicitudesError;
        break;

      case UserRole.ASIGNADOR:
        roleData = {
          pendingRequests: pendingRequestsData?.content || [],
          totalPendingRequests: pendingRequestsData?.totalElements || 0,
          workloadDistribution: workloadData || [],
          activeExecutors: (workloadData || []).length,
          averageWorkload: (workloadData || []).length > 0
            ? (workloadData.reduce((acc, curr) => acc + curr.pendingTasks, 0) / workloadData.length).toFixed(1)
            : 0
        };
        isRoleDataLoading = isLoadingPendingRequests || isLoadingWorkload;
        roleError = pendingRequestsError || workloadError;
        break;

      case UserRole.EJECUTOR:
        // Calcular el tiempo promedio de completado si hay tareas completadas
        const completedTasks = completedTasksData || [];
        let averageCompletionTime = null;

        if (completedTasks.length > 0) {
          // Filtrar tareas que tienen fechas válidas para calcular el tiempo de completado
          const tasksWithDates = completedTasks.filter(task =>
            task.requestDate && task.completionDate
          );

          if (tasksWithDates.length > 0) {
            // Calcular el tiempo promedio en días
            const totalDays = tasksWithDates.reduce((sum, task) => {
              const requestDate = new Date(task.requestDate);
              const completionDate = new Date(task.completionDate);
              const diffTime = Math.abs(completionDate.getTime() - requestDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return sum + diffDays;
            }, 0);

            averageCompletionTime = (totalDays / tasksWithDates.length).toFixed(1);
            console.log('Tiempo promedio de completado calculado:', averageCompletionTime, 'días');
          }
        }

        roleData = {
          assignedTasks: assignedTasksData || [],
          inProgressTasks: inProgressTasksData || [],
          completedTasks: completedTasks,
          totalAssignedTasks: (assignedTasksData || []).length,
          totalInProgressTasks: (inProgressTasksData || []).length,
          totalCompletedTasks: completedTasks.length,
          averageCompletionTime: averageCompletionTime,
          upcomingDeadlines: (assignedTasksData || [])
            .filter(task => task.dueDate)
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 5)
        };
        isRoleDataLoading = isLoadingAssignedTasks || isLoadingInProgressTasks || isLoadingCompletedTasks;
        roleError = assignedTasksError || inProgressTasksError || completedTasksError;
        break;

      case UserRole.ADMIN:
        // Admin sees all data
        roleData = {
          // Solicitante data
          solicitudes: solicitudesData?.taskRequests || [],
          totalSolicitudes: solicitudesData?.totalItems || 0,
          solicitudesPendientes: (solicitudesData?.taskRequests || []).filter(s => s.status === 'SUBMITTED').length,
          solicitudesAsignadas: (solicitudesData?.taskRequests || []).filter(s => s.status === 'ASSIGNED' || s.status === 'IN_PROGRESS').length,
          solicitudesCompletadas: (solicitudesData?.taskRequests || []).filter(s => s.status === 'COMPLETED' || s.status === 'APPROVED' || s.status === 'REJECTED').length,

          // Asignador data
          pendingRequests: pendingRequestsData?.content || [],
          totalPendingRequests: pendingRequestsData?.totalElements || 0,
          workloadDistribution: workloadData || [],
          activeExecutors: (workloadData || []).length,

          // Ejecutor data
          assignedTasks: assignedTasksData || [],
          inProgressTasks: inProgressTasksData || [],
          totalAssignedTasks: (assignedTasksData || []).length,
          totalInProgressTasks: (inProgressTasksData || []).length,
        };
        isRoleDataLoading = isLoadingSolicitudes || isLoadingPendingRequests ||
          isLoadingWorkload || isLoadingAssignedTasks ||
          isLoadingInProgressTasks;
        roleError = solicitudesError || pendingRequestsError ||
          workloadError || assignedTasksError ||
          inProgressTasksError;
        break;

      default:
        roleData = {};
        isRoleDataLoading = false;
        roleError = null;
    }

    // Combine common and role-specific data
    setData({
      ...commonData,
      ...roleData,
      stats
    });

    // Update loading state
    setIsLoading(isLoadingStatusStats || isLoadingTypeStats || isRoleDataLoading);

    // Update error state
    setError(statusStatsError || typeStatsError || roleError);
  }, [
    user,
    statusStats, typeStats,
    solicitudesData, pendingRequestsData, workloadData, assignedTasksData, inProgressTasksData, completedTasksData,
    isLoadingStatusStats, isLoadingTypeStats,
    isLoadingSolicitudes, isLoadingPendingRequests, isLoadingWorkload,
    isLoadingAssignedTasks, isLoadingInProgressTasks, isLoadingCompletedTasks,
    statusStatsError, typeStatsError,
    solicitudesError, pendingRequestsError, workloadError,
    assignedTasksError, inProgressTasksError, completedTasksError
  ]);

  // Función para forzar la actualización de los datos
  const refreshData = useCallback(() => {
    console.log('SmartDashboard: Forzando actualización de datos...');

    // Refrescar datos específicos según el rol del usuario
    if (user?.role === UserRole.SOLICITANTE) {
      refetchSolicitudes();
    }

    // Aquí se pueden agregar más refetch para otros roles

  }, [user?.role, refetchSolicitudes]);

  return { data, isLoading, error, refreshData };
};

export default useSmartDashboardData;
