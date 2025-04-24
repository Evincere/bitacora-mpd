import { useContext } from 'react';
import { useRealTimeNotifications } from '../contexts/RealTimeNotificationContext';

export const useSocket = () => {
  // Usar el hook exportado en lugar del contexto directamente
  const context = useRealTimeNotifications();

  return {
    connected: context.connected
  };
};
