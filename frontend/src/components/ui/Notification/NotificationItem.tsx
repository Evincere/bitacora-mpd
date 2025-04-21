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
  FiUsers,
  FiZap
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
  CollaborationAction,
  UrgencyLevel
} from '../../../types/notifications';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Propiedades del componente
interface NotificationItemProps {
  notification: RealTimeNotification;
  onClick: () => void;
  onMarkAsRead?: (id: string) => void;
  onViewActivity?: (activityId: number) => void;
  onPostponeReminder?: (notificationId: string, minutes: number) => void;
  onDismissReminder?: (notificationId: string) => void;
  onMarkActivityComplete?: (activityId: number) => void;
}

// Formatear tiempo relativo
const formatTime = (timestamp: number): string => {
  try {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: es
    });
  } catch (error) {
    console.error('Error al formatear tiempo:', error);
    return 'hace un momento';
  }
};

// Obtener texto para el tipo de recordatorio
const getReminderText = (reminderType: ReminderType): string => {
  switch (reminderType) {
    case ReminderType.ONE_DAY:
      return 'Vence en 1 día';
    case ReminderType.FOUR_HOURS:
      return 'Vence en 4 horas';
    case ReminderType.ONE_HOUR:
      return 'Vence en 1 hora';
    default:
      return 'Fecha límite próxima';
  }
};

// Obtener texto para el tipo de anuncio
const getAnnouncementTypeText = (announcementType: AnnouncementType): string => {
  switch (announcementType) {
    case AnnouncementType.GLOBAL:
      return 'Anuncio global';
    case AnnouncementType.DEPARTMENTAL:
      return 'Anuncio departamental';
    case AnnouncementType.EVENT:
      return 'Evento';
    default:
      return 'Anuncio';
  }
};

// Obtener texto para la acción de colaboración
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

// Componente para notificaciones de asignación de tareas
const TaskAssignmentContent: React.FC<{
  notification: TaskAssignmentNotification;
  onViewActivity?: (activityId: number) => void;
  onMarkActivityComplete?: (activityId: number) => void;
}> = ({ notification, onViewActivity, onMarkActivityComplete }) => {
  // Manejar clic en ver actividad
  const handleViewActivity = () => {
    if (onViewActivity && notification.activityId) {
      onViewActivity(notification.activityId);
    }
  };

  // Manejar clic en marcar como completada
  const handleMarkComplete = () => {
    if (onMarkActivityComplete && notification.activityId) {
      onMarkActivityComplete(notification.activityId);
    }
  };

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
        <ActionButton onClick={handleViewActivity}>
          <FiEye size={12} />
          <span>Ver actividad</span>
        </ActionButton>
        <ActionButton onClick={handleMarkComplete}>
          <FiCheckCircle size={12} />
          <span>Marcar completada</span>
        </ActionButton>
      </NotificationActions>
    </NotificationContentWrapper>
  );
};

// Componente para notificaciones de cambio de estado
const TaskStatusChangeContent: React.FC<{
  notification: TaskStatusChangeNotification;
  onViewActivity?: (activityId: number) => void;
}> = ({ notification, onViewActivity }) => {
  // Manejar clic en ver actividad
  const handleViewActivity = () => {
    if (onViewActivity && notification.activityId) {
      onViewActivity(notification.activityId);
    }
  };

  // Obtener color para el estado
  const getStatusColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'COMPLETADA':
        return 'success';
      case 'EN_PROGRESO':
        return 'primary';
      case 'PENDIENTE':
        return 'warning';
      default:
        return 'textSecondary';
    }
  };

  const prevStatusColor = getStatusColor(notification.previousStatus);
  const newStatusColor = getStatusColor(notification.newStatus);

  return (
    <NotificationContentWrapper>
      <NotificationTitle>{notification.title}</NotificationTitle>
      <NotificationMessage>{notification.message}</NotificationMessage>
      <NotificationDetails>
        <DetailItem>
          <FiUser size={12} />
          <span>Cambiado por: {notification.changedByName}</span>
        </DetailItem>
        <StatusChangeItem>
          <StatusBadge $color={prevStatusColor}>
            {notification.previousStatus}
          </StatusBadge>
          <StatusArrow>→</StatusArrow>
          <StatusBadge $color={newStatusColor}>
            {notification.newStatus}
          </StatusBadge>
        </StatusChangeItem>
      </NotificationDetails>
      <NotificationTime>
        <FiClock size={12} />
        {formatTime(notification.timestamp)}
      </NotificationTime>
      <NotificationActions>
        <ActionButton onClick={handleViewActivity}>
          <FiEye size={12} />
          <span>Ver actividad</span>
        </ActionButton>
      </NotificationActions>
    </NotificationContentWrapper>
  );
};

