import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiActivity, FiCheck, FiPlay, FiX, FiThumbsUp, FiClock, FiRefreshCw } from 'react-icons/fi';
import { useRealTimeNotifications } from '@/features/notifications/hooks/useRealTimeNotifications';
import { 
  RealTimeNotification, 
  NotificationType,
  TaskCompletedNotification,
  TaskStartedNotification,
  TaskRejectedNotification,
  TaskApprovedNotification
} from '@/types/notifications';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 16px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const NotificationList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.li<{ $type: string }>`
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: ${({ theme, $type }) => {
    switch ($type) {
      case NotificationType.TASK_COMPLETED:
        return theme.successLight;
      case NotificationType.TASK_STARTED:
        return theme.infoLight;
      case NotificationType.TASK_REJECTED:
        return theme.errorLight;
      case NotificationType.TASK_APPROVED:
        return theme.successLight;
      default:
        return theme.backgroundHover;
    }
  }};
  
  border-left: 4px solid ${({ theme, $type }) => {
    switch ($type) {
      case NotificationType.TASK_COMPLETED:
        return theme.success;
      case NotificationType.TASK_STARTED:
        return theme.info;
      case NotificationType.TASK_REJECTED:
        return theme.error;
      case NotificationType.TASK_APPROVED:
        return theme.success;
      default:
        return theme.border;
    }
  }};
`;

const NotificationIcon = styled.div<{ $type: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background-color: ${({ theme, $type }) => {
    switch ($type) {
      case NotificationType.TASK_COMPLETED:
        return theme.success;
      case NotificationType.TASK_STARTED:
        return theme.info;
      case NotificationType.TASK_REJECTED:
        return theme.error;
      case NotificationType.TASK_APPROVED:
        return theme.success;
      default:
        return theme.textSecondary;
    }
  }};
  color: white;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 4px;
`;

const NotificationMessage = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
`;

const NotificationMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const NotificationTime = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const NotificationLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px 0;
  color: ${({ theme }) => theme.textSecondary};
`;

interface ActivityNotificationsProps {
  maxItems?: number;
}

/**
 * Componente que muestra las notificaciones de actividad en tiempo real.
 */
const ActivityNotifications: React.FC<ActivityNotificationsProps> = ({ maxItems = 10 }) => {
  const { notifications } = useRealTimeNotifications();
  const [activityNotifications, setActivityNotifications] = useState<RealTimeNotification[]>([]);
  
  // Filtrar las notificaciones relacionadas con actividades
  useEffect(() => {
    const filteredNotifications = notifications.filter(notification => {
      return [
        NotificationType.TASK_COMPLETED,
        NotificationType.TASK_STARTED,
        NotificationType.TASK_REJECTED,
        NotificationType.TASK_APPROVED,
        NotificationType.TASK_STATUS_CHANGE,
        NotificationType.TASK_ASSIGNMENT
      ].includes(notification.type as NotificationType);
    }).slice(0, maxItems);
    
    setActivityNotifications(filteredNotifications);
  }, [notifications, maxItems]);
  
  // Obtener el icono según el tipo de notificación
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case NotificationType.TASK_COMPLETED:
        return <FiCheck size={16} />;
      case NotificationType.TASK_STARTED:
        return <FiPlay size={16} />;
      case NotificationType.TASK_REJECTED:
        return <FiX size={16} />;
      case NotificationType.TASK_APPROVED:
        return <FiThumbsUp size={16} />;
      default:
        return <FiActivity size={16} />;
    }
  };
  
  // Obtener el enlace según el tipo de notificación
  const getNotificationLink = (notification: RealTimeNotification) => {
    // Si la notificación tiene un enlace, usarlo
    if (notification.link) {
      return notification.link;
    }
    
    // Si es una notificación de tarea completada
    if (notification.type === NotificationType.TASK_COMPLETED) {
      const taskNotification = notification as TaskCompletedNotification;
      return `/app/tareas/detalle/${taskNotification.activityId}`;
    }
    
    // Si es una notificación de tarea iniciada
    if (notification.type === NotificationType.TASK_STARTED) {
      const taskNotification = notification as TaskStartedNotification;
      return `/app/tareas/detalle/${taskNotification.activityId}`;
    }
    
    // Si es una notificación de tarea rechazada
    if (notification.type === NotificationType.TASK_REJECTED) {
      const taskNotification = notification as TaskRejectedNotification;
      return `/app/tareas/detalle/${taskNotification.activityId}`;
    }
    
    // Si es una notificación de tarea aprobada
    if (notification.type === NotificationType.TASK_APPROVED) {
      const taskNotification = notification as TaskApprovedNotification;
      return `/app/tareas/detalle/${taskNotification.activityId}`;
    }
    
    // Por defecto, redirigir a la página de actividades
    return '/app/activities';
  };
  
  return (
    <Container>
      <Header>
        <Title>
          <FiActivity size={18} />
          Actividad reciente
        </Title>
        <RefreshButton>
          <FiRefreshCw size={16} />
        </RefreshButton>
      </Header>
      
      {activityNotifications.length > 0 ? (
        <NotificationList>
          {activityNotifications.map(notification => (
            <NotificationItem key={notification.id} $type={notification.type}>
              <NotificationIcon $type={notification.type}>
                {getNotificationIcon(notification.type)}
              </NotificationIcon>
              <NotificationContent>
                <NotificationTitle>{notification.title}</NotificationTitle>
                <NotificationMessage>{notification.message}</NotificationMessage>
                <NotificationMeta>
                  <NotificationTime>
                    <FiClock size={12} />
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true, locale: es })}
                  </NotificationTime>
                  <NotificationLink to={getNotificationLink(notification)}>
                    Ver detalles
                  </NotificationLink>
                </NotificationMeta>
              </NotificationContent>
            </NotificationItem>
          ))}
        </NotificationList>
      ) : (
        <EmptyState>
          No hay notificaciones de actividad recientes.
        </EmptyState>
      )}
    </Container>
  );
};

export default ActivityNotifications;
