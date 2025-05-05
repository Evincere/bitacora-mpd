import React from 'react';
import styled from 'styled-components';
import { RealTimeNotification } from '@/core/types/models';
import TaskStatusNotification from './TaskStatusNotification';
import TaskAssignmentNotification from './TaskAssignmentNotification';
import DeadlineReminderNotification from './DeadlineReminderNotification';
import { FiBell, FiInfo } from 'react-icons/fi';

interface EnhancedNotificationListProps {
  notifications: RealTimeNotification[];
  onNotificationClick: (id: string) => void;
}

const NotificationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
  padding: 8px 4px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.backgroundAlt};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.textSecondary};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
  
  svg {
    font-size: 32px;
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 16px;
  }
  
  p {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 14px;
    margin: 0;
  }
`;

const GenericNotification = styled.div<{ $read: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid ${({ theme }) => theme.info};
  opacity: ${({ $read }) => ($read ? 0.7 : 1)};

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

const NotificationMessage = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  margin: 0;
  line-height: 1.5;
`;

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const EnhancedNotificationList: React.FC<EnhancedNotificationListProps> = ({ 
  notifications, 
  onNotificationClick 
}) => {
  if (notifications.length === 0) {
    return (
      <EmptyState>
        <FiBell />
        <p>No tienes notificaciones</p>
      </EmptyState>
    );
  }

  return (
    <NotificationListContainer>
      {notifications.map(notification => {
        // Determinar el tipo de notificación y renderizar el componente adecuado
        if (notification.notificationClass === 'TaskStatusChange') {
          return (
            <TaskStatusNotification
              key={notification.id}
              notification={notification as any}
              onClick={() => onNotificationClick(notification.id)}
            />
          );
        }
        
        if (notification.notificationClass === 'TaskAssignment') {
          return (
            <TaskAssignmentNotification
              key={notification.id}
              notification={notification as any}
              onClick={() => onNotificationClick(notification.id)}
            />
          );
        }
        
        if (notification.notificationClass === 'DeadlineReminder') {
          return (
            <DeadlineReminderNotification
              key={notification.id}
              notification={notification as any}
              onClick={() => onNotificationClick(notification.id)}
            />
          );
        }
        
        // Notificación genérica para otros tipos
        return (
          <GenericNotification 
            key={notification.id}
            $read={notification.read || false}
            onClick={() => onNotificationClick(notification.id)}
          >
            <NotificationHeader>
              <NotificationTitle>
                <FiInfo size={16} style={{ marginRight: '8px' }} />
                {notification.title}
              </NotificationTitle>
              <NotificationTimestamp>
                {formatDate(notification.timestamp)}
              </NotificationTimestamp>
            </NotificationHeader>
            <NotificationMessage>
              {notification.message}
            </NotificationMessage>
          </GenericNotification>
        );
      })}
    </NotificationListContainer>
  );
};

export default EnhancedNotificationList;
