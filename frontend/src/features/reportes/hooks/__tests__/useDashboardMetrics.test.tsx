import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useDashboardMetrics,
  useTaskStatusMetrics,
  useUserActivityMetrics,
  useCategoryDistribution,
  usePriorityDistribution
} from '../useDashboardMetrics';
import dashboardService from '../../services/dashboardService';

// Mock del servicio
vi.mock('../../services/dashboardService');
const mockDashboardService = vi.mocked(dashboardService);

// Wrapper para React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0
      }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Dashboard Metrics Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useDashboardMetrics', () => {
    it('should fetch dashboard metrics successfully', async () => {
      // Arrange
      const mockData = {
        totalTasks: 1000,
        completedTasks: 750,
        pendingTasks: 250,
        overdueTasksCount: 5,
        averageCompletionTime: 24.5,
        activeUsers: 35,
        taskCompletionRate: 87.5,
        taskCreationRate: 15
      };

      mockDashboardService.getDashboardMetrics.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useDashboardMetrics(), {
        wrapper: createWrapper()
      });

      // Assert
      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockDashboardService.getDashboardMetrics).toHaveBeenCalledTimes(1);
    });

    it('should handle error when fetching dashboard metrics', async () => {
      // Arrange
      const mockError = new Error('API Error');
      mockDashboardService.getDashboardMetrics.mockRejectedValue(mockError);

      // Act
      const { result } = renderHook(() => useDashboardMetrics(), {
        wrapper: createWrapper()
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('useTaskStatusMetrics', () => {
    it('should fetch task status metrics without date parameters', async () => {
      // Arrange
      const mockData = {
        statusDistribution: [
          { status: 'COMPLETED', statusName: 'Completadas', count: 300, percentage: 60.0, color: '#10B981' }
        ],
        statusByCategory: [],
        statusByPriority: [],
        totalTasks: 500,
        periodStart: '2024-01-01T00:00:00',
        periodEnd: '2024-01-31T23:59:59',
        generatedAt: '2024-01-31T12:00:00'
      };

      mockDashboardService.getTaskStatusMetrics.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useTaskStatusMetrics(), {
        wrapper: createWrapper()
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockDashboardService.getTaskStatusMetrics).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should fetch task status metrics with date parameters', async () => {
      // Arrange
      const startDate = '2024-01-01T00:00:00';
      const endDate = '2024-01-31T23:59:59';
      const mockData = {
        statusDistribution: [],
        statusByCategory: [],
        statusByPriority: [],
        totalTasks: 0
      };

      mockDashboardService.getTaskStatusMetrics.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useTaskStatusMetrics(startDate, endDate), {
        wrapper: createWrapper()
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockDashboardService.getTaskStatusMetrics).toHaveBeenCalledWith(startDate, endDate);
    });

    it('should update query key when date parameters change', async () => {
      // Arrange
      const mockData = { statusDistribution: [], statusByCategory: [], statusByPriority: [] };
      mockDashboardService.getTaskStatusMetrics.mockResolvedValue(mockData);

      // Act
      const { result, rerender } = renderHook(
        ({ startDate, endDate }) => useTaskStatusMetrics(startDate, endDate),
        {
          wrapper: createWrapper(),
          initialProps: { startDate: '2024-01-01T00:00:00', endDate: '2024-01-31T23:59:59' }
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Cambiar las fechas
      rerender({ startDate: '2024-02-01T00:00:00', endDate: '2024-02-28T23:59:59' });

      // Assert
      await waitFor(() => {
        expect(mockDashboardService.getTaskStatusMetrics).toHaveBeenCalledWith(
          '2024-02-01T00:00:00',
          '2024-02-28T23:59:59'
        );
      });
    });
  });

  describe('useUserActivityMetrics', () => {
    it('should fetch user activity metrics successfully', async () => {
      // Arrange
      const mockData = {
        topActiveUsers: [
          {
            userId: 1,
            username: 'juan.perez',
            fullName: 'Juan Pérez',
            tasksAssigned: 25,
            tasksCompleted: 22,
            completionRate: 88.0
          }
        ],
        userActivityTimeline: [],
        userRoleDistribution: [],
        totalActiveUsers: 45,
        averageTasksPerUser: 8.5,
        averageCompletionRate: 87.3
      };

      mockDashboardService.getUserActivityMetrics.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useUserActivityMetrics(), {
        wrapper: createWrapper()
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockDashboardService.getUserActivityMetrics).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  describe('useCategoryDistribution', () => {
    it('should fetch category distribution successfully', async () => {
      // Arrange
      const mockData = {
        categories: [
          {
            id: 1,
            name: 'Desarrollo',
            description: 'Tareas de desarrollo',
            count: 150,
            percentage: 50.0,
            completedCount: 120,
            completionRate: 80.0,
            color: '#3B82F6'
          }
        ],
        categoryTrends: [],
        totalTasks: 300
      };

      mockDashboardService.getCategoryDistribution.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => useCategoryDistribution(), {
        wrapper: createWrapper()
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('usePriorityDistribution', () => {
    it('should fetch priority distribution successfully', async () => {
      // Arrange
      const mockData = {
        priorities: [
          {
            name: 'HIGH',
            displayName: 'Alta',
            priorityOrder: 1,
            count: 85,
            percentage: 28.3,
            completedCount: 72,
            completionRate: 84.7,
            overdueCount: 3,
            color: '#EF4444'
          }
        ],
        priorityTrends: [],
        totalTasks: 300
      };

      mockDashboardService.getPriorityDistribution.mockResolvedValue(mockData);

      // Act
      const { result } = renderHook(() => usePriorityDistribution(), {
        wrapper: createWrapper()
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('Cache behavior', () => {
    it('should use cached data for same query parameters', async () => {
      // Arrange
      const mockData = { statusDistribution: [], statusByCategory: [], statusByPriority: [] };
      mockDashboardService.getTaskStatusMetrics.mockResolvedValue(mockData);

      const wrapper = createWrapper();

      // Act - Primera llamada
      const { result: result1 } = renderHook(
        () => useTaskStatusMetrics('2024-01-01T00:00:00', '2024-01-31T23:59:59'),
        { wrapper }
      );

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      // Act - Segunda llamada con los mismos parámetros
      const { result: result2 } = renderHook(
        () => useTaskStatusMetrics('2024-01-01T00:00:00', '2024-01-31T23:59:59'),
        { wrapper }
      );

      // Assert
      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      // Debería haber sido llamado solo una vez debido al caché
      expect(mockDashboardService.getTaskStatusMetrics).toHaveBeenCalledTimes(1);
    });
  });
});
