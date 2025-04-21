import React from 'react';
import styled, { css } from 'styled-components';
import { 
  FiBell, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiInfo, 
  FiAlertTriangle,
  FiClock,
  FiUser,
  FiRefreshCw,
  FiCalendar,
  FiMessageSquare,
  FiUsers
} from 'react-icons/fi';
import { 
  RealTimeNotification, 
  NotificationType,
  isNotificationType,
  TaskAssignmentNotification,
  TaskStatusChangeNotification,
  DeadlineReminderNotification,
  AnnouncementNotification,
  CollaborationNotification,
  ReminderType,
  AnnouncementType,
  CollaborationAction
} from '../../../types/notifications';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Propiedades del componente
interface NotificationItemProps {
  notification: RealTimeNotification;
  onClick: () => void;
}

// Componente para formatear la fecha
const formatTime = (timestamp: number): string => {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: es });
  } catch (error) {
    return 'hace un momento';
  }
};

// Componente para notificaciones de asignación de tareas
const TaskAssignmentContent: React.FC<{ notification: TaskAssignmentNotification }> = ({ notification }) => {
  return (
    <NotificationContentWrapper>
      <NotificationTitle>{notification.title}</NotificationTitle>
      <NotificationMessage>{notification.message}</NotificationMessage>
      <NotificationDetails>
        <DetailItem>
          <FiUser size={12} />
          <span>Asignado por: {notification.assignerName}</span>
        </DetailItem>
        {notification.dueDate && (
          <DetailItem>
            <FiCalendar size={12} />
            <span>Fecha límite: {formatTime(notification.dueDate)}</span>
          </DetailItem>
        )}
      </NotificationDetails>
      <NotificationTime>
        <FiClock size={12} />
        {formatTime(notification.timestamp)}
      </NotificationTime>
      <NotificationActions>
        <ActionButton>Ver actividad</ActionButton>
        <ActionButton>Marcar como completada</ActionButton>
      </NotificationActions>
    </NotificationContentWrapper>
  );
};

// Componente para notificaciones de cambio de estado
const TaskStatusChangeContent: React.FC<{ notification: TaskStatusChangeNotification }> = ({ notification }) => {
  return (
    <NotificationContentWrapper>
      <NotificationTitle>{notification.title}</NotificationTitle>
      <NotificationMessage>{notification.message}</NotificationMessage>
      <NotificationDetails>
        <DetailItem>
          <FiUser size={12} />
          <span>Cambiado por: {notification.changedByName}</span>
        </DetailItem>
        <DetailItem>
          <FiRefreshCw size={12} />
          <span>Estado: {notification.previousStatus} → {notification.newStatus}</span>
        </DetailItem>
      </NotificationDetails>
      <NotificationTime>
        <FiClock size={12} />
        {formatTime(notification.timestamp)}
      </NotificationTime>
      <NotificationActions>
        <ActionButton>Ver actividad</ActionButton>
      </NotificationActions>
    </NotificationContentWrapper>
  );
};

// Componente para notificaciones de recordatorio de fechas límite
const DeadlineReminderContent: React.FC<{ notification: DeadlineReminderNotification }> = ({ notification }) => {
  const getReminderText = (reminderType: ReminderType): string => {
    switch (reminderType) {
      case ReminderType.ONE_DAY:
        return 'Vence en 1 día';
      case ReminderType.FOUR_HOURS:
        return 'Vence en 4 horas';
      case ReminderType.ONE_HOUR:
        return 'Vence en 1 hora';
      default:
        return `Vence en ${notification.hoursRemaining} horas`;
    }
  };

  return (
    <NotificationContentWrapper>
      <NotificationTitle>{notification.title}</NotificationTitle>
      <NotificationMessage>{notification.message}</NotificationMessage>
      <NotificationDetails>
        <DetailItem $urgent={notification.reminderType === ReminderType.ONE_HOUR}>
          <FiCalendar size={12} />
          <span>{getReminderText(notification.reminderType)}</span>
        </DetailItem>
        <DetailItem>
          <FiClock size={12} />
          <span>Fecha límite: {formatTime(notification.dueDate)}</span>
        </DetailItem>
      </NotificationDetails>
      <NotificationTime>
        <FiClock size={12} />
        {formatTime(notification.timestamp)}
      </NotificationTime>
      <NotificationActions>
        <ActionButton>Ver actividad</ActionButton>
        <ActionButton>Posponer recordatorio</ActionButton>
      </NotificationActions>
    </NotificationContentWrapper>
  );
};