// Componente para notificaciones de recordatorio de fechas límite
const DeadlineReminderContent: React.FC<{
  notification: DeadlineReminderNotification;
  onViewActivity?: (activityId: number) => void;
  onPostponeReminder?: (notificationId: string, minutes: number) => void;
  onDismissReminder?: (notificationId: string) => void;
}> = ({ notification, onViewActivity, onPostponeReminder, onDismissReminder }) => {
  // Estado para mostrar opciones de posposición
  const [showPostponeOptions, setShowPostponeOptions] = React.useState(false);

  // Manejar clic en ver actividad
  const handleViewActivity = () => {
    if (onViewActivity && notification.activityId) {
      onViewActivity(notification.activityId);
    }
  };

  // Manejar clic en posponer
  const handlePostpone = (minutes: number) => {
    if (onPostponeReminder && notification.id) {
      onPostponeReminder(notification.id, minutes);
      setShowPostponeOptions(false);
    }
  };

  // Manejar clic en descartar
  const handleDismiss = () => {
    if (onDismissReminder && notification.id) {
      onDismissReminder(notification.id);
    }
  };

  // Determinar si el recordatorio es urgente
  const isUrgent = notification.reminderType === ReminderType.ONE_HOUR;

  return (
    <NotificationContentWrapper>
      <NotificationTitle>{notification.title}</NotificationTitle>
      <NotificationMessage>{notification.message}</NotificationMessage>
      <NotificationDetails>
        <DetailItem $urgent={isUrgent}>
          <FiCalendar size={12} />
          <span>{getReminderText(notification.reminderType)}</span>
        </DetailItem>
        <DetailItem>
          <FiClock size={12} />
          <span>Fecha límite: {formatTime(notification.dueDate)}</span>
        </DetailItem>
      </NotificationDetails>

      {isUrgent && (
        <UrgentReminderBanner>
          <FiAlertTriangle size={14} />
          <span>¡Atención! Esta actividad vence pronto</span>
        </UrgentReminderBanner>
      )}

      <NotificationTime>
        <FiClock size={12} />
        {formatTime(notification.timestamp)}
      </NotificationTime>

      <NotificationActions>
        <ActionButton onClick={handleViewActivity}>
          <FiEye size={12} />
          <span>Ver actividad</span>
        </ActionButton>

        {showPostponeOptions ? (
          <PostponeOptions>
            <PostponeOption onClick={() => handlePostpone(15)}>15m</PostponeOption>
            <PostponeOption onClick={() => handlePostpone(30)}>30m</PostponeOption>
            <PostponeOption onClick={() => handlePostpone(60)}>1h</PostponeOption>
            <PostponeOption onClick={() => handlePostpone(240)}>4h</PostponeOption>
            <PostponeCancel onClick={() => setShowPostponeOptions(false)}>×</PostponeCancel>
          </PostponeOptions>
        ) : (
          <ActionButton onClick={() => setShowPostponeOptions(true)}>
            <FiClock size={12} />
            <span>Posponer</span>
          </ActionButton>
        )}

        <ActionButton onClick={handleDismiss}>
          <FiX size={12} />
          <span>Descartar</span>
        </ActionButton>
      </NotificationActions>
    </NotificationContentWrapper>
  );
};

