import { useContext } from 'react';
import { useRealTimeNotifications as useRealTimeNotificationsFromContext } from '../contexts/RealTimeNotificationContext';

/**
 * Hook para usar las notificaciones en tiempo real.
 *
 * @returns Contexto de notificaciones en tiempo real
 */
export const useRealTimeNotifications = useRealTimeNotificationsFromContext;