// Componente para notificaciones de anuncios
const AnnouncementContent: React.FC<{ notification: AnnouncementNotification }> = ({ notification }) => {
  const getAnnouncementTypeText = (type: AnnouncementType): string => {
    switch (type) {
      case AnnouncementType.GLOBAL:
        return 'Anuncio global';
      case AnnouncementType.DEPARTMENTAL:
        return `Anuncio para ${notification.department}`;
      case AnnouncementType.EVENT:
        return 'Evento programado';
      default:
        return 'Anuncio';
    }
  };

  return (
    <NotificationContentWrapper>
      <NotificationTitle>{notification.title}</NotificationTitle>
      <NotificationMessage>{notification.message}</NotificationMessage>
      <NotificationDetails>
        <DetailItem>
          <FiUser size={12} />
          <span>De: {notification.createdByName}</span>
        </DetailItem>
        <DetailItem>
          <FiInfo size={12} />
          <span>{getAnnouncementTypeText(notification.announcementType)}</span>
        </DetailItem>
        {notification.eventDate && (
          <DetailItem>
            <FiCalendar size={12} />
            <span>Fecha: {formatTime(notification.eventDate)}</span>
          </DetailItem>
        )}
        {notification.location && (
          <DetailItem>
            <FiInfo size={12} />
            <span>Lugar: {notification.location}</span>
          </DetailItem>
        )}
      </NotificationDetails>
      <NotificationTime>
        <FiClock size={12} />
        {formatTime(notification.timestamp)}
      </NotificationTime>
      {notification.announcementType === AnnouncementType.EVENT && (
        <NotificationActions>
          <ActionButton>Añadir a calendario</ActionButton>
        </NotificationActions>
      )}
    </NotificationContentWrapper>
  );
};

// Componente para notificaciones de colaboración
const CollaborationContent: React.FC<{ notification: CollaborationNotification }> = ({ notification }) => {
  const getActionText = (action: CollaborationAction): string => {
    switch (action) {
      case CollaborationAction.VIEWING:
        return 'está viendo';
      case CollaborationAction.EDITING:
        return 'está editando';
      case CollaborationAction.COMMENTED:
        return 'ha comentado en';
      default:
        return 'está interactuando con';
    }
  };

  return (
    <NotificationContentWrapper>
      <NotificationTitle>{notification.title}</NotificationTitle>
      <NotificationMessage>{notification.message}</NotificationMessage>
      <NotificationDetails>
        <DetailItem>
          <FiUser size={12} />
          <span>{notification.userName} {getActionText(notification.action)} la actividad</span>
        </DetailItem>
        {notification.action === CollaborationAction.COMMENTED && (
          <DetailItem>
            <FiMessageSquare size={12} />
            <span>Nuevo comentario</span>
          </DetailItem>
        )}
      </NotificationDetails>
      <NotificationTime>
        <FiClock size={12} />
        {formatTime(notification.timestamp)}
      </NotificationTime>
      <NotificationActions>
        <ActionButton>Ver actividad</ActionButton>
        {notification.action === CollaborationAction.COMMENTED && (
          <ActionButton>Ver comentario</ActionButton>
        )}
      </NotificationActions>
    </NotificationContentWrapper>
  );
};

// Componente para notificaciones genéricas
const GenericContent: React.FC<{ notification: RealTimeNotification }> = ({ notification }) => {
  return (
    <NotificationContentWrapper>
      <NotificationTitle>{notification.title}</NotificationTitle>
      <NotificationMessage>{notification.message}</NotificationMessage>
      <NotificationTime>
        <FiClock size={12} />
        {formatTime(notification.timestamp)}
      </NotificationTime>
    </NotificationContentWrapper>
  );
};

