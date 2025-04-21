import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
// Definir un tipo para el estado de la aplicación
interface RootState {
  auth: {
    user: any;
    isAuthenticated: boolean;
  };
  ui: any;
}
import { useToast } from '../components/ui/Toast';
import { websocketService, useWebSocket } from '../services/websocketService';
import {
  RealTimeNotification,
  NotificationType,
  TaskAssignmentNotification,
  TaskStatusChangeNotification,
  DeadlineReminderNotification,
  AnnouncementNotification,
  CollaborationNotification,
  isNotificationType
} from '../types/notifications';
import { UserStatusEvent, SessionActivityEvent, SystemAlertEvent } from '../services/websocketService';

// Interfaz para el contexto
interface RealTimeNotificationContextProps {
  notifications: RealTimeNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  userStatuses: Record<number, UserStatusEvent>;
  sessionActivities: SessionActivityEvent[];
  systemAlerts: SystemAlertEvent[];
  isConnected: boolean;
  reconnect: () => void;
  queueStatus: { size: number, messages: any[] };
  clearQueue: () => void;
}

// Crear el contexto
const RealTimeNotificationContext = createContext<RealTimeNotificationContextProps | undefined>(undefined);

// Propiedades del proveedor
interface RealTimeNotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
}

// Componente proveedor
export const RealTimeNotificationProvider: React.FC<RealTimeNotificationProviderProps> = ({
  children,
  maxNotifications = 50
}) => {
  // Estado para las notificaciones
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);
  const [userStatuses, setUserStatuses] = useState<Record<number, UserStatusEvent>>({});
  const [sessionActivities, setSessionActivities] = useState<SessionActivityEvent[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlertEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [queueStatus, setQueueStatus] = useState<{ size: number, messages: any[] }>({ size: 0, messages: [] });

  // Obtener el usuario autenticado
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Hooks
  const toast = useToast();
  const webSocket = useWebSocket();

  // Calcular el número de notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Marcar una notificación como leída
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Limpiar todas las notificaciones
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Reconectar el WebSocket
  const reconnect = useCallback(() => {
    webSocket.reconnect();
  }, [webSocket]);

  // Limpiar la cola de mensajes
  const clearQueue = useCallback(() => {
    webSocket.clearQueue();
    setQueueStatus(webSocket.getQueueStatus());
  }, [webSocket]);

  // Inicializar el WebSocket cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      // Obtener el token del localStorage
      const token = localStorage.getItem('bitacora_token');

      if (token) {
        // Inicializar el WebSocket
        websocketService.init(user.id, token);

        // Suscribirse a los eventos
        const unsubscribeNotification = webSocket.subscribeToNotifications((notification) => {
          setNotifications(prev => {
            // Añadir la nueva notificación al principio y limitar el número total
            const updated = [notification, ...prev].slice(0, maxNotifications);
            return updated;
          });

          // Mostrar la notificación como toast con mensajes personalizados según el tipo
          if (isNotificationType<TaskAssignmentNotification>(notification, 'TaskAssignment')) {
            toast.info(
              `Se te ha asignado: ${notification.activityTitle}`,
              'Nueva tarea asignada'
            );
          } else if (isNotificationType<TaskStatusChangeNotification>(notification, 'TaskStatusChange')) {
            toast.info(
              `Estado cambiado de ${notification.previousStatus} a ${notification.newStatus}`,
              `Actividad actualizada: ${notification.activityTitle}`
            );
          } else if (isNotificationType<DeadlineReminderNotification>(notification, 'DeadlineReminder')) {
            toast.warning(
              `Vence ${notification.hoursRemaining <= 1 ? 'en 1 hora' :
                notification.hoursRemaining <= 4 ? 'en 4 horas' : 'mañana'}`,
              `Recordatorio: ${notification.activityTitle}`
            );
          } else if (isNotificationType<AnnouncementNotification>(notification, 'Announcement')) {
            toast.info(
              notification.message,
              `${notification.title} - De: ${notification.createdByName}`
            );
          } else if (isNotificationType<CollaborationNotification>(notification, 'Collaboration')) {
            toast.info(
              notification.message,
              notification.title
            );
          } else {
            // Notificaciones genéricas
            const toastType = (notification.type as string).toLowerCase();
            if (['success', 'error', 'warning', 'info'].includes(toastType)) {
              toast[toastType as 'success' | 'error' | 'warning' | 'info'](notification.message, notification.title);
            } else {
              toast.info(notification.message, notification.title);
            }
          }
        });

        const unsubscribeUserStatus = webSocket.subscribeToUserStatus((status) => {
          setUserStatuses(prev => ({
            ...prev,
            [status.userId]: status
          }));
        });

        const unsubscribeSessionActivity = webSocket.subscribeToSessionActivity((activity) => {
          setSessionActivities(prev => {
            // Añadir la nueva actividad al principio y limitar el número total
            const updated = [activity, ...prev].slice(0, maxNotifications);
            return updated;
          });

          // Si es una actividad sospechosa, mostrar una notificación
          if (activity.action === 'suspicious_activity') {
            toast.warning(
              `Actividad sospechosa detectada desde ${activity.ipAddress}`,
              'Alerta de Seguridad'
            );
          }
        });

        const unsubscribeSystemAlert = webSocket.subscribeToSystemAlerts((alert) => {
          setSystemAlerts(prev => {
            // Añadir la nueva alerta al principio y limitar el número total
            const updated = [alert, ...prev].slice(0, maxNotifications);
            return updated;
          });

          // Mostrar la alerta según su nivel
          if (alert.level === 'critical') {
            toast.error(alert.message, alert.title);
          } else if (alert.level === 'warning') {
            toast.warning(alert.message, alert.title);
          } else {
            toast.info(alert.message, alert.title);
          }
        });

        const unsubscribeConnectionStatus = webSocket.subscribeToConnectionStatus((status) => {
          setIsConnected(status.connected);

          if (!status.connected && status.reason) {
            console.warn(`WebSocket disconnected: ${status.reason}`);

            if (status.error) {
              toast.error(
                `Se ha perdido la conexión con el servidor: ${status.error}`,
                'Error de Conexión'
              );
            }
          }

          // Actualizar el estado de la cola
          setQueueStatus(webSocket.getQueueStatus());
        });

        // Suscribirse a actualizaciones de la cola
        const unsubscribeQueueUpdates = webSocket.subscribeToQueueUpdates((data) => {
          setQueueStatus(webSocket.getQueueStatus());
        });

        // Configurar notificaciones de la cola
        const unsubscribeQueueNotifications = webSocket.setupQueueNotifications();

        // Limpiar las suscripciones al desmontar
        return () => {
          unsubscribeNotification();
          unsubscribeUserStatus();
          unsubscribeSessionActivity();
          unsubscribeSystemAlert();
          unsubscribeConnectionStatus();
          unsubscribeQueueUpdates();
          unsubscribeQueueNotifications();
          websocketService.disconnect();
        };
      }
    }
  }, [isAuthenticated, user, toast, webSocket, maxNotifications]);

  // Valor del contexto
  const contextValue: RealTimeNotificationContextProps = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    userStatuses,
    sessionActivities,
    systemAlerts,
    isConnected,
    reconnect,
    queueStatus,
    clearQueue
  };

  return (
    <RealTimeNotificationContext.Provider value={contextValue}>
      {children}
    </RealTimeNotificationContext.Provider>
  );
};

// Hook para usar el contexto
export const useRealTimeNotifications = () => {
  const context = useContext(RealTimeNotificationContext);

  if (!context) {
    throw new Error('useRealTimeNotifications debe ser usado dentro de un RealTimeNotificationProvider');
  }

  return context;
};