// Componente para notificaciones de anuncios
const AnnouncementContent: React.FC<{
  notification: AnnouncementNotification;
  onMarkAsRead?: (id: string) => void;
}> = ({ notification, onMarkAsRead }) => {
  // Manejar clic en marcar como leído
  const handleMarkAsRead = () => {
    if (onMarkAsRead && notification.id) {
      onMarkAsRead(notification.id);
    }
  };

  // Determinar si es un evento
  const isEvent = notification.announcementType === AnnouncementType.EVENT;

  return (
    <NotificationContentWrapper>
      <NotificationTitle>{notification.title}</NotificationTitle>
      <NotificationMessage>{notification.message}</NotificationMessage>
      <NotificationDetails>
        <DetailItem>
          <FiUser size={12} />
          <span>De: {notification.createdByName}</span>
        </DetailItem>
        <DetailItem $highlight={isEvent}>
          <FiInfo size={12} />
          <span>{getAnnouncementTypeText(notification.announcementType)}</span>
        </DetailItem>
        {notification.eventDate && (
          <DetailItem $highlight={true}>
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

      {isEvent && notification.eventDate && (
        <EventCountdown date={notification.eventDate} />
      )}

      <NotificationTime>
        <FiClock size={12} />
        {formatTime(notification.timestamp)}
      </NotificationTime>
      <NotificationActions>
        <ActionButton>
          <FiMessageSquare size={12} />
          <span>Ver detalles</span>
        </ActionButton>
        <ActionButton onClick={handleMarkAsRead}>
          <FiCheckCircle size={12} />
          <span>Marcar como leído</span>
        </ActionButton>
      </NotificationActions>
    </NotificationContentWrapper>
  );
};

// Componente para mostrar la cuenta regresiva para eventos
const EventCountdown: React.FC<{ date: number }> = ({ date }) => {
  const [timeLeft, setTimeLeft] = React.useState<string>('');

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const eventDate = new Date(date).getTime();
      const difference = eventDate - now;

      if (difference <= 0) {
        setTimeLeft('Evento en curso o finalizado');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`Faltan ${days} días y ${hours} horas`);
      } else if (hours > 0) {
        setTimeLeft(`Faltan ${hours} horas y ${minutes} minutos`);
      } else {
        setTimeLeft(`Faltan ${minutes} minutos`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Actualizar cada minuto

    return () => clearInterval(timer);
  }, [date]);

  return (
    <CountdownBanner>
      <FiClock size={14} />
      <span>{timeLeft}</span>
    </CountdownBanner>
  );
};

// Componente para notificaciones de colaboración
const CollaborationContent: React.FC<{
  notification: CollaborationNotification;
  onViewActivity?: (activityId: number) => void;
  onMarkAsRead?: (id: string) => void;
}> = ({ notification, onViewActivity, onMarkAsRead }) => {
  // Manejar clic en ver actividad
  const handleViewActivity = () => {
    if (onViewActivity && notification.activityId) {
      onViewActivity(notification.activityId);
    }
  };

  // Manejar clic en marcar como leído
  const handleMarkAsRead = () => {
    if (onMarkAsRead && notification.id) {
      onMarkAsRead(notification.id);
    }
  };

  // Determinar si es un comentario
  const isComment = notification.action === CollaborationAction.COMMENTED;
  // Determinar si es una edición
  const isEditing = notification.action === CollaborationAction.EDITING;

  return (
    <NotificationContentWrapper>
      <NotificationTitle>{notification.title}</NotificationTitle>
      <NotificationMessage>{notification.message}</NotificationMessage>
      <NotificationDetails>
        <DetailItem $highlight={isEditing}>
          <FiUser size={12} />
          <span>{notification.userName} {getActionText(notification.action)} la actividad</span>
        </DetailItem>
        {isComment && (
          <DetailItem $highlight={true}>
            <FiMessageSquare size={12} />
            <span>Nuevo comentario</span>
          </DetailItem>
        )}
      </NotificationDetails>

      {isEditing && (
        <CollaborationBanner>
          <FiUsers size={14} />
          <span>Colaboración en tiempo real activa</span>
        </CollaborationBanner>
      )}

      <NotificationTime>
        <FiClock size={12} />
        {formatTime(notification.timestamp)}
      </NotificationTime>
      <NotificationActions>
        <ActionButton onClick={handleViewActivity}>
          <FiEye size={12} />
          <span>Ver actividad</span>
        </ActionButton>
        {isComment && (
          <ActionButton onClick={handleViewActivity}>
            <FiMessageSquare size={12} />
            <span>Ver comentario</span>
          </ActionButton>
        )}
        <ActionButton onClick={handleMarkAsRead}>
          <FiCheckCircle size={12} />
          <span>Marcar como leído</span>
        </ActionButton>
      </NotificationActions>
    </NotificationContentWrapper>
  );
};

// Componente para notificaciones genéricas
const GenericContent: React.FC<{
  notification: RealTimeNotification;
  onMarkAsRead?: (id: string) => void;
}> = ({ notification, onMarkAsRead }) => {
  // Manejar clic en marcar como leído
  const handleMarkAsRead = () => {
    if (onMarkAsRead && notification.id) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <NotificationContentWrapper>
      <NotificationTitle>{notification.title}</NotificationTitle>
      <NotificationMessage>{notification.message}</NotificationMessage>
      <NotificationTime>
        <FiClock size={12} />
        {formatTime(notification.timestamp)}
      </NotificationTime>
      <NotificationActions>
        <ActionButton onClick={handleMarkAsRead}>
          <FiCheckCircle size={12} />
          <span>Marcar como leído</span>
        </ActionButton>
      </NotificationActions>
    </NotificationContentWrapper>
  );
};

// Componente principal
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
  onMarkAsRead,
  onViewActivity,
  onPostponeReminder,
  onDismissReminder,
  onMarkActivityComplete
}) => {
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
      return (
        <TaskAssignmentContent
          notification={notification}
          onViewActivity={onViewActivity}
          onMarkActivityComplete={onMarkActivityComplete}
        />
      );
    } else if (isNotificationType<TaskStatusChangeNotification>(notification, 'TaskStatusChange')) {
      return (
        <TaskStatusChangeContent
          notification={notification}
          onViewActivity={onViewActivity}
        />
      );
    } else if (isNotificationType<DeadlineReminderNotification>(notification, 'DeadlineReminder')) {
      return (
        <DeadlineReminderContent
          notification={notification}
          onViewActivity={onViewActivity}
          onPostponeReminder={onPostponeReminder}
          onDismissReminder={onDismissReminder}
        />
      );
    } else if (isNotificationType<AnnouncementNotification>(notification, 'Announcement')) {
      return (
        <AnnouncementContent
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      );
    } else if (isNotificationType<CollaborationNotification>(notification, 'Collaboration')) {
      return (
        <CollaborationContent
          notification={notification}
          onViewActivity={onViewActivity}
          onMarkAsRead={onMarkAsRead}
        />
      );
    } else {
      return (
        <GenericContent
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      );
    }
  };

  return (
    <NotificationItemWrapper
      $read={!!notification.read}
      $type={notification.type as string}
      $urgency={notification.urgency}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`${notification.title}: ${notification.message}`}
    >
      <NotificationIcon $type={notification.type as string} $urgency={notification.urgency}>
        {notification.urgency === UrgencyLevel.HIGH || notification.urgency === UrgencyLevel.CRITICAL ? (
          <FiZap />
        ) : (
          getIcon(notification.type as string)
        )}
      </NotificationIcon>
      {renderContent()}
      {notification.urgency && (
        <UrgencyBadge $urgency={notification.urgency}>
          {notification.urgency === UrgencyLevel.LOW && 'Baja'}
          {notification.urgency === UrgencyLevel.MEDIUM && 'Media'}
          {notification.urgency === UrgencyLevel.HIGH && 'Alta'}
          {notification.urgency === UrgencyLevel.CRITICAL && 'Crítica'}
        </UrgencyBadge>
      )}
    </NotificationItemWrapper>
  );
};

