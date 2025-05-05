import React from 'react';
import styled from 'styled-components';
import { 
  FiUser, 
  FiCalendar, 
  FiClock, 
  FiMessageSquare,
  FiFlag
} from 'react-icons/fi';
import { TaskAssignmentNotification } from '@/core/types/models';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TaskAssignmentNotificationProps {
  notification: TaskAssignmentNotification;
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
  border-left: 4px solid ${({ theme }) => theme.warning};

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

const TaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding: 12px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 6px;
`;

const TaskTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Función para formatear la fecha
const formatDate = (timestamp: number) => {
  try {
    return format(new Date(timestamp), "d 'de' MMMM 'a las' HH:mm", { locale: es });
  } catch (error) {
    return 'Fecha desconocida';
  }
};

// Función para formatear la fecha límite
const formatDueDate = (timestamp?: number) => {
  if (!timestamp) return 'Sin fecha límite';
  
  try {
    return format(new Date(timestamp), "d 'de' MMMM 'de' yyyy", { locale: es });
  } catch (error) {
    return 'Fecha desconocida';
  }
};

const TaskAssignmentNotificationComponent: React.FC<TaskAssignmentNotificationProps> = ({ notification, onClick }) => {
  return (
    <NotificationContainer onClick={onClick}>
      <NotificationHeader>
        <NotificationTitle>
          Nueva tarea asignada
        </NotificationTitle>
        <NotificationTimestamp>
          {formatDate(notification.timestamp)}
        </NotificationTimestamp>
      </NotificationHeader>
      
      <NotificationContent>
        <NotificationMessage>
          {notification.message}
        </NotificationMessage>
        
        <TaskInfo>
          <TaskTitle>
            <FiMessageSquare size={16} />
            {notification.activityTitle}
          </TaskTitle>
          
          <NotificationDetails>
            <DetailItem>
              <FiUser size={14} />
              Asignador: {notification.assignerName}
            </DetailItem>
            
            {notification.dueDate && (
              <DetailItem>
                <FiCalendar size={14} />
                Fecha límite: {formatDueDate(notification.dueDate)}
              </DetailItem>
            )}
            
            <DetailItem>
              <FiClock size={14} />
              Asignada: {formatDate(notification.timestamp)}
            </DetailItem>
          </NotificationDetails>
        </TaskInfo>
      </NotificationContent>
    </NotificationContainer>
  );
};

export default TaskAssignmentNotificationComponent;