// Componente principal
const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  // Obtener el icono según el tipo de notificación
  const getIcon = (type: string): React.ReactNode => {
    switch (type) {
      case NotificationType.SUCCESS:
        return <FiCheckCircle />;
      case NotificationType.ERROR:
        return <FiAlertCircle />;
      case NotificationType.WARNING:
        return <FiAlertTriangle />;
      case NotificationType.INFO:
        return <FiInfo />;
      case NotificationType.TASK_ASSIGNMENT:
        return <FiUser />;
      case NotificationType.TASK_STATUS_CHANGE:
        return <FiRefreshCw />;
      case NotificationType.DEADLINE_REMINDER:
        return <FiCalendar />;
      case NotificationType.ANNOUNCEMENT:
        return <FiMessageSquare />;
      case NotificationType.COLLABORATION:
        return <FiUsers />;
      default:
        return <FiBell />;
    }
  };

  // Renderizar el contenido según el tipo de notificación
  const renderContent = () => {
    if (isNotificationType<TaskAssignmentNotification>(notification, 'TaskAssignment')) {
      return <TaskAssignmentContent notification={notification} />;
    } else if (isNotificationType<TaskStatusChangeNotification>(notification, 'TaskStatusChange')) {
      return <TaskStatusChangeContent notification={notification} />;
    } else if (isNotificationType<DeadlineReminderNotification>(notification, 'DeadlineReminder')) {
      return <DeadlineReminderContent notification={notification} />;
    } else if (isNotificationType<AnnouncementNotification>(notification, 'Announcement')) {
      return <AnnouncementContent notification={notification} />;
    } else if (isNotificationType<CollaborationNotification>(notification, 'Collaboration')) {
      return <CollaborationContent notification={notification} />;
    } else {
      return <GenericContent notification={notification} />;
    }
  };

  return (
    <NotificationItemWrapper
      $read={!!notification.read}
      $type={notification.type as string}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`${notification.title}: ${notification.message}`}
    >
      <NotificationIcon $type={notification.type as string}>
        {getIcon(notification.type as string)}
      </NotificationIcon>
      {renderContent()}
    </NotificationItemWrapper>
  );
};

// Estilos
const NotificationItemWrapper = styled.div<{ $read?: boolean; $type: string }>`
  display: flex;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: ${({ theme, $read }) => 
    $read ? theme.colors.background : theme.colors.backgroundAlt};
  border-left: 3px solid ${({ theme, $type }) => {
    switch ($type) {
      case NotificationType.SUCCESS:
        return theme.colors.success;
      case NotificationType.ERROR:
        return theme.colors.error;
      case NotificationType.WARNING:
        return theme.colors.warning;
      case NotificationType.INFO:
        return theme.colors.info;
      case NotificationType.TASK_ASSIGNMENT:
        return theme.colors.primary;
      case NotificationType.TASK_STATUS_CHANGE:
        return theme.colors.secondary;
      case NotificationType.DEADLINE_REMINDER:
        return theme.colors.warning;
      case NotificationType.ANNOUNCEMENT:
        return theme.colors.info;
      case NotificationType.COLLABORATION:
        return theme.colors.tertiary;
      default:
        return theme.colors.border;
    }
  }};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  opacity: ${({ $read }) => ($read ? 0.7 : 1)};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
  }
`;

const NotificationIcon = styled.div<{ $type: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
  background-color: ${({ theme, $type }) => {
    switch ($type) {
      case NotificationType.SUCCESS:
        return theme.colors.successLight;
      case NotificationType.ERROR:
        return theme.colors.errorLight;
      case NotificationType.WARNING:
        return theme.colors.warningLight;
      case NotificationType.INFO:
        return theme.colors.infoLight;
      case NotificationType.TASK_ASSIGNMENT:
        return theme.colors.primaryLight;
      case NotificationType.TASK_STATUS_CHANGE:
        return theme.colors.secondaryLight;
      case NotificationType.DEADLINE_REMINDER:
        return theme.colors.warningLight;
      case NotificationType.ANNOUNCEMENT:
        return theme.colors.infoLight;
      case NotificationType.COLLABORATION:
        return theme.colors.tertiaryLight;
      default:
        return theme.colors.backgroundAlt;
    }
  }};
  color: ${({ theme, $type }) => {
    switch ($type) {
      case NotificationType.SUCCESS:
        return theme.colors.success;
      case NotificationType.ERROR:
        return theme.colors.error;
      case NotificationType.WARNING:
        return theme.colors.warning;
      case NotificationType.INFO:
        return theme.colors.info;
      case NotificationType.TASK_ASSIGNMENT:
        return theme.colors.primary;
      case NotificationType.TASK_STATUS_CHANGE:
        return theme.colors.secondary;
      case NotificationType.DEADLINE_REMINDER:
        return theme.colors.warning;
      case NotificationType.ANNOUNCEMENT:
        return theme.colors.info;
      case NotificationType.COLLABORATION:
        return theme.colors.tertiary;
      default:
        return theme.colors.text;
    }
  }};
  flex-shrink: 0;
`;

const NotificationContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.h4`
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const NotificationMessage = styled.p`
  margin: 0 0 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
  word-break: break-word;
`;

const NotificationDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
`;

const DetailItem = styled.div<{ $urgent?: boolean }>`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: ${({ theme, $urgent }) => $urgent ? theme.colors.error : theme.colors.textSecondary};
  
  svg {
    margin-right: 4px;
  }
  
  ${({ $urgent }) => $urgent && css`
    font-weight: 600;
  `}
`;

const NotificationTime = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 4px;
  
  svg {
    margin-right: 4px;
  }
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

export default NotificationItem;
