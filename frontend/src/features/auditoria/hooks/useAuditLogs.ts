import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import auditService from '../services/auditService';
import { AuditLogFilters } from '../types';

/**
 * Hook para buscar registros de auditoría
 */
export const useAuditLogs = (filters: AuditLogFilters) => {
  return useQuery({
    queryKey: ['auditLogs', filters],
    queryFn: () => auditService.searchAuditLogs(filters),
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook para obtener un registro de auditoría por su ID
 */
export const useAuditLog = (id: number) => {
  return useQuery({
    queryKey: ['auditLog', id],
    queryFn: () => auditService.getAuditLogById(id),
    enabled: !!id,
  });
};

/**
 * Hook para marcar un registro de auditoría como sospechoso
 */
export const useMarkAsSuspicious = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      auditService.markAsSuspicious(id, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['auditLog', data.id] });
      toast.success('Registro marcado como sospechoso correctamente');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error al marcar registro como sospechoso: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para obtener estadísticas de auditoría
 */
export const useAuditStats = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['auditStats', startDate, endDate],
    queryFn: () => auditService.getAuditStats(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

/**
 * Hook para exportar registros de auditoría a CSV
 */
export const useExportAuditLogs = () => {
  return useMutation({
    mutationFn: (filters: Omit<AuditLogFilters, 'page' | 'size'>) =>
      auditService.exportAuditLogs(filters),
    onSuccess: (data) => {
      // Crear un enlace de descarga
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Registros exportados correctamente');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error al exportar registros: ${error.message}`);
      throw error;
    },
  });
};
