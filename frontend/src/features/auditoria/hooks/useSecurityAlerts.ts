import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import securityAlertService from '../services/securityAlertService';
import {
  SecurityAlert,
  SecurityAlertFilter,
  SecurityAlertStatus,
  SecurityAlertRule
} from '../types/securityAlertTypes';

/**
 * Hook para obtener alertas de seguridad
 */
export const useSecurityAlerts = (filter?: SecurityAlertFilter) => {
  return useQuery({
    queryKey: ['securityAlerts', filter],
    queryFn: () => securityAlertService.getAlerts(filter),
  });
};

/**
 * Hook para obtener una alerta de seguridad por su ID
 */
export const useSecurityAlert = (id: string) => {
  return useQuery({
    queryKey: ['securityAlert', id],
    queryFn: () => securityAlertService.getAlertById(id),
    enabled: !!id,
  });
};

/**
 * Hook para actualizar el estado de una alerta de seguridad
 */
export const useUpdateAlertStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: SecurityAlertStatus; note?: string }) =>
      securityAlertService.updateAlertStatus(id, status, note),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['securityAlerts'] });
      queryClient.invalidateQueries({ queryKey: ['securityAlert', data.id] });

      const statusMessages: Record<SecurityAlertStatus, string> = {
        [SecurityAlertStatus.NEW]: 'Alerta creada correctamente',
        [SecurityAlertStatus.ACKNOWLEDGED]: 'Alerta reconocida correctamente',
        [SecurityAlertStatus.RESOLVED]: 'Alerta resuelta correctamente',
        [SecurityAlertStatus.FALSE_POSITIVE]: 'Alerta marcada como falso positivo'
      };

      toast.success(statusMessages[data.status] || 'Estado de alerta actualizado correctamente');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar estado de alerta: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para obtener reglas de alertas de seguridad
 */
export const useSecurityAlertRules = () => {
  return useQuery({
    queryKey: ['securityAlertRules'],
    queryFn: () => securityAlertService.getAlertRules(),
  });
};

/**
 * Hook para crear una regla de alerta de seguridad
 */
export const useCreateAlertRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rule: Omit<SecurityAlertRule, 'id' | 'createdAt' | 'updatedAt'>) =>
      securityAlertService.createAlertRule(rule),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['securityAlertRules'] });
      toast.success('Regla de alerta creada correctamente');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error al crear regla de alerta: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para actualizar una regla de alerta de seguridad
 */
export const useUpdateAlertRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rule }: { id: string; rule: Partial<SecurityAlertRule> }) =>
      securityAlertService.updateAlertRule(id, rule),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['securityAlertRules'] });
      toast.success('Regla de alerta actualizada correctamente');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar regla de alerta: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para eliminar una regla de alerta de seguridad
 */
export const useDeleteAlertRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => securityAlertService.deleteAlertRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['securityAlertRules'] });
      toast.success('Regla de alerta eliminada correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar regla de alerta: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para obtener estadísticas de alertas de seguridad
 */
export const useSecurityAlertStatistics = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['securityAlertStatistics', startDate, endDate],
    queryFn: () => securityAlertService.getAlertStatistics(startDate, endDate),
  });
};

/**
 * Hook para habilitar/deshabilitar una regla de alerta de seguridad
 */
export const useToggleAlertRule = () => {
  const updateAlertRule = useUpdateAlertRule();

  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      updateAlertRule.mutateAsync({ id, rule: { enabled } }),
  });
};
