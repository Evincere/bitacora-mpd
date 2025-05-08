import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { RealTimeNotification } from '@/core/types/models';
import { toast } from 'react-toastify';
import { useAppSelector } from '@/core/store';
import { useQueryClient } from '@tanstack/react-query';

// Importar tipos de notificaciones
import {
  NotificationType,
  TaskCompletedNotification,
  TaskStartedNotification,
  TaskRejectedNotification,
  TaskApprovedNotification,
  UserConnectedNotification,
  UserDisconnectedNotification
} from '@/types/notifications';

interface RealTimeNotificationContextType {
  notifications: RealTimeNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  connected: boolean;
}

const RealTimeNotificationContext = createContext<RealTimeNotificationContextType | undefined>(undefined);

interface RealTimeNotificationProviderProps {
  children: ReactNode;
}

export const RealTimeNotificationProvider: React.FC<RealTimeNotificationProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);
  const [connected, setConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [reconnectDisabled, setReconnectDisabled] = useState(false);
  // Usar toast directamente desde react-toastify
  const { isAuthenticated } = useAppSelector(state => state.auth);
  // Obtener el cliente de consulta para invalidar consultas cuando sea necesario
  const queryClient = useQueryClient();

  // Constantes para la reconexión
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL = 5000; // 5 segundos

  // Calcular el número de notificaciones no leídas
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Función para inicializar la conexión WebSocket
  const initializeSocket = useCallback(() => {
    // Si no está autenticado, no intentar conectar
    if (!isAuthenticated) {
      console.log('Usuario no autenticado, no se intentará conectar al WebSocket');
      return null;
    }

    // Si la reconexión está deshabilitada, no intentar conectar
    if (reconnectDisabled) {
      console.log('Reconexión deshabilitada, no se intentará conectar');
      return null;
    }

    // Obtener el token del localStorage
    const token = localStorage.getItem('bitacora_token');
    const user = localStorage.getItem('bitacora_user');

    if (!token || !user) {
      // Solo mostrar mensaje en desarrollo
      if (import.meta.env.DEV) {
        console.log('No hay token o usuario, no se puede conectar al servidor de notificaciones');
      }

      // Cargar notificaciones de ejemplo en desarrollo
      if (import.meta.env.DEV && notifications.length === 0) {
        const mockNotifications: RealTimeNotification[] = [
          {
            id: '1',
            userId: 1,
            title: 'Actividad asignada',
            message: 'Se te ha asignado una nueva actividad',
            type: 'ASSIGNMENT',
            read: false,
            createdAt: new Date().toISOString(),
            link: '/activities/1'
          },
          {
            id: '2',
            userId: 1,
            title: 'Recordatorio',
            message: 'Tienes una actividad pendiente para hoy',
            type: 'REMINDER',
            read: true,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            link: '/activities/2'
          }
        ];

        setNotifications(mockNotifications);
      }

      return null;
    }

    // En desarrollo, usar datos de ejemplo en lugar de intentar conectar al WebSocket
    if (import.meta.env.DEV) {
      console.log('Modo desarrollo: usando datos de ejemplo en lugar de WebSocket');

      // Cargar notificaciones de ejemplo
      if (notifications.length === 0) {
        const mockNotifications: RealTimeNotification[] = [
          {
            id: '1',
            userId: 1,
            title: 'Actividad asignada',
            message: 'Se te ha asignado una nueva actividad',
            type: 'ASSIGNMENT',
            read: false,
            createdAt: new Date().toISOString(),
            link: '/activities/1'
          },
          {
            id: '2',
            userId: 1,
            title: 'Recordatorio',
            message: 'Tienes una actividad pendiente para hoy',
            type: 'REMINDER',
            read: true,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            link: '/activities/2'
          }
        ];

        setNotifications(mockNotifications);
      }

      // Devolver un socket simulado para evitar errores
      return {
        on: () => {},
        emit: () => {},
        disconnect: () => {},
        connected: false,
        connect: () => {}
      } as unknown as Socket;
    }

    // En producción, intentar conectar al WebSocket
    const socketUrl = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:8080';

    // Configuración detallada para depuración (solo una vez)
    console.log(`Configurando socket con URL: ${socketUrl} (intento ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
    console.log('Token disponible:', !!token);

    // Crear un socket pero no conectar automáticamente
    const newSocket = io(socketUrl, {
      auth: {
        token: `Bearer ${token}`  // Formato correcto para el token
      },
      path: '/api/ws',           // Ruta del WebSocket en el servidor
      transports: ['websocket'], // Forzar WebSocket sin polling
      extraHeaders: {            // Headers adicionales para la autenticación
        'Authorization': `Bearer ${token}`
      },
      reconnection: false,       // Desactivamos la reconexión automática para manejarla nosotros
      autoConnect: false         // Desactivamos la conexión automática para manejarla nosotros
    });

    // Intentar conectar manualmente solo si no estamos en desarrollo
    try {
      console.log('Intentando conectar manualmente al WebSocket...');
      newSocket.connect();
    } catch (error) {
      console.error('Error al intentar conectar manualmente:', error);
    }

    // Manejar eventos de conexión
    newSocket.on('connect', () => {
      console.log('Conectado al servidor de notificaciones');
      setConnected(true);
      setReconnectAttempts(0); // Resetear contador de intentos al conectar exitosamente
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado del servidor de notificaciones');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      // En modo desarrollo, no mostrar errores de WebSocket
      if (import.meta.env.DEV) {
        console.log('Modo desarrollo: ignorando error de WebSocket');

        // Si no hay notificaciones, cargar algunas de ejemplo
        if (notifications.length === 0) {
          const mockNotifications: RealTimeNotification[] = [
            {
              id: '1',
              userId: 1,
              title: 'Actividad asignada',
              message: 'Se te ha asignado una nueva actividad',
              type: 'ASSIGNMENT',
              read: false,
              createdAt: new Date().toISOString(),
              link: '/activities/1'
            },
            {
              id: '2',
              userId: 1,
              title: 'Recordatorio',
              message: 'Tienes una actividad pendiente para hoy',
              type: 'REMINDER',
              read: true,
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              link: '/activities/2'
            }
          ];

          setNotifications(mockNotifications);
        }

        return;
      }

      // Información detallada para depuración
      console.error('Error de conexión al servidor de notificaciones:', error);
      console.log('Detalles del error:', {
        message: error.message,
        // Acceder a propiedades adicionales de manera segura usando casting o acceso indexado
        ...(error as any).type && { type: (error as any).type },
        ...(error as any).description && { description: (error as any).description },
        ...(error as any).context && { context: (error as any).context }
      });

      setConnected(false);

      // Incrementar contador de intentos
      const newAttempts = reconnectAttempts + 1;
      setReconnectAttempts(newAttempts);

      // Verificar si hemos alcanzado el límite de intentos
      if (newAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.log(`Límite de ${MAX_RECONNECT_ATTEMPTS} intentos alcanzado. Deshabilitando reconexión.`);
        setReconnectDisabled(true);

        // Mostrar toast de error
        toast.error('Error de conexión: No se pudo conectar al servidor de notificaciones después de varios intentos');
        return;
      }

      // Programar un nuevo intento de conexión
      console.log(`Programando nuevo intento de conexión en ${RECONNECT_INTERVAL/1000} segundos...`);
      setTimeout(() => {
        const currentSocket = initializeSocket();
        if (currentSocket) {
          setSocket(currentSocket);
        }
      }, RECONNECT_INTERVAL);
    });

    // Manejar eventos de notificaciones
    newSocket.on('notification', (notification: RealTimeNotification) => {
      console.log('Nueva notificación recibida:', notification);

      // Añadir la notificación a la lista
      setNotifications(prev => [notification, ...prev]);

      // Mostrar un toast para la notificación con estilo según el tipo
      switch (notification.type) {
        case NotificationType.TASK_COMPLETED:
          toast.success(`${notification.title}: ${notification.message}`);
          // Invalidar consultas relacionadas con tareas
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          queryClient.invalidateQueries({ queryKey: ['completedTasks'] });
          break;
        case NotificationType.TASK_STARTED:
          toast.info(`${notification.title}: ${notification.message}`);
          // Invalidar consultas relacionadas con tareas
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          queryClient.invalidateQueries({ queryKey: ['inProgressTasks'] });
          break;
        case NotificationType.TASK_REJECTED:
          toast.error(`${notification.title}: ${notification.message}`);
          // Invalidar consultas relacionadas con tareas
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          break;
        case NotificationType.TASK_APPROVED:
          toast.success(`${notification.title}: ${notification.message}`);
          // Invalidar consultas relacionadas con tareas
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          queryClient.invalidateQueries({ queryKey: ['approvedTasks'] });
          break;
        case NotificationType.USER_CONNECTED:
        case NotificationType.USER_DISCONNECTED:
          // No mostrar toast para estos tipos de notificaciones
          break;
        case NotificationType.TASK_ASSIGNMENT:
          toast.info(`${notification.title}: ${notification.message}`);
          // Invalidar consultas relacionadas con tareas asignadas
          queryClient.invalidateQueries({ queryKey: ['assignedTasks'] });
          break;
        case NotificationType.TASK_STATUS_CHANGE:
          toast.info(`${notification.title}: ${notification.message}`);
          // Invalidar todas las consultas relacionadas con tareas
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          break;
        case 'TASK_REQUEST':
          toast.info(`${notification.title}: ${notification.message}`);
          // Invalidar consulta de solicitudes pendientes
          console.log('Invalidando consulta de solicitudes pendientes debido a nueva solicitud');
          queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
          break;
        default:
          toast.info(`${notification.title}: ${notification.message}`);
      }
    });

    // Escuchar eventos específicos de nuevas solicitudes
    newSocket.on('new-task-request', (data: any) => {
      console.log('Nueva solicitud de tarea recibida:', data);

      // Invalidar la consulta de solicitudes pendientes para forzar una recarga
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });

      // Mostrar una notificación toast
      toast.info('Se ha recibido una nueva solicitud de tarea');
    });

    // Escuchar eventos de tarea completada
    newSocket.on('task-completed', (data: TaskCompletedNotification) => {
      console.log('Tarea completada recibida:', data);

      // Invalidar consultas relacionadas con tareas
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['completedTasks'] });

      // Mostrar una notificación toast
      toast.success(`Tarea completada: ${data.activityTitle}`);
    });

    // Escuchar eventos de tarea iniciada
    newSocket.on('task-started', (data: TaskStartedNotification) => {
      console.log('Tarea iniciada recibida:', data);

      // Invalidar consultas relacionadas con tareas
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['inProgressTasks'] });

      // Mostrar una notificación toast
      toast.info(`Tarea iniciada: ${data.activityTitle}`);
    });

    // Escuchar eventos de tarea rechazada
    newSocket.on('task-rejected', (data: TaskRejectedNotification) => {
      console.log('Tarea rechazada recibida:', data);

      // Invalidar consultas relacionadas con tareas
      queryClient.invalidateQueries({ queryKey: ['tasks'] });

      // Mostrar una notificación toast
      toast.error(`Tarea rechazada: ${data.activityTitle}`);
    });

    // Escuchar eventos de tarea aprobada
    newSocket.on('task-approved', (data: TaskApprovedNotification) => {
      console.log('Tarea aprobada recibida:', data);

      // Invalidar consultas relacionadas con tareas
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['approvedTasks'] });

      // Mostrar una notificación toast
      toast.success(`Tarea aprobada: ${data.activityTitle}`);
    });

    // Escuchar eventos de usuario conectado
    newSocket.on('user-connected', (data: UserConnectedNotification) => {
      console.log('Usuario conectado:', data);

      // No mostrar toast para no sobrecargar la interfaz
      // Pero sí añadir a la lista de notificaciones
      setNotifications(prev => [data, ...prev]);
    });

    // Escuchar eventos de usuario desconectado
    newSocket.on('user-disconnected', (data: UserDisconnectedNotification) => {
      console.log('Usuario desconectado:', data);

      // No mostrar toast para no sobrecargar la interfaz
      // Pero sí añadir a la lista de notificaciones
      setNotifications(prev => [data, ...prev]);
    });

    // Manejar evento de notificaciones iniciales
    newSocket.on('initial-notifications', (initialNotifications: RealTimeNotification[]) => {
      console.log('Notificaciones iniciales recibidas:', initialNotifications);
      setNotifications(initialNotifications);
    });

    return newSocket;
  }, [reconnectAttempts, reconnectDisabled, notifications.length, toast, MAX_RECONNECT_ATTEMPTS, RECONNECT_INTERVAL, isAuthenticated, queryClient]);
  // Inicializar la conexión WebSocket
  useEffect(() => {
    // Limpiar estado al montar el componente
    setReconnectAttempts(0);
    setReconnectDisabled(false);

    // Inicializar socket
    const newSocket = initializeSocket();
    if (newSocket) {
      setSocket(newSocket);

      // Limpiar al desmontar
      return () => {
        console.log('Desmontando componente, desconectando socket');
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [initializeSocket]); // Solo se ejecuta cuando cambia la función initializeSocket

  // Efecto para reconectar cuando cambia el token
  useEffect(() => {
    // Escuchar cambios en el token
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bitacora_token' && e.newValue && !socket) {
        // Reconectar si hay un nuevo token y no hay socket
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [socket]);

  // Marcar una notificación como leída
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );

    // Enviar al servidor que la notificación ha sido leída
    if (socket && socket.connected) {
      socket.emit('mark-as-read', { id });
    }
  };

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );

    // Enviar al servidor que todas las notificaciones han sido leídas
    if (socket && socket.connected) {
      socket.emit('mark-all-as-read');
    }
  };

  return (
    <RealTimeNotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      connected
    }}>
      {children}
    </RealTimeNotificationContext.Provider>
  );
};

export const useRealTimeNotifications = () => {
  const context = useContext(RealTimeNotificationContext);
  if (!context) {
    throw new Error('useRealTimeNotifications debe ser usado dentro de un RealTimeNotificationProvider');
  }
  return context;
};
