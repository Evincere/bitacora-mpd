/**
 * Métricas generales del dashboard
 */
export interface DashboardMetrics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasksCount: number;
  averageCompletionTime: number;
  activeUsers: number;
  taskCompletionRate: number;
  taskCreationRate: number;
}

/**
 * Distribución de estado de tareas
 */
export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

/**
 * Conteo de estados por categoría
 */
export interface StatusByCategory {
  category: string;
  counts: {
    [key: string]: number;
  };
}

/**
 * Conteo de estados por prioridad
 */
export interface StatusByPriority {
  priority: string;
  counts: {
    [key: string]: number;
  };
}

/**
 * Métricas de estado de tareas
 */
export interface TaskStatusMetrics {
  statusDistribution: StatusDistribution[];
  statusByCategory: StatusByCategory[];
  statusByPriority: StatusByPriority[];
}

/**
 * Usuario activo
 */
export interface ActiveUser {
  userId: number;
  username: string;
  fullName: string;
  tasksCompleted: number;
  tasksAssigned: number;
}

/**
 * Actividad diaria de usuarios
 */
export interface DailyUserActivity {
  date: string;
  activeUsers: number;
  tasksCreated: number;
  tasksCompleted: number;
}

/**
 * Distribución de roles de usuario
 */
export interface RoleDistribution {
  role: string;
  count: number;
  percentage: number;
}

/**
 * Métricas de actividad de usuarios
 */
export interface UserActivityMetrics {
  topActiveUsers: ActiveUser[];
  userActivityTimeline: DailyUserActivity[];
  userRoleDistribution: RoleDistribution[];
}

/**
 * Categoría
 */
export interface Category {
  name: string;
  count: number;
  percentage: number;
}

/**
 * Tendencia de categoría
 */
export interface CategoryTrend {
  category: string;
  data: number[];
}

/**
 * Distribución de categorías
 */
export interface CategoryDistribution {
  categories: Category[];
  categoryTrends: CategoryTrend[];
}

/**
 * Prioridad
 */
export interface Priority {
  name: string;
  count: number;
  percentage: number;
}

/**
 * Tendencia de prioridad
 */
export interface PriorityTrend {
  priority: string;
  data: number[];
}

/**
 * Distribución de prioridades
 */
export interface PriorityDistribution {
  priorities: Priority[];
  priorityTrends: PriorityTrend[];
}

/**
 * Punto de línea de tiempo
 */
export interface TimelinePoint {
  date: string;
  count: number;
}

/**
 * Métricas de línea de tiempo
 */
export interface TimelineMetrics {
  taskCreationTimeline: TimelinePoint[];
  taskCompletionTimeline: TimelinePoint[];
}

/**
 * Tasa de finalización por usuario
 */
export interface CompletionRateByUser {
  userId: number;
  username: string;
  fullName: string;
  completionRate: number;
}

/**
 * Tasa de finalización por categoría
 */
export interface CompletionRateByCategory {
  category: string;
  completionRate: number;
}

/**
 * Tasa de finalización por prioridad
 */
export interface CompletionRateByPriority {
  priority: string;
  completionRate: number;
}

/**
 * Métricas de rendimiento
 */
export interface PerformanceMetrics {
  averageResponseTime: number;
  averageResolutionTime: number;
  completionRateByUser: CompletionRateByUser[];
  completionRateByCategory: CompletionRateByCategory[];
  completionRateByPriority: CompletionRateByPriority[];
}

/**
 * Filtros para el dashboard
 */
export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  priority?: string;
  status?: string;
  userId?: number;
}
