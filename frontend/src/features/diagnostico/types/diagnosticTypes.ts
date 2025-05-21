/**
 * Estado de salud de un componente del sistema
 */
export interface ComponentHealth {
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  details?: Record<string, any>;
}

/**
 * Estado de salud del sistema
 */
export interface SystemHealth {
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  components: {
    database?: ComponentHealth;
    diskSpace?: ComponentHealth;
    jvm?: ComponentHealth;
    mail?: ComponentHealth;
    redis?: ComponentHealth;
    [key: string]: ComponentHealth | undefined;
  };
  lastUpdated: string;
}

/**
 * Estadísticas de una tabla de la base de datos
 */
export interface TableStats {
  tableName: string;
  rowCount: number;
  sizeKb: number;
  lastUpdated: string;
}

/**
 * Estadísticas del pool de conexiones
 */
export interface ConnectionPoolStats {
  active: number;
  idle: number;
  max: number;
  min: number;
  pending: number;
}

/**
 * Estadísticas de consultas
 */
export interface QueryStats {
  slowQueries: number;
  averageQueryTime: number;
  queriesPerMinute: number;
}

/**
 * Estadísticas de la base de datos
 */
export interface DatabaseStats {
  tableStats: TableStats[];
  totalSize: number;
  connectionPoolStats: ConnectionPoolStats;
  queryStats: QueryStats;
}

/**
 * Problema de integridad de datos
 */
export interface DataIntegrityIssue {
  type: string;
  entity: string;
  description: string;
  count: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  fixAvailable: boolean;
}

/**
 * Resultado de verificación de integridad de datos
 */
export interface DataIntegrityResult {
  status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  startTime: string;
  endTime: string;
  issues: DataIntegrityIssue[];
  totalIssues: number;
  recommendations: string[];
}

/**
 * Recurso del sistema
 */
export interface SystemResource {
  name: string;
  usage: number;
  total: number;
  unit: string;
}

/**
 * Entrada de log del sistema
 */
export interface LogEntry {
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';
  logger: string;
  message: string;
  thread: string;
  stackTrace: string | null;
}

/**
 * Resultado de una tarea de mantenimiento
 */
export interface MaintenanceTaskResult {
  success: boolean;
  message: string;
  details?: Record<string, any>;
}

/**
 * Tarea de mantenimiento
 */
export interface MaintenanceTask {
  id: string;
  taskType: string;
  status: 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  startTime: string;
  endTime: string | null;
  parameters: Record<string, any>;
  result: MaintenanceTaskResult | null;
}

/**
 * Información de backup
 */
export interface BackupInfo {
  id: string;
  type: 'FULL' | 'INCREMENTAL';
  creationDate: string;
  size: number;
  location: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

/**
 * Información de tarea programada
 */
export interface ScheduledTaskInfo {
  id: string;
  name: string;
  description: string;
  cronExpression: string;
  lastExecution: string;
  nextExecution: string;
  status: 'ACTIVE' | 'PAUSED';
}

/**
 * Estadísticas de una caché
 */
export interface CacheInfo {
  name: string;
  size: number;
  hitCount: number;
  missCount: number;
  hitRatio: number;
}

/**
 * Estadísticas de caché
 */
export interface CacheStats {
  caches: CacheInfo[];
  totalSize: number;
  averageHitRatio: number;
}

/**
 * Tipo de severidad para alertas
 */
export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

/**
 * Alerta del sistema
 */
export interface SystemAlert {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  source: string;
  acknowledged: boolean;
}

/**
 * Filtros para logs
 */
export interface LogFilters {
  level?: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';
  startDate?: string;
  endDate?: string;
  logger?: string;
  search?: string;
  limit?: number;
}

/**
 * Filtros para tareas de mantenimiento
 */
export interface MaintenanceTaskFilters {
  status?: 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  taskType?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Filtros para backups
 */
export interface BackupFilters {
  type?: 'FULL' | 'INCREMENTAL';
  startDate?: string;
  endDate?: string;
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

/**
 * Filtros para tareas programadas
 */
export interface ScheduledTaskFilters {
  status?: 'ACTIVE' | 'PAUSED';
  search?: string;
}
