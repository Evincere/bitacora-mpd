import api from '@/utils/api-ky';
import {
  DashboardMetrics,
  TaskStatusMetrics,
  UserActivityMetrics,
  CategoryDistribution,
  PriorityDistribution,
  TimelineMetrics,
  PerformanceMetrics
} from '../types/dashboardTypes';

/**
 * Servicio para obtener métricas y datos para el dashboard administrativo
 * Conectado con los endpoints reales del backend
 */
const dashboardService = {
  /**
   * Obtiene todas las métricas del dashboard
   * @returns Métricas del dashboard
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await api.get('admin/dashboard/metrics/overview').json<any>();

      // Mapear la respuesta del backend al formato esperado por el frontend
      return {
        totalTasks: response.totalTasks,
        completedTasks: response.completedTasks,
        pendingTasks: response.activeTasks, // activeTasks en backend = pendingTasks en frontend
        overdueTasksCount: response.overdueTasks,
        averageCompletionTime: response.averageResolutionTimeHours,
        activeUsers: response.activeUsers,
        taskCompletionRate: response.onTimeCompletionRate,
        taskCreationRate: response.tasksCreatedToday // Aproximación para tasa de creación
      };
    } catch (error) {
      console.error('Error al obtener métricas del dashboard:', error);
      throw error; // Propagar el error en lugar de usar fallback
    }
  },

  /**
   * Obtiene métricas de estado de tareas
   * @param startDate Fecha de inicio (opcional)
   * @param endDate Fecha de fin (opcional)
   * @returns Métricas de estado de tareas
   */
  async getTaskStatusMetrics(startDate?: string, endDate?: string): Promise<TaskStatusMetrics> {
    try {
      let url = 'admin/dashboard/metrics/task-status';
      const params = new URLSearchParams();

      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url).json<any>();

      // Mapear la respuesta del backend al formato esperado por el frontend
      return {
        statusDistribution: response.statusDistribution.map((item: any) => ({
          status: item.status,
          statusName: item.statusName,
          count: item.count,
          percentage: item.percentage,
          color: item.color
        })),
        // Mantener compatibilidad con el formato anterior agregando campos adicionales
        statusByCategory: [], // Se puede implementar más tarde si es necesario
        statusByPriority: [], // Se puede implementar más tarde si es necesario
        totalTasks: response.totalTasks,
        periodStart: response.periodStart,
        periodEnd: response.periodEnd,
        generatedAt: response.generatedAt
      };
    } catch (error) {
      console.error('Error al obtener métricas de estado de tareas:', error);
      throw error;
    }
  },

  /**
   * Obtiene métricas de actividad de usuarios
   * @param startDate Fecha de inicio (opcional)
   * @param endDate Fecha de fin (opcional)
   * @returns Métricas de actividad de usuarios
   */
  async getUserActivityMetrics(startDate?: string, endDate?: string): Promise<UserActivityMetrics> {
    try {
      let url = 'admin/dashboard/metrics/user-activity';
      const params = new URLSearchParams();

      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url).json<any>();

      // Mapear la respuesta del backend al formato esperado por el frontend
      return {
        topActiveUsers: response.topActiveUsers.map((user: any) => ({
          userId: user.userId,
          username: user.userEmail?.split('@')[0] || `user${user.userId}`, // Extraer username del email
          fullName: user.userName,
          tasksCompleted: user.tasksCompleted,
          tasksAssigned: user.tasksAssigned,
          completionRate: user.completionRate,
          averageResolutionTimeHours: user.averageResolutionTimeHours,
          lastActivity: user.lastActivity
        })),
        // Mantener compatibilidad con campos adicionales
        userActivityTimeline: [], // Se puede implementar más tarde si es necesario
        userRoleDistribution: [], // Se puede implementar más tarde si es necesario
        totalActiveUsers: response.totalActiveUsers,
        averageTasksPerUser: response.averageTasksPerUser,
        averageCompletionRate: response.averageCompletionRate,
        periodStart: response.periodStart,
        periodEnd: response.periodEnd,
        generatedAt: response.generatedAt
      };
    } catch (error) {
      console.error('Error al obtener métricas de actividad de usuarios:', error);
      throw error;
    }
  },

  /**
   * Obtiene distribución de categorías
   * @param startDate Fecha de inicio (opcional)
   * @param endDate Fecha de fin (opcional)
   * @returns Distribución de categorías
   */
  async getCategoryDistribution(startDate?: string, endDate?: string): Promise<CategoryDistribution> {
    try {
      let url = 'admin/dashboard/metrics/category-distribution';
      const params = new URLSearchParams();

      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url).json<any>();

      // Mapear la respuesta del backend al formato esperado por el frontend
      return {
        categories: response.categoryDistribution.map((category: any) => ({
          id: category.categoryId,
          name: category.categoryName,
          description: category.categoryDescription,
          count: category.count,
          percentage: category.percentage,
          completedCount: category.completedCount,
          completionRate: category.completionRate,
          averageResolutionTimeHours: category.averageResolutionTimeHours,
          color: category.color
        })),
        // Mantener compatibilidad con campos adicionales
        categoryTrends: [], // Se puede implementar más tarde si es necesario
        totalTasks: response.totalTasks,
        periodStart: response.periodStart,
        periodEnd: response.periodEnd,
        generatedAt: response.generatedAt
      };
    } catch (error) {
      console.error('Error al obtener distribución de categorías:', error);
      throw error;
    }
  },

  /**
   * Obtiene distribución de prioridades
   * @param startDate Fecha de inicio (opcional)
   * @param endDate Fecha de fin (opcional)
   * @returns Distribución de prioridades
   */
  async getPriorityDistribution(startDate?: string, endDate?: string): Promise<PriorityDistribution> {
    try {
      let url = 'admin/dashboard/metrics/priority-distribution';
      const params = new URLSearchParams();

      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url).json<any>();

      // Mapear la respuesta del backend al formato esperado por el frontend
      return {
        priorities: response.priorityDistribution.map((priority: any) => ({
          name: priority.priority,
          displayName: priority.priorityName,
          priorityOrder: priority.priorityOrder,
          count: priority.count,
          percentage: priority.percentage,
          completedCount: priority.completedCount,
          completionRate: priority.completionRate,
          averageResolutionTimeHours: priority.averageResolutionTimeHours,
          overdueCount: priority.overdueCount,
          color: priority.color
        })),
        // Mantener compatibilidad con campos adicionales
        priorityTrends: [], // Se puede implementar más tarde si es necesario
        totalTasks: response.totalTasks,
        periodStart: response.periodStart,
        periodEnd: response.periodEnd,
        generatedAt: response.generatedAt
      };
    } catch (error) {
      console.error('Error al obtener distribución de prioridades:', error);
      throw error;
    }
  },

  /**
   * Obtiene métricas de línea de tiempo
   * @param startDate Fecha de inicio
   * @param endDate Fecha de fin
   * @returns Métricas de línea de tiempo
   * @note Este endpoint aún no está implementado en el backend
   */
  async getTimelineMetrics(startDate: string, endDate: string): Promise<TimelineMetrics> {
    try {
      const response = await api.get(`admin/dashboard/metrics/timeline?startDate=${startDate}&endDate=${endDate}`).json<TimelineMetrics>();
      return response;
    } catch (error) {
      console.error('Error al obtener métricas de línea de tiempo:', error);
      throw error;
    }
  },

  /**
   * Obtiene métricas de rendimiento
   * @returns Métricas de rendimiento
   * @note Este endpoint aún no está implementado en el backend
   */
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      const response = await api.get('admin/dashboard/metrics/performance').json<PerformanceMetrics>();
      return response;
    } catch (error) {
      console.error('Error al obtener métricas de rendimiento:', error);
      throw error;
    }
  }
};

export default dashboardService;
