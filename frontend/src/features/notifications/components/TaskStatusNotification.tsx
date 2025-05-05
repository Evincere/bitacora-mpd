import React from 'react';
import styled from 'styled-components';
import { 
  FiPlay, 
  FiCheck, 
  FiClock, 
  FiAlertCircle, 
  FiUser, 
  FiCalendar,
  FiMessageSquare
} from 'react-icons/fi';
import { TaskStatusChangeNotification } from '@/core/types/models';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TaskStatusNotificationProps {
  notification: TaskStatusChangeNotification;
  onClick: () => void;
}

const NotificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid ${({ theme }) => theme.primary};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const NotificationTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const NotificationTimestamp = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const NotificationContent = styled.div`
  margin-bottom: 12px;
`;

const NotificationMessage = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  margin: 0 0 8px 0;
  line-height: 1.5;
`;

const NotificationDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
  background-color: ${({ theme }) => theme.backgroundAlt};
  padding: 4px 8px;
  border-radius: 4px;
`;

const StatusChange = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 8px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 6px;
`;

const StatusItem = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'REQUESTED':
      case 'SUBMITTED':
        return `
          color: ${theme.info};
          background-color: ${theme.info}20;
        `;
      case 'ASSIGNED':
        return `
          color: ${theme.warning};
          background-color: ${theme.warning}20;
        `;
      case 'IN_PROGRESS':
        return `
          color: ${theme.primary};
          background-color: ${theme.primary}20;
        `;
      case 'COMPLETED':
        return `
          color: ${theme.success};
          background-color: ${theme.success}20;
        `;
      default:
        return `
          color: ${theme.textSecondary};
          background-color: ${theme.backgroundHover};
        `;
    }
  }}
`;

const ArrowIcon = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 18px;
`;

// Función para obtener el icono de estado
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'REQUESTED':
    case 'SUBMITTED':
      return <FiClock size={14} />;
    case 'ASSIGNED':
      return <FiUser size={14} />;
    case 'IN_PROGRESS':
      return <FiPlay size={14} />;
    case 'COMPLETED':
      return <FiCheck size={14} />;
    default:
      return <FiAlertCircle size={14} />;
  }
};

// Función para obtener el texto de estado
const getStatusText = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return 'Solicitada';
    case 'SUBMITTED':
      return 'Enviada';
    case 'ASSIGNED':
      return 'Asignada';
    case 'IN_PROGRESS':
      return 'En Progreso';
    case 'COMPLETED':
      return 'Completada';
    case 'APPROVED':
      return 'Aprobada';
    case 'REJECTED':
      return 'Rechazada';
    default:
      return status;
  }
};

// Función para formatear la fecha
const formatDate = (timestamp: number) => {
  try {
    return format(new Date(timestamp), "d 'de' MMMM 'a las' HH:mm", { locale: es });
  } catch (error) {
    return 'Fecha desconocida';
  }
};

const TaskStatusNotification: React.FC<TaskStatusNotificationProps> = ({ notification, onClick }) => {
  return (
    <NotificationContainer onClick={onClick}>
      <NotificationHeader>
        <NotificationTitle>
          Cambio de estado en tarea
        </NotificationTitle>
        <NotificationTimestamp>
          {formatDate(notification.timestamp)}
        </NotificationTimestamp>
      </NotificationHeader>
      
      <NotificationContent>
        <NotificationMessage>
          {notification.message}
        </NotificationMessage>
        
        <StatusChange>
          <StatusItem $status={notification.previousStatus}>
            {getStatusIcon(notification.previousStatus)}
            {getStatusText(notification.previousStatus)}
          </StatusItem>
          
          <ArrowIcon>→</ArrowIcon>
          
          <StatusItem $status={notification.newStatus}>
            {getStatusIcon(notification.newStatus)}
            {getStatusText(notification.newStatus)}
          </StatusItem>
        </StatusChange>
        
        <NotificationDetails>
          <DetailItem>
            <FiMessageSquare size={14} />
            {notification.activityTitle}
          </DetailItem>
          
          <DetailItem>
            <FiUser size={14} />
            {notification.changedByName}
          </DetailItem>
          
          <DetailItem>
            <FiCalendar size={14} />
            {formatDate(notification.timestamp)}
          </DetailItem>
        </NotificationDetails>
      </NotificationContent>
    </NotificationContainer>
  );
};

export default TaskStatusNotification;
