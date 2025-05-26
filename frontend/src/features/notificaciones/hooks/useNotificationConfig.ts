import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import notificationConfigService, {
  NotificationPreferences,
  UpdateTemplateDto
} from '../services/notificationConfigService';
import { toast } from 'react-toastify';

/**
 * Hook para obtener los canales de notificación
 */
export const useNotificationChannels = () => {
  return useQuery({
    queryKey: ['notificationChannels'],
    queryFn: () => notificationConfigService.getNotificationChannels(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};

/**
 * Hook para obtener los tipos de notificación
 */
export const useNotificationTypes = () => {
  return useQuery({
    queryKey: ['notificationTypes'],
    queryFn: () => notificationConfigService.getNotificationTypes(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};

/**
 * Hook para obtener las preferencias de notificación del usuario
 */
export const useUserNotificationPreferences = () => {
  return useQuery({
    queryKey: ['userNotificationPreferences'],
    queryFn: () => notificationConfigService.getUserNotificationPreferences(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para actualizar las preferencias de notificación del usuario
 */
export const useUpdateUserNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: NotificationPreferences) =>
      notificationConfigService.updateUserNotificationPreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNotificationPreferences'] });
      toast.success('Preferencias de notificación actualizadas correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar preferencias: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para obtener las plantillas de notificación
 */
export const useNotificationTemplates = () => {
  return useQuery({
    queryKey: ['notificationTemplates'],
    queryFn: () => notificationConfigService.getNotificationTemplates(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para obtener una plantilla de notificación por su ID
 */
export const useNotificationTemplate = (id: string) => {
  return useQuery({
    queryKey: ['notificationTemplate', id],
    queryFn: () => notificationConfigService.getNotificationTemplateById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para actualizar una plantilla de notificación
 */
export const useUpdateNotificationTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, templateData }: { id: string; templateData: UpdateTemplateDto }) =>
      notificationConfigService.updateNotificationTemplate(id, templateData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notificationTemplates'] });
      queryClient.invalidateQueries({ queryKey: ['notificationTemplate', data.id] });
      toast.success('Plantilla de notificación actualizada correctamente');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar plantilla: ${error.message}`);
      throw error;
    },
  });
};
