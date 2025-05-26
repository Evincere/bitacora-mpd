import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import generalConfigService, {
  GeneralConfig,
  PerformanceConfig,
  SecurityConfig,
  EmailConfig
} from '../services/generalConfigService';
import { useToast } from '@/shared/components/ui/Toast/ToastProvider';

/**
 * Hook para obtener la configuración general del sistema
 */
export const useGeneralConfig = () => {
  return useQuery({
    queryKey: ['generalConfig'],
    queryFn: () => generalConfigService.getGeneralConfig(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para actualizar la configuración de rendimiento
 */
export const useUpdatePerformanceConfig = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (config: PerformanceConfig) => generalConfigService.updatePerformanceConfig(config),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['generalConfig'] });
      toast.success('Configuración de rendimiento actualizada correctamente');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar configuración de rendimiento: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para actualizar la configuración de seguridad
 */
export const useUpdateSecurityConfig = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (config: SecurityConfig) => generalConfigService.updateSecurityConfig(config),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['generalConfig'] });
      toast.success('Configuración de seguridad actualizada correctamente');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar configuración de seguridad: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para actualizar la configuración de correo electrónico
 */
export const useUpdateEmailConfig = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (config: EmailConfig) => generalConfigService.updateEmailConfig(config),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['generalConfig'] });
      toast.success('Configuración de correo electrónico actualizada correctamente');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar configuración de correo electrónico: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para actualizar la configuración de mantenimiento
 */
export const useUpdateMaintenanceConfig = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (config: { enabled: boolean; message: string; plannedEndTime: string | null }) =>
      generalConfigService.updateMaintenanceConfig(config),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['generalConfig'] });
      toast.success('Configuración de mantenimiento actualizada correctamente');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar configuración de mantenimiento: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para actualizar la configuración de características
 */
export const useUpdateFeaturesConfig = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (features: { [key: string]: boolean }) => generalConfigService.updateFeaturesConfig(features),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['generalConfig'] });
      toast.success('Configuración de características actualizada correctamente');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar configuración de características: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para probar la configuración de correo electrónico
 */
export const useTestEmailConfig = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: (email: string) => generalConfigService.testEmailConfig(email),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Prueba de correo electrónico exitosa: ${data.message}`);
      } else {
        toast.error(`Error en la prueba de correo electrónico: ${data.message}`);
      }
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error al probar configuración de correo electrónico: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para limpiar la caché del sistema
 */
export const useClearCache = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: () => generalConfigService.clearCache(),
    onSuccess: (data) => {
      if (data.success) {
        // Invalidar todas las consultas para refrescar los datos
        queryClient.invalidateQueries();
        toast.success(`Caché limpiada correctamente: ${data.message}`);
      } else {
        toast.error(`Error al limpiar la caché: ${data.message}`);
      }
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error al limpiar la caché: ${error.message}`);
      throw error;
    },
  });
};
