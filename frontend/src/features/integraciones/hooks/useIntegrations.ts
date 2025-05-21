import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import integrationConfigService, { 
  IntegrationConfig, 
  ConnectionTestResult 
} from '../services/IntegrationConfigService';
import { useToastContext } from '@/components/ui';

/**
 * Hook para obtener todas las integraciones
 */
export const useIntegrations = () => {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: () => integrationConfigService.getAllIntegrations(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener una integración por su ID
 */
export const useIntegration = (id: string) => {
  return useQuery({
    queryKey: ['integration', id],
    queryFn: () => integrationConfigService.getIntegrationById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para actualizar una integración
 */
export const useUpdateIntegration = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: ({ id, config }: { id: string; config: Partial<IntegrationConfig> }) => 
      integrationConfigService.updateIntegration(id, config),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['integration', data.id] });
      showSuccess('Integración actualizada correctamente');
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al actualizar integración: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para habilitar o deshabilitar una integración
 */
export const useToggleIntegration = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => 
      integrationConfigService.toggleIntegration(id, enabled),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['integration', data.id] });
      showSuccess(`Integración ${data.enabled ? 'habilitada' : 'deshabilitada'} correctamente`);
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al cambiar estado de integración: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para probar la conexión de una integración
 */
export const useTestConnection = () => {
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: (id: string) => integrationConfigService.testConnection(id),
    onSuccess: (data: ConnectionTestResult) => {
      if (data.success) {
        showSuccess(`Conexión exitosa: ${data.message}`);
      } else {
        showError(`Error de conexión: ${data.message}`);
      }
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al probar conexión: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para sincronizar una integración
 */
export const useSyncIntegration = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: (id: string) => integrationConfigService.syncIntegration(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['integration', id] });
      queryClient.invalidateQueries({ queryKey: ['integration-sync-history', id] });
      
      if (data.success) {
        showSuccess(`Sincronización exitosa: ${data.message}`);
      } else {
        showError(`Error de sincronización: ${data.message}`);
      }
      
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al sincronizar: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para obtener el historial de sincronización de una integración
 */
export const useSyncHistory = (id: string) => {
  return useQuery({
    queryKey: ['integration-sync-history', id],
    queryFn: () => integrationConfigService.getSyncHistory(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
