import React from 'react';
import styled from 'styled-components';
import { 
  FiCalendar, 
  FiClock, 
  FiAlertTriangle, 
  FiMessageSquare
} from 'react-icons/fi';
import { DeadlineReminderNotification } from '@/core/types/models';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DeadlineReminderNotificationProps {
  notification: DeadlineReminderNotification;
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
  border-left: 4px solid ${({ theme }) => theme.error};

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
  display: flex;
  align-items: center;
  gap: 8px;
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

const DeadlineInfo = styled.div<{ $urgent: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding: 12px;
  background-color: ${({ $urgent, theme }) => 
    $urgent ? `${theme.error}15` : theme.backgroundAlt};
  border-radius: 6px;
  border: 1px solid ${({ $urgent, theme }) => 
    $urgent ? `${theme.error}30` : theme.border};
`;

const TimeRemaining = styled.div<{ $urgent: boolean }>`
  font-weight: 600;
  font-size: 16px;
  color: ${({ $urgent, theme }) => 
    $urgent ? theme.error : theme.text};
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

// Función para formatear horas restantes
const formatHoursRemaining = (hours: number) => {
  if (hours <= 0) {
    return 'Vencida';
  }
  
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} minutos restantes`;
  }
  
  if (hours < 24) {
    return `${Math.round(hours)} horas restantes`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  
  if (remainingHours === 0) {
    return `${days} día${days !== 1 ? 's' : ''} restantes`;
  }
  
  return `${days} día${days !== 1 ? 's' : ''} y ${remainingHours} hora${remainingHours !== 1 ? 's' : ''} restantes`;
};

const DeadlineReminderNotificationComponent: React.FC<DeadlineReminderNotificationProps> = ({ notification, onClick }) => {
  const isUrgent = notification.hoursRemaining <= 4;
  
  return (
    <NotificationContainer onClick={onClick}>
      <NotificationHeader>
        <NotificationTitle>
          <FiAlertTriangle size={16} color={isUrgent ? '#ef4444' : '#f59e0b'} />
          Recordatorio de fecha límite
        </NotificationTitle>
        <NotificationTimestamp>
          {formatDate(notification.timestamp)}
        </NotificationTimestamp>
      </NotificationHeader>
      
      <NotificationContent>
        <NotificationMessage>
          {notification.message}
        </NotificationMessage>
        
        <DeadlineInfo $urgent={isUrgent}>
          <TimeRemaining $urgent={isUrgent}>
            <FiClock size={16} />
            {formatHoursRemaining(notification.hoursRemaining)}
          </TimeRemaining>
          
          <NotificationDetails>
            <DetailItem>
              <FiMessageSquare size={14} />
              {notification.activityTitle}
            </DetailItem>
            
            <DetailItem>
              <FiCalendar size={14} />
              Vence: {formatDate(notification.dueDate)}
            </DetailItem>
          </NotificationDetails>
        </DeadlineInfo>
      </NotificationContent>
    </NotificationContainer>
  );
};

export default DeadlineReminderNotificationComponent;
