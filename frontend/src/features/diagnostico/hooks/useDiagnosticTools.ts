import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastContext } from '@/components/ui';
import diagnosticService from '../services/diagnosticService';
import { LogFilters, MaintenanceTaskFilters, BackupFilters, ScheduledTaskFilters } from '../types/diagnosticTypes';

/**
 * Hook para obtener el estado de salud del sistema
 */
export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['systemHealth'],
    queryFn: () => diagnosticService.getSystemHealth(),
    refetchInterval: 60000, // Refrescar cada minuto
  });
};

/**
 * Hook para obtener estadísticas de la base de datos
 */
export const useDatabaseStats = () => {
  return useQuery({
    queryKey: ['databaseStats'],
    queryFn: () => diagnosticService.getDatabaseStats(),
    refetchInterval: 300000, // Refrescar cada 5 minutos
  });
};

/**
 * Hook para verificar la integridad de datos
 */
export const useDataIntegrityCheck = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: () => diagnosticService.checkDataIntegrity(),
    onSuccess: (data) => {
      showSuccess('Verificación de integridad completada');
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al verificar integridad: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para reparar problemas de integridad de datos
 */
export const useFixDataIntegrityIssues = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: (issueTypes: string[]) => diagnosticService.fixDataIntegrityIssues(issueTypes),
    onSuccess: (data) => {
      showSuccess('Problemas de integridad reparados correctamente');
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al reparar problemas: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para obtener recursos del sistema
 */
export const useSystemResources = () => {
  return useQuery({
    queryKey: ['systemResources'],
    queryFn: () => diagnosticService.getSystemResources(),
    refetchInterval: 10000, // Refrescar cada 10 segundos
  });
};

/**
 * Hook para obtener logs del sistema
 */
export const useSystemLogs = (filters: LogFilters = {}) => {
  const { level = 'ERROR', limit = 100 } = filters;
  
  return useQuery({
    queryKey: ['systemLogs', filters],
    queryFn: () => diagnosticService.getSystemLogs(level, limit),
  });
};

/**
 * Hook para ejecutar una tarea de mantenimiento
 */
export const useExecuteMaintenanceTask = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: ({ taskType, parameters }: { taskType: string; parameters?: Record<string, any> }) => 
      diagnosticService.executeMaintenanceTask(taskType, parameters),
    onSuccess: (data) => {
      showSuccess(`Tarea de mantenimiento ${data.taskType} ejecutada correctamente`);
      queryClient.invalidateQueries({ queryKey: ['maintenanceTasks'] });
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al ejecutar tarea de mantenimiento: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para obtener tareas de mantenimiento
 */
export const useMaintenanceTasks = () => {
  return useQuery({
    queryKey: ['maintenanceTasks'],
    queryFn: () => diagnosticService.getMaintenanceTasks(),
  });
};

/**
 * Hook para obtener información de backups
 */
export const useBackupInfo = () => {
  return useQuery({
    queryKey: ['backupInfo'],
    queryFn: () => diagnosticService.getBackupInfo(),
  });
};

/**
 * Hook para crear un backup
 */
export const useCreateBackup = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: ({ type, destination }: { type: string; destination: string }) => 
      diagnosticService.createBackup(type, destination),
    onSuccess: (data) => {
      showSuccess('Backup iniciado correctamente');
      queryClient.invalidateQueries({ queryKey: ['backupInfo'] });
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al crear backup: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para restaurar un backup
 */
export const useRestoreBackup = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: (backupId: string) => diagnosticService.restoreBackup(backupId),
    onSuccess: (data) => {
      showSuccess(data.message);
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al restaurar backup: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para obtener tareas programadas
 */
export const useScheduledTasks = () => {
  return useQuery({
    queryKey: ['scheduledTasks'],
    queryFn: () => diagnosticService.getScheduledTasks(),
  });
};

/**
 * Hook para actualizar una tarea programada
 */
export const useUpdateScheduledTask = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: ({ taskId, status, cronExpression }: { taskId: string; status: string; cronExpression?: string }) => 
      diagnosticService.updateScheduledTask(taskId, status, cronExpression),
    onSuccess: (data) => {
      showSuccess(`Tarea programada ${data.name} actualizada correctamente`);
      queryClient.invalidateQueries({ queryKey: ['scheduledTasks'] });
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al actualizar tarea programada: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para obtener estadísticas de caché
 */
export const useCacheStats = () => {
  return useQuery({
    queryKey: ['cacheStats'],
    queryFn: () => diagnosticService.getCacheStats(),
    refetchInterval: 60000, // Refrescar cada minuto
  });
};

/**
 * Hook para limpiar caché
 */
export const useClearCache = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: (cacheName?: string) => diagnosticService.clearCache(cacheName),
    onSuccess: (data) => {
      showSuccess(data.message);
      queryClient.invalidateQueries({ queryKey: ['cacheStats'] });
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al limpiar caché: ${error.message}`);
      throw error;
    },
  });
};
