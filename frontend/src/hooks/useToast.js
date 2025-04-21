import { useNotification } from "../components/common/NotificationProvider";

/**
 * Hook personalizado para mostrar notificaciones
 * @returns {Object} Funciones para mostrar diferentes tipos de notificaciones
 */
export const useToast = () => {
  // Usar el hook de notificaciones personalizado
  const notification = useNotification();

  return {
    success: notification.success,
    error: notification.error,
    info: notification.info,
    warning: notification.warning,
  };
};
