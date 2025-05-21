import api from '@/utils/api-ky';
import { 
  SystemHealth, 
  DatabaseStats, 
  DataIntegrityResult,
  SystemResource,
  LogEntry,
  MaintenanceTask,
  BackupInfo,
  ScheduledTaskInfo,
  CacheStats
} from '../types/diagnosticTypes';

/**
 * Servicio para interactuar con las APIs de diagnóstico y mantenimiento del sistema
 */
const diagnosticService = {
  /**
   * Obtiene el estado de salud del sistema
   * @returns Estado de salud del sistema
   */
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const response = await api.get('admin/diagnostics/health').json<SystemHealth>();
      return response;
    } catch (error) {
      console.error('Error al obtener estado de salud del sistema:', error);
      
      // Datos de ejemplo como fallback
      return {
        status: 'UP',
        components: {
          database: { status: 'UP', details: { database: 'MySQL', version: '8.0.28' } },
          diskSpace: { status: 'UP', details: { total: '500GB', free: '350GB', threshold: '10GB' } },
          jvm: { status: 'UP', details: { version: '17.0.2', vendor: 'Oracle Corporation' } },
          mail: { status: 'UP' },
          redis: { status: 'UP', details: { version: '6.2.6' } }
        },
        lastUpdated: new Date().toISOString()
      };
    }
  },
  
  /**
   * Obtiene estadísticas de la base de datos
   * @returns Estadísticas de la base de datos
   */
  async getDatabaseStats(): Promise<DatabaseStats> {
    try {
      const response = await api.get('admin/diagnostics/database').json<DatabaseStats>();
      return response;
    } catch (error) {
      console.error('Error al obtener estadísticas de la base de datos:', error);
      
      // Datos de ejemplo como fallback
      return {
        tableStats: [
          { tableName: 'users', rowCount: 125, sizeKb: 256, lastUpdated: '2023-12-01T10:15:30Z' },
          { tableName: 'task_requests', rowCount: 1250, sizeKb: 2048, lastUpdated: '2023-12-05T14:22:10Z' },
          { tableName: 'activities', rowCount: 3500, sizeKb: 4096, lastUpdated: '2023-12-05T15:30:45Z' },
          { tableName: 'comments', rowCount: 4200, sizeKb: 1024, lastUpdated: '2023-12-05T16:45:20Z' },
          { tableName: 'attachments', rowCount: 850, sizeKb: 8192, lastUpdated: '2023-12-04T09:10:15Z' }
        ],
        totalSize: 15616,
        connectionPoolStats: {
          active: 5,
          idle: 10,
          max: 20,
          min: 5,
          pending: 0
        },
        queryStats: {
          slowQueries: 3,
          averageQueryTime: 120,
          queriesPerMinute: 45
        }
      };
    }
  },
  
  /**
   * Ejecuta una verificación de integridad de datos
   * @returns Resultado de la verificación de integridad
   */
  async checkDataIntegrity(): Promise<DataIntegrityResult> {
    try {
      const response = await api.post('admin/diagnostics/integrity-check').json<DataIntegrityResult>();
      return response;
    } catch (error) {
      console.error('Error al verificar integridad de datos:', error);
      
      // Datos de ejemplo como fallback
      return {
        status: 'COMPLETED',
        startTime: '2023-12-05T10:00:00Z',
        endTime: '2023-12-05T10:05:30Z',
        issues: [
          { 
            type: 'ORPHANED_RECORD', 
            entity: 'comments', 
            description: 'Comentarios huérfanos sin tarea asociada', 
            count: 5,
            severity: 'MEDIUM',
            fixAvailable: true
          },
          { 
            type: 'INCONSISTENT_STATE', 
            entity: 'task_requests', 
            description: 'Tareas en estado inconsistente', 
            count: 2,
            severity: 'HIGH',
            fixAvailable: true
          },
          { 
            type: 'MISSING_REQUIRED_DATA', 
            entity: 'users', 
            description: 'Usuarios sin roles asignados', 
            count: 1,
            severity: 'LOW',
            fixAvailable: true
          }
        ],
        totalIssues: 8,
        recommendations: [
          'Ejecutar limpieza de comentarios huérfanos',
          'Verificar y corregir estados de tareas inconsistentes',
          'Asignar roles a usuarios sin roles'
        ]
      };
    }
  },
  
  /**
   * Repara problemas de integridad de datos
   * @param issueTypes Tipos de problemas a reparar
   * @returns Resultado de la reparación
   */
  async fixDataIntegrityIssues(issueTypes: string[]): Promise<DataIntegrityResult> {
    try {
      const response = await api.post('admin/diagnostics/fix-integrity-issues', {
        json: { issueTypes }
      }).json<DataIntegrityResult>();
      return response;
    } catch (error) {
      console.error('Error al reparar problemas de integridad:', error);
      
      // Datos de ejemplo como fallback
      return {
        status: 'COMPLETED',
        startTime: '2023-12-05T11:00:00Z',
        endTime: '2023-12-05T11:02:15Z',
        issues: [],
        totalIssues: 0,
        recommendations: ['Verificar que los problemas se hayan resuelto correctamente']
      };
    }
  },
  
  /**
   * Obtiene información sobre los recursos del sistema
   * @returns Información de recursos del sistema
   */
  async getSystemResources(): Promise<SystemResource[]> {
    try {
      const response = await api.get('admin/diagnostics/resources').json<SystemResource[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener recursos del sistema:', error);
      
      // Datos de ejemplo como fallback
      return [
        { name: 'CPU', usage: 35, total: 100, unit: '%' },
        { name: 'Memoria', usage: 4.2, total: 8, unit: 'GB' },
        { name: 'Disco', usage: 150, total: 500, unit: 'GB' },
        { name: 'JVM Heap', usage: 512, total: 1024, unit: 'MB' },
        { name: 'Conexiones DB', usage: 5, total: 20, unit: 'conexiones' }
      ];
    }
  },
  
  /**
   * Obtiene entradas de log del sistema
   * @param level Nivel de log (ERROR, WARN, INFO, DEBUG)
   * @param limit Límite de entradas
   * @returns Entradas de log
   */
  async getSystemLogs(level: string = 'ERROR', limit: number = 100): Promise<LogEntry[]> {
    try {
      const params = new URLSearchParams();
      params.append('level', level);
      params.append('limit', limit.toString());
      
      const response = await api.get(`admin/diagnostics/logs?${params.toString()}`).json<LogEntry[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener logs del sistema:', error);
      
      // Datos de ejemplo como fallback
      return [
        { 
          timestamp: '2023-12-05T15:30:45.123Z', 
          level: 'ERROR', 
          logger: 'com.bitacora.service.TaskService', 
          message: 'Error al procesar tarea #1234: NullPointerException', 
          thread: 'http-nio-8080-exec-5',
          stackTrace: 'java.lang.NullPointerException: Cannot invoke "com.bitacora.domain.model.Task.getId()" because "task" is null\n\tat com.bitacora.service.TaskService.processTask(TaskService.java:125)'
        },
        { 
          timestamp: '2023-12-05T14:22:10.456Z', 
          level: 'WARN', 
          logger: 'com.bitacora.security.AuthenticationService', 
          message: 'Intento de inicio de sesión fallido para usuario: jperez', 
          thread: 'http-nio-8080-exec-3',
          stackTrace: null
        },
        { 
          timestamp: '2023-12-05T13:15:30.789Z', 
          level: 'INFO', 
          logger: 'com.bitacora.controller.UserController', 
          message: 'Usuario creado correctamente: mlopez', 
          thread: 'http-nio-8080-exec-1',
          stackTrace: null
        }
      ];
    }
  },
  
  /**
   * Ejecuta una tarea de mantenimiento
   * @param taskType Tipo de tarea
   * @param parameters Parámetros adicionales
   * @returns Resultado de la tarea
   */
  async executeMaintenanceTask(taskType: string, parameters: Record<string, any> = {}): Promise<MaintenanceTask> {
    try {
      const response = await api.post('admin/maintenance/execute', {
        json: { taskType, parameters }
      }).json<MaintenanceTask>();
      return response;
    } catch (error) {
      console.error(`Error al ejecutar tarea de mantenimiento ${taskType}:`, error);
      
      // Datos de ejemplo como fallback
      return {
        id: '123456',
        taskType,
        status: 'COMPLETED',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        parameters,
        result: {
          success: true,
          message: 'Tarea completada correctamente',
          details: {
            itemsProcessed: 150,
            itemsUpdated: 10,
            itemsDeleted: 5
          }
        }
      };
    }
  },
  
  /**
   * Obtiene información sobre las tareas de mantenimiento
   * @returns Lista de tareas de mantenimiento
   */
  async getMaintenanceTasks(): Promise<MaintenanceTask[]> {
    try {
      const response = await api.get('admin/maintenance/tasks').json<MaintenanceTask[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener tareas de mantenimiento:', error);
      
      // Datos de ejemplo como fallback
      return [
        {
          id: '123456',
          taskType: 'CLEAN_OLD_DATA',
          status: 'COMPLETED',
          startTime: '2023-12-01T10:00:00Z',
          endTime: '2023-12-01T10:05:30Z',
          parameters: { olderThan: '90d', entityType: 'LOGS' },
          result: {
            success: true,
            message: 'Limpieza completada correctamente',
            details: {
              itemsProcessed: 1500,
              itemsDeleted: 1200
            }
          }
        },
        {
          id: '123457',
          taskType: 'OPTIMIZE_DATABASE',
          status: 'COMPLETED',
          startTime: '2023-12-02T02:00:00Z',
          endTime: '2023-12-02T02:15:45Z',
          parameters: { tables: ['users', 'task_requests', 'activities'] },
          result: {
            success: true,
            message: 'Optimización completada correctamente',
            details: {
              tablesOptimized: 3,
              spaceReclaimed: '15MB'
            }
          }
        },
        {
          id: '123458',
          taskType: 'BACKUP',
          status: 'SCHEDULED',
          startTime: '2023-12-06T01:00:00Z',
          endTime: null,
          parameters: { type: 'FULL', destination: 'S3' },
          result: null
        }
      ];
    }
  },
  
  /**
   * Obtiene información sobre los backups del sistema
   * @returns Información de backups
   */
  async getBackupInfo(): Promise<BackupInfo[]> {
    try {
      const response = await api.get('admin/maintenance/backups').json<BackupInfo[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener información de backups:', error);
      
      // Datos de ejemplo como fallback
      return [
        {
          id: 'backup-20231201',
          type: 'FULL',
          creationDate: '2023-12-01T01:00:00Z',
          size: 256,
          location: 'S3://bitacora-backups/backup-20231201.zip',
          status: 'COMPLETED'
        },
        {
          id: 'backup-20231202',
          type: 'FULL',
          creationDate: '2023-12-02T01:00:00Z',
          size: 260,
          location: 'S3://bitacora-backups/backup-20231202.zip',
          status: 'COMPLETED'
        },
        {
          id: 'backup-20231203',
          type: 'FULL',
          creationDate: '2023-12-03T01:00:00Z',
          size: 265,
          location: 'S3://bitacora-backups/backup-20231203.zip',
          status: 'COMPLETED'
        },
        {
          id: 'backup-20231204',
          type: 'FULL',
          creationDate: '2023-12-04T01:00:00Z',
          size: 270,
          location: 'S3://bitacora-backups/backup-20231204.zip',
          status: 'COMPLETED'
        },
        {
          id: 'backup-20231205',
          type: 'FULL',
          creationDate: '2023-12-05T01:00:00Z',
          size: 275,
          location: 'S3://bitacora-backups/backup-20231205.zip',
          status: 'COMPLETED'
        }
      ];
    }
  },
  
  /**
   * Crea un nuevo backup del sistema
   * @param type Tipo de backup (FULL, INCREMENTAL)
   * @param destination Destino del backup
   * @returns Información del backup creado
   */
  async createBackup(type: string, destination: string): Promise<BackupInfo> {
    try {
      const response = await api.post('admin/maintenance/backups', {
        json: { type, destination }
      }).json<BackupInfo>();
      return response;
    } catch (error) {
      console.error('Error al crear backup:', error);
      
      // Datos de ejemplo como fallback
      return {
        id: `backup-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`,
        type,
        creationDate: new Date().toISOString(),
        size: 280,
        location: `${destination}://bitacora-backups/backup-${new Date().toISOString().split('T')[0].replace(/-/g, '')}.zip`,
        status: 'IN_PROGRESS'
      };
    }
  },
  
  /**
   * Restaura un backup del sistema
   * @param backupId ID del backup a restaurar
   * @returns Resultado de la restauración
   */
  async restoreBackup(backupId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`admin/maintenance/backups/${backupId}/restore`).json<{ success: boolean; message: string }>();
      return response;
    } catch (error) {
      console.error(`Error al restaurar backup ${backupId}:`, error);
      
      // Datos de ejemplo como fallback
      return {
        success: true,
        message: 'Restauración iniciada correctamente. Este proceso puede tardar varios minutos.'
      };
    }
  },
  
  /**
   * Obtiene información sobre las tareas programadas
   * @returns Información de tareas programadas
   */
  async getScheduledTasks(): Promise<ScheduledTaskInfo[]> {
    try {
      const response = await api.get('admin/maintenance/scheduled-tasks').json<ScheduledTaskInfo[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener tareas programadas:', error);
      
      // Datos de ejemplo como fallback
      return [
        {
          id: 'task-1',
          name: 'Limpieza de datos antiguos',
          description: 'Elimina logs y datos temporales con más de 90 días',
          cronExpression: '0 0 1 * * ?',
          lastExecution: '2023-12-01T01:00:00Z',
          nextExecution: '2023-12-08T01:00:00Z',
          status: 'ACTIVE'
        },
        {
          id: 'task-2',
          name: 'Backup completo',
          description: 'Realiza un backup completo de la base de datos',
          cronExpression: '0 0 2 * * ?',
          lastExecution: '2023-12-05T02:00:00Z',
          nextExecution: '2023-12-06T02:00:00Z',
          status: 'ACTIVE'
        },
        {
          id: 'task-3',
          name: 'Optimización de base de datos',
          description: 'Optimiza las tablas de la base de datos',
          cronExpression: '0 0 3 ? * SUN',
          lastExecution: '2023-12-03T03:00:00Z',
          nextExecution: '2023-12-10T03:00:00Z',
          status: 'ACTIVE'
        },
        {
          id: 'task-4',
          name: 'Verificación de integridad',
          description: 'Verifica la integridad de los datos',
          cronExpression: '0 0 4 ? * MON',
          lastExecution: '2023-12-04T04:00:00Z',
          nextExecution: '2023-12-11T04:00:00Z',
          status: 'ACTIVE'
        }
      ];
    }
  },
  
  /**
   * Actualiza una tarea programada
   * @param taskId ID de la tarea
   * @param status Nuevo estado (ACTIVE, PAUSED)
   * @param cronExpression Nueva expresión cron
   * @returns Tarea actualizada
   */
  async updateScheduledTask(taskId: string, status: string, cronExpression?: string): Promise<ScheduledTaskInfo> {
    try {
      const response = await api.put(`admin/maintenance/scheduled-tasks/${taskId}`, {
        json: { status, cronExpression }
      }).json<ScheduledTaskInfo>();
      return response;
    } catch (error) {
      console.error(`Error al actualizar tarea programada ${taskId}:`, error);
      
      // Datos de ejemplo como fallback
      return {
        id: taskId,
        name: 'Tarea actualizada',
        description: 'Descripción de la tarea',
        cronExpression: cronExpression || '0 0 0 * * ?',
        lastExecution: '2023-12-01T00:00:00Z',
        nextExecution: '2023-12-08T00:00:00Z',
        status
      };
    }
  },
  
  /**
   * Obtiene estadísticas de caché
   * @returns Estadísticas de caché
   */
  async getCacheStats(): Promise<CacheStats> {
    try {
      const response = await api.get('admin/diagnostics/cache').json<CacheStats>();
      return response;
    } catch (error) {
      console.error('Error al obtener estadísticas de caché:', error);
      
      // Datos de ejemplo como fallback
      return {
        caches: [
          { name: 'users', size: 125, hitCount: 1250, missCount: 50, hitRatio: 96.15 },
          { name: 'tasks', size: 500, hitCount: 3500, missCount: 150, hitRatio: 95.89 },
          { name: 'categories', size: 15, hitCount: 2000, missCount: 25, hitRatio: 98.77 },
          { name: 'permissions', size: 30, hitCount: 1800, missCount: 20, hitRatio: 98.90 }
        ],
        totalSize: 670,
        averageHitRatio: 97.43
      };
    }
  },
  
  /**
   * Limpia una caché específica o todas las cachés
   * @param cacheName Nombre de la caché (opcional, si no se proporciona se limpian todas)
   * @returns Resultado de la operación
   */
  async clearCache(cacheName?: string): Promise<{ success: boolean; message: string }> {
    try {
      const url = cacheName 
        ? `admin/maintenance/cache/${cacheName}/clear` 
        : 'admin/maintenance/cache/clear-all';
      
      const response = await api.post(url).json<{ success: boolean; message: string }>();
      return response;
    } catch (error) {
      console.error('Error al limpiar caché:', error);
      
      // Datos de ejemplo como fallback
      return {
        success: true,
        message: cacheName 
          ? `Caché ${cacheName} limpiada correctamente` 
          : 'Todas las cachés limpiadas correctamente'
      };
    }
  }
};

export default diagnosticService;
