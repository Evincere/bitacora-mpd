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
 */
const dashboardService = {
  /**
   * Obtiene todas las métricas del dashboard
   * @returns Métricas del dashboard
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await api.get('dashboard/metrics').json<DashboardMetrics>();
      return response;
    } catch (error) {
      console.error('Error al obtener métricas del dashboard:', error);
      
      // Datos de ejemplo como fallback
      return {
        totalTasks: 245,
        completedTasks: 187,
        pendingTasks: 58,
        overdueTasksCount: 12,
        averageCompletionTime: 3.5,
        activeUsers: 28,
        taskCompletionRate: 76.3,
        taskCreationRate: 8.2
      };
    }
  },
  
  /**
   * Obtiene métricas de estado de tareas
   * @returns Métricas de estado de tareas
   */
  async getTaskStatusMetrics(): Promise<TaskStatusMetrics> {
    try {
      const response = await api.get('dashboard/metrics/task-status').json<TaskStatusMetrics>();
      return response;
    } catch (error) {
      console.error('Error al obtener métricas de estado de tareas:', error);
      
      // Datos de ejemplo como fallback
      return {
        statusDistribution: [
          { status: 'PENDING', count: 15, percentage: 6.1 },
          { status: 'ASSIGNED', count: 43, percentage: 17.6 },
          { status: 'IN_PROGRESS', count: 67, percentage: 27.3 },
          { status: 'COMPLETED', count: 120, percentage: 49.0 }
        ],
        statusByCategory: [
          { 
            category: 'Administrativa', 
            counts: {
              PENDING: 5,
              ASSIGNED: 12,
              IN_PROGRESS: 18,
              COMPLETED: 45
            }
          },
          { 
            category: 'Judicial', 
            counts: {
              PENDING: 7,
              ASSIGNED: 20,
              IN_PROGRESS: 35,
              COMPLETED: 60
            }
          },
          { 
            category: 'Consulta', 
            counts: {
              PENDING: 3,
              ASSIGNED: 11,
              IN_PROGRESS: 14,
              COMPLETED: 15
            }
          }
        ],
        statusByPriority: [
          { 
            priority: 'ALTA', 
            counts: {
              PENDING: 8,
              ASSIGNED: 15,
              IN_PROGRESS: 22,
              COMPLETED: 30
            }
          },
          { 
            priority: 'MEDIA', 
            counts: {
              PENDING: 5,
              ASSIGNED: 20,
              IN_PROGRESS: 30,
              COMPLETED: 50
            }
          },
          { 
            priority: 'BAJA', 
            counts: {
              PENDING: 2,
              ASSIGNED: 8,
              IN_PROGRESS: 15,
              COMPLETED: 40
            }
          }
        ]
      };
    }
  },
  
  /**
   * Obtiene métricas de actividad de usuarios
   * @returns Métricas de actividad de usuarios
   */
  async getUserActivityMetrics(): Promise<UserActivityMetrics> {
    try {
      const response = await api.get('dashboard/metrics/user-activity').json<UserActivityMetrics>();
      return response;
    } catch (error) {
      console.error('Error al obtener métricas de actividad de usuarios:', error);
      
      // Datos de ejemplo como fallback
      return {
        topActiveUsers: [
          { userId: 1, username: 'jperez', fullName: 'Juan Pérez', tasksCompleted: 45, tasksAssigned: 50 },
          { userId: 2, username: 'mlopez', fullName: 'María López', tasksCompleted: 38, tasksAssigned: 40 },
          { userId: 3, username: 'cgomez', fullName: 'Carlos Gómez', tasksCompleted: 32, tasksAssigned: 35 },
          { userId: 4, username: 'lrodriguez', fullName: 'Laura Rodríguez', tasksCompleted: 28, tasksAssigned: 30 },
          { userId: 5, username: 'agarcia', fullName: 'Ana García', tasksCompleted: 25, tasksAssigned: 28 }
        ],
        userActivityTimeline: [
          { date: '2023-11-01', activeUsers: 18, tasksCreated: 12, tasksCompleted: 10 },
          { date: '2023-11-02', activeUsers: 20, tasksCreated: 15, tasksCompleted: 13 },
          { date: '2023-11-03', activeUsers: 22, tasksCreated: 18, tasksCompleted: 14 },
          { date: '2023-11-04', activeUsers: 19, tasksCreated: 14, tasksCompleted: 16 },
          { date: '2023-11-05', activeUsers: 21, tasksCreated: 16, tasksCompleted: 15 },
          { date: '2023-11-06', activeUsers: 23, tasksCreated: 20, tasksCompleted: 18 },
          { date: '2023-11-07', activeUsers: 25, tasksCreated: 22, tasksCompleted: 20 }
        ],
        userRoleDistribution: [
          { role: 'ADMIN', count: 2, percentage: 7.1 },
          { role: 'ASIGNADOR', count: 3, percentage: 10.7 },
          { role: 'EJECUTOR', count: 15, percentage: 53.6 },
          { role: 'SOLICITANTE', count: 8, percentage: 28.6 }
        ]
      };
    }
  },
  
  /**
   * Obtiene distribución de categorías
   * @returns Distribución de categorías
   */
  async getCategoryDistribution(): Promise<CategoryDistribution> {
    try {
      const response = await api.get('dashboard/metrics/categories').json<CategoryDistribution>();
      return response;
    } catch (error) {
      console.error('Error al obtener distribución de categorías:', error);
      
      // Datos de ejemplo como fallback
      return {
        categories: [
          { name: 'Administrativa', count: 80, percentage: 32.7 },
          { name: 'Judicial', count: 122, percentage: 49.8 },
          { name: 'Consulta', count: 43, percentage: 17.5 }
        ],
        categoryTrends: [
          { 
            category: 'Administrativa', 
            data: [15, 18, 20, 17, 22, 25, 28] 
          },
          { 
            category: 'Judicial', 
            data: [25, 28, 30, 32, 35, 38, 40] 
          },
          { 
            category: 'Consulta', 
            data: [10, 12, 15, 13, 14, 16, 18] 
          }
        ]
      };
    }
  },
  
  /**
   * Obtiene distribución de prioridades
   * @returns Distribución de prioridades
   */
  async getPriorityDistribution(): Promise<PriorityDistribution> {
    try {
      const response = await api.get('dashboard/metrics/priorities').json<PriorityDistribution>();
      return response;
    } catch (error) {
      console.error('Error al obtener distribución de prioridades:', error);
      
      // Datos de ejemplo como fallback
      return {
        priorities: [
          { name: 'ALTA', count: 75, percentage: 30.6 },
          { name: 'MEDIA', count: 105, percentage: 42.9 },
          { name: 'BAJA', count: 65, percentage: 26.5 }
        ],
        priorityTrends: [
          { 
            priority: 'ALTA', 
            data: [18, 20, 22, 25, 28, 30, 32] 
          },
          { 
            priority: 'MEDIA', 
            data: [30, 32, 35, 38, 40, 42, 45] 
          },
          { 
            priority: 'BAJA', 
            data: [15, 18, 20, 22, 25, 28, 30] 
          }
        ]
      };
    }
  },
  
  /**
   * Obtiene métricas de línea de tiempo
   * @param startDate Fecha de inicio
   * @param endDate Fecha de fin
   * @returns Métricas de línea de tiempo
   */
  async getTimelineMetrics(startDate: string, endDate: string): Promise<TimelineMetrics> {
    try {
      const params = new URLSearchParams();
      params.append('startDate', startDate);
      params.append('endDate', endDate);
      
      const response = await api.get(`dashboard/metrics/timeline?${params.toString()}`).json<TimelineMetrics>();
      return response;
    } catch (error) {
      console.error('Error al obtener métricas de línea de tiempo:', error);
      
      // Datos de ejemplo como fallback
      return {
        taskCreationTimeline: [
          { date: '2023-11-01', count: 12 },
          { date: '2023-11-02', count: 15 },
          { date: '2023-11-03', count: 18 },
          { date: '2023-11-04', count: 14 },
          { date: '2023-11-05', count: 16 },
          { date: '2023-11-06', count: 20 },
          { date: '2023-11-07', count: 22 }
        ],
        taskCompletionTimeline: [
          { date: '2023-11-01', count: 10 },
          { date: '2023-11-02', count: 13 },
          { date: '2023-11-03', count: 14 },
          { date: '2023-11-04', count: 16 },
          { date: '2023-11-05', count: 15 },
          { date: '2023-11-06', count: 18 },
          { date: '2023-11-07', count: 20 }
        ]
      };
    }
  },
  
  /**
   * Obtiene métricas de rendimiento
   * @returns Métricas de rendimiento
   */
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      const response = await api.get('dashboard/metrics/performance').json<PerformanceMetrics>();
      return response;
    } catch (error) {
      console.error('Error al obtener métricas de rendimiento:', error);
      
      // Datos de ejemplo como fallback
      return {
        averageResponseTime: 2.3,
        averageResolutionTime: 3.5,
        completionRateByUser: [
          { userId: 1, username: 'jperez', fullName: 'Juan Pérez', completionRate: 90.0 },
          { userId: 2, username: 'mlopez', fullName: 'María López', completionRate: 95.0 },
          { userId: 3, username: 'cgomez', fullName: 'Carlos Gómez', completionRate: 91.4 },
          { userId: 4, username: 'lrodriguez', fullName: 'Laura Rodríguez', completionRate: 93.3 },
          { userId: 5, username: 'agarcia', fullName: 'Ana García', completionRate: 89.3 }
        ],
        completionRateByCategory: [
          { category: 'Administrativa', completionRate: 92.5 },
          { category: 'Judicial', completionRate: 88.7 },
          { category: 'Consulta', completionRate: 95.3 }
        ],
        completionRateByPriority: [
          { priority: 'ALTA', completionRate: 96.0 },
          { priority: 'MEDIA', completionRate: 90.5 },
          { priority: 'BAJA', completionRate: 85.2 }
        ]
      };
    }
  }
};

export default dashboardService;
