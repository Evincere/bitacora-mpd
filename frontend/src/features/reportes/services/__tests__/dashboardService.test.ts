import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import dashboardService from '../dashboardService';
import api from '@/utils/api-ky';

// Mock del módulo api
vi.mock('@/utils/api-ky', () => ({
  default: {
    get: vi.fn()
  }
}));

const mockApi = vi.mocked(api);

describe('DashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getDashboardMetrics', () => {
    it('should fetch dashboard metrics successfully', async () => {
      // Arrange
      const mockResponse = {
        totalTasks: 1000,
        activeTasks: 250,
        completedTasks: 750,
        overdueTasks: 5,
        averageResolutionTimeHours: 24.5,
        activeUsers: 35,
        onTimeCompletionRate: 87.5,
        tasksCreatedToday: 15
      };

      mockApi.get.mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse)
      } as any);

      // Act
      const result = await dashboardService.getDashboardMetrics();

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('admin/dashboard/metrics/overview');
      expect(result).toEqual({
        totalTasks: 1000,
        completedTasks: 750,
        pendingTasks: 250,
        overdueTasksCount: 5,
        averageCompletionTime: 24.5,
        activeUsers: 35,
        taskCompletionRate: 87.5,
        taskCreationRate: 15
      });
    });

    it('should throw error when API call fails', async () => {
      // Arrange
      const mockError = new Error('Network error');
      mockApi.get.mockReturnValue({
        json: vi.fn().mockRejectedValue(mockError)
      } as any);

      // Act & Assert
      await expect(dashboardService.getDashboardMetrics()).rejects.toThrow('Network error');
      expect(mockApi.get).toHaveBeenCalledWith('admin/dashboard/metrics/overview');
    });
  });

  describe('getTaskStatusMetrics', () => {
    it('should fetch task status metrics without date parameters', async () => {
      // Arrange
      const mockResponse = {
        statusDistribution: [
          { status: 'COMPLETED', statusName: 'Completadas', count: 300, percentage: 60.0, color: '#10B981' },
          { status: 'IN_PROGRESS', statusName: 'En Progreso', count: 150, percentage: 30.0, color: '#3B82F6' }
        ],
        totalTasks: 450,
        periodStart: '2024-01-01T00:00:00',
        periodEnd: '2024-01-31T23:59:59',
        generatedAt: '2024-01-31T12:00:00'
      };

      mockApi.get.mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse)
      } as any);

      // Act
      const result = await dashboardService.getTaskStatusMetrics();

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('admin/dashboard/metrics/task-status');
      expect(result.statusDistribution).toHaveLength(2);
      expect(result.statusDistribution[0]).toEqual({
        status: 'COMPLETED',
        statusName: 'Completadas',
        count: 300,
        percentage: 60.0,
        color: '#10B981'
      });
      expect(result.totalTasks).toBe(450);
    });

    it('should fetch task status metrics with date parameters', async () => {
      // Arrange
      const startDate = '2024-01-01T00:00:00';
      const endDate = '2024-01-31T23:59:59';
      const mockResponse = {
        statusDistribution: [],
        totalTasks: 0,
        periodStart: startDate,
        periodEnd: endDate,
        generatedAt: '2024-01-31T12:00:00'
      };

      mockApi.get.mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse)
      } as any);

      // Act
      await dashboardService.getTaskStatusMetrics(startDate, endDate);

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith(
        'admin/dashboard/metrics/task-status?startDate=2024-01-01T00%3A00%3A00&endDate=2024-01-31T23%3A59%3A59'
      );
    });
  });

  describe('getUserActivityMetrics', () => {
    it('should fetch user activity metrics successfully', async () => {
      // Arrange
      const mockResponse = {
        topActiveUsers: [
          {
            userId: 1,
            userName: 'Juan Pérez',
            userEmail: 'juan.perez@empresa.com',
            tasksAssigned: 25,
            tasksCompleted: 22,
            completionRate: 88.0,
            averageResolutionTimeHours: 18.5,
            lastActivity: '2024-01-31T10:00:00'
          }
        ],
        totalActiveUsers: 45,
        averageTasksPerUser: 8.5,
        averageCompletionRate: 87.3,
        periodStart: '2024-01-01T00:00:00',
        periodEnd: '2024-01-31T23:59:59',
        generatedAt: '2024-01-31T12:00:00'
      };

      mockApi.get.mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse)
      } as any);

      // Act
      const result = await dashboardService.getUserActivityMetrics();

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('admin/dashboard/metrics/user-activity');
      expect(result.topActiveUsers).toHaveLength(1);
      expect(result.topActiveUsers[0]).toEqual({
        userId: 1,
        username: 'juan.perez',
        fullName: 'Juan Pérez',
        tasksAssigned: 25,
        tasksCompleted: 22,
        completionRate: 88.0,
        averageResolutionTimeHours: 18.5,
        lastActivity: '2024-01-31T10:00:00'
      });
      expect(result.totalActiveUsers).toBe(45);
    });
  });

  describe('getCategoryDistribution', () => {
    it('should fetch category distribution successfully', async () => {
      // Arrange
      const mockResponse = {
        categoryDistribution: [
          {
            categoryId: 1,
            categoryName: 'Desarrollo',
            categoryDescription: 'Tareas de desarrollo',
            count: 150,
            percentage: 50.0,
            completedCount: 120,
            completionRate: 80.0,
            averageResolutionTimeHours: 32.5,
            color: '#3B82F6'
          }
        ],
        totalTasks: 300,
        periodStart: '2024-01-01T00:00:00',
        periodEnd: '2024-01-31T23:59:59',
        generatedAt: '2024-01-31T12:00:00'
      };

      mockApi.get.mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse)
      } as any);

      // Act
      const result = await dashboardService.getCategoryDistribution();

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('admin/dashboard/metrics/category-distribution');
      expect(result.categories).toHaveLength(1);
      expect(result.categories[0]).toEqual({
        id: 1,
        name: 'Desarrollo',
        description: 'Tareas de desarrollo',
        count: 150,
        percentage: 50.0,
        completedCount: 120,
        completionRate: 80.0,
        averageResolutionTimeHours: 32.5,
        color: '#3B82F6'
      });
    });
  });

  describe('getPriorityDistribution', () => {
    it('should fetch priority distribution successfully', async () => {
      // Arrange
      const mockResponse = {
        priorityDistribution: [
          {
            priority: 'HIGH',
            priorityName: 'Alta',
            priorityOrder: 1,
            count: 85,
            percentage: 28.3,
            completedCount: 72,
            completionRate: 84.7,
            averageResolutionTimeHours: 16.2,
            overdueCount: 3,
            color: '#EF4444'
          }
        ],
        totalTasks: 300,
        periodStart: '2024-01-01T00:00:00',
        periodEnd: '2024-01-31T23:59:59',
        generatedAt: '2024-01-31T12:00:00'
      };

      mockApi.get.mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse)
      } as any);

      // Act
      const result = await dashboardService.getPriorityDistribution();

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('admin/dashboard/metrics/priority-distribution');
      expect(result.priorities).toHaveLength(1);
      expect(result.priorities[0]).toEqual({
        name: 'HIGH',
        displayName: 'Alta',
        priorityOrder: 1,
        count: 85,
        percentage: 28.3,
        completedCount: 72,
        completionRate: 84.7,
        averageResolutionTimeHours: 16.2,
        overdueCount: 3,
        color: '#EF4444'
      });
    });
  });

  describe('getTimelineMetrics', () => {
    it('should return mock data with warning for unimplemented endpoint', async () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Act
      const result = await dashboardService.getTimelineMetrics('2024-01-01', '2024-01-31');

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Endpoint de timeline metrics no implementado aún, usando datos mock');
      expect(result.taskCreationTimeline).toBeDefined();
      expect(result.taskCompletionTimeline).toBeDefined();
      
      consoleSpy.mockRestore();
    });
  });

  describe('getPerformanceMetrics', () => {
    it('should return mock data with warning for unimplemented endpoint', async () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Act
      const result = await dashboardService.getPerformanceMetrics();

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Endpoint de performance metrics no implementado aún, usando datos mock');
      expect(result.averageResponseTime).toBeDefined();
      expect(result.averageResolutionTime).toBeDefined();
      expect(result.completionRateByUser).toBeDefined();
      
      consoleSpy.mockRestore();
    });
  });
});