// Estilos
const NotificationItemWrapper = styled.div<{ $read?: boolean; $type: string; $urgency?: UrgencyLevel }>`
  display: flex;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: ${({ theme, $read }) =>
    $read ? theme.backgroundSecondary : theme.backgroundAlt};
  border-left: 3px solid ${({ theme, $type, $urgency }) => {
    if ($urgency === UrgencyLevel.HIGH) return theme.warning;
    if ($urgency === UrgencyLevel.CRITICAL) return theme.error;

    switch ($type) {
      case NotificationType.SUCCESS:
        return theme.success;
      case NotificationType.ERROR:
        return theme.error;
      case NotificationType.WARNING:
        return theme.warning;
      case NotificationType.INFO:
        return theme.info;
      case NotificationType.TASK_ASSIGNMENT:
        return theme.primary;
      case NotificationType.TASK_STATUS_CHANGE:
        return theme.secondary;
      case NotificationType.DEADLINE_REMINDER:
        return theme.warning;
      case NotificationType.ANNOUNCEMENT:
        return theme.info;
      case NotificationType.COLLABORATION:
        return theme.accent;
      default:
        return theme.border;
    }
  }};
  position: relative;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }

  ${({ $urgency }) => $urgency === UrgencyLevel.CRITICAL && css`
    animation: pulse 2s infinite;

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
      }
    }
  `}
`;

const NotificationIcon = styled.div<{ $type: string; $urgency?: UrgencyLevel }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
  background-color: ${({ theme, $type, $urgency }) => {
    if ($urgency === UrgencyLevel.HIGH) return `${theme.warning}20`;
    if ($urgency === UrgencyLevel.CRITICAL) return `${theme.error}20`;

    switch ($type) {
      case NotificationType.SUCCESS:
        return `${theme.success}20`;
      case NotificationType.ERROR:
        return `${theme.error}20`;
      case NotificationType.WARNING:
        return `${theme.warning}20`;
      case NotificationType.INFO:
        return `${theme.info}20`;
      case NotificationType.TASK_ASSIGNMENT:
        return `${theme.primary}20`;
      case NotificationType.TASK_STATUS_CHANGE:
        return `${theme.secondary}20`;
      case NotificationType.DEADLINE_REMINDER:
        return `${theme.warning}20`;
      case NotificationType.ANNOUNCEMENT:
        return `${theme.info}20`;
      case NotificationType.COLLABORATION:
        return `${theme.accent}20`;
      default:
        return theme.backgroundAlt;
    }
  }};
  color: ${({ theme, $type, $urgency }) => {
    if ($urgency === UrgencyLevel.HIGH) return theme.warning;
    if ($urgency === UrgencyLevel.CRITICAL) return theme.error;

    switch ($type) {
      case NotificationType.SUCCESS:
        return theme.success;
      case NotificationType.ERROR:
        return theme.error;
      case NotificationType.WARNING:
        return theme.warning;
      case NotificationType.INFO:
        return theme.info;
      case NotificationType.TASK_ASSIGNMENT:
        return theme.primary;
      case NotificationType.TASK_STATUS_CHANGE:
        return theme.secondary;
      case NotificationType.DEADLINE_REMINDER:
        return theme.warning;
      case NotificationType.ANNOUNCEMENT:
        return theme.info;
      case NotificationType.COLLABORATION:
        return theme.accent;
      default:
        return theme.textSecondary;
    }
  }};
  font-size: 18px;
`;

const NotificationContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.h4`
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
`;

const NotificationMessage = styled.p`
  margin: 0 0 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.4;
`;

const NotificationDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

const DetailItem = styled.div<{ $urgent?: boolean; $highlight?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme, $urgent, $highlight }) => {
    if ($urgent) return theme.error;
    if ($highlight) return theme.primary;
    return theme.textSecondary;
  }};
  background-color: ${({ theme, $urgent, $highlight }) => {
    if ($urgent) return `${theme.error}10`;
    if ($highlight) return `${theme.primary}10`;
    return `${theme.textSecondary}10`;
  }};
  padding: 2px 6px;
  border-radius: 4px;

  svg {
    flex-shrink: 0;
  }
`;

const NotificationTime = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: ${({ theme }) => theme.textTertiary};
  margin-top: 8px;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const UrgentReminderBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin: 8px 0;
  background-color: ${({ theme }) => theme.errorLight};
  color: ${({ theme }) => theme.error};
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;

  svg {
    flex-shrink: 0;
  }
`;

const CountdownBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin: 8px 0;
  background-color: ${({ theme }) => theme.primaryLight};
  color: ${({ theme }) => theme.primary};
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;

  svg {
    flex-shrink: 0;
  }
`;

const CollaborationBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin: 8px 0;
  background-color: ${({ theme }) => theme.accentLight};
  color: ${({ theme }) => theme.accent};
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;

  svg {
    flex-shrink: 0;
  }
`;

const PostponeOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
`;

const PostponeOption = styled.button`
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.primaryLight};
  color: ${({ theme }) => theme.primary};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const PostponeCancel = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.backgroundAlt};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  font-weight: bold;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const StatusChangeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.backgroundAlt};
`;

const StatusBadge = styled.div<{ $color: string }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ theme, $color }) => `${theme[$color]}20`};
  color: ${({ theme, $color }) => theme[$color]};
`;

const StatusArrow = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const UrgencyBadge = styled.div<{ $urgency: UrgencyLevel }>`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;

  ${({ $urgency, theme }) => {
    switch ($urgency) {
      case UrgencyLevel.LOW:
        return css`
          background-color: ${theme.infoLight};
          color: ${theme.info};
        `;
      case UrgencyLevel.MEDIUM:
        return css`
          background-color: ${theme.primaryLight};
          color: ${theme.primary};
        `;
      case UrgencyLevel.HIGH:
        return css`
          background-color: ${theme.warningLight};
          color: ${theme.warning};
        `;
      case UrgencyLevel.CRITICAL:
        return css`
          background-color: ${theme.errorLight};
          color: ${theme.error};
        `;
      default:
        return css`
          background-color: ${theme.backgroundAlt};
          color: ${theme.textSecondary};
        `;
    }
  }}
`;

export default NotificationItem;
