import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
  FiBell, 
  FiX, 
  FiCheck, 
  FiTrash2, 
  FiSettings,
  FiClock,
  FiCalendar,
  FiMessageSquare,
  FiUsers,
  FiAlertTriangle,
  FiInfo
} from 'react-icons/fi';
import { useRealTimeNotifications } from '../../../contexts/RealTimeNotificationContext';
import NotificationItem from './NotificationItem';
import MessageQueueStatus from '../WebSocket/MessageQueueStatus';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificationCenterProps {
  onClose: () => void;
  onOpenPreferences: () => void;
}

type NotificationCategory = 'all' | 'tasks' | 'deadlines' | 'announcements' | 'collaboration' | 'system';

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose, onOpenPreferences }) => {
  const { 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    clearNotifications,
    isConnected,
    reconnect,
    queueStatus
  } = useRealTimeNotifications();
  
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Filtrar notificaciones por categoría
  const filteredNotifications = notifications.filter(notification => {
    if (selectedCategory === 'all') return true;
    
    switch (selectedCategory) {
      case 'tasks':
        return notification.type === 'TaskAssignment' || notification.type === 'TaskStatusChange';
      case 'deadlines':
        return notification.type === 'DeadlineReminder';
      case 'announcements':
        return notification.type === 'Announcement';
      case 'collaboration':
        return notification.type === 'Collaboration';
      case 'system':
        return notification.type === 'success' || notification.type === 'error' || 
               notification.type === 'warning' || notification.type === 'info';
      default:
        return true;
    }
  });
  
  // Contar notificaciones por categoría
  const getCategoryCount = (category: NotificationCategory): number => {
    if (category === 'all') return notifications.length;
    
    return notifications.filter(notification => {
      switch (category) {
        case 'tasks':
          return notification.type === 'TaskAssignment' || notification.type === 'TaskStatusChange';
        case 'deadlines':
          return notification.type === 'DeadlineReminder';
        case 'announcements':
          return notification.type === 'Announcement';
        case 'collaboration':
          return notification.type === 'Collaboration';
        case 'system':
          return notification.type === 'success' || notification.type === 'error' || 
                 notification.type === 'warning' || notification.type === 'info';
        default:
          return false;
      }
    }).length;
  };
  
  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Obtener el icono para cada categoría
  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'all':
        return <FiBell />;
      case 'tasks':
        return <FiCheck />;
      case 'deadlines':
        return <FiCalendar />;
      case 'announcements':
        return <FiMessageSquare />;
      case 'collaboration':
        return <FiUsers />;
      case 'system':
        return <FiInfo />;
      default:
        return <FiBell />;
    }
  };
  
  return (
    <Container ref={containerRef}>
      <Header>
        <Title>Notificaciones</Title>
        <Actions>
          <ActionButton onClick={markAllAsRead} title="Marcar todas como leídas">
            <FiCheck size={16} />
          </ActionButton>
          <ActionButton onClick={clearNotifications} title="Borrar todas">
            <FiTrash2 size={16} />
          </ActionButton>
          <ActionButton onClick={onOpenPreferences} title="Preferencias">
            <FiSettings size={16} />
          </ActionButton>
          <CloseButton onClick={onClose}>
            <FiX size={18} />
          </CloseButton>
        </Actions>
      </Header>
      
      <Categories>
        {(['all', 'tasks', 'deadlines', 'announcements', 'collaboration', 'system'] as NotificationCategory[]).map(category => (
          <CategoryButton
            key={category}
            $active={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            <CategoryIcon>
              {getCategoryIcon(category)}
            </CategoryIcon>
            <CategoryName>{getCategoryName(category)}</CategoryName>
            <CategoryCount>{getCategoryCount(category)}</CategoryCount>
          </CategoryButton>
        ))}
      </Categories>
      
      {!isConnected && (
        <ConnectionStatus>
          <FiAlertTriangle size={16} />
          <span>Desconectado del servidor</span>
          <ReconnectButton onClick={reconnect}>
            <FiClock size={14} />
            Reconectar
          </ReconnectButton>
        </ConnectionStatus>
      )}
      
      {queueStatus.size > 0 && (
        <MessageQueueStatus showDetails={true} />
      )}
      
      <Content>
        {filteredNotifications.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FiBell size={32} />
            </EmptyIcon>
            <EmptyText>No hay notificaciones</EmptyText>
            <EmptySubtext>Las notificaciones aparecerán aquí</EmptySubtext>
          </EmptyState>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => {}}
            />
          ))
        )}
      </Content>
    </Container>
  );
};

// Función para obtener el nombre de la categoría
const getCategoryName = (category: NotificationCategory): string => {
  switch (category) {
    case 'all':
      return 'Todas';
    case 'tasks':
      return 'Tareas';
    case 'deadlines':
      return 'Fechas límite';
    case 'announcements':
      return 'Anuncios';
    case 'collaboration':
      return 'Colaboración';
    case 'system':
      return 'Sistema';
    default:
      return 'Desconocido';
  }
};

// Estilos
const Container = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  width: 380px;
  max-height: 80vh;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  
  @media (max-width: 480px) {
    width: 100%;
    right: 0;
    top: 56px;
    max-height: calc(100vh - 56px);
    border-radius: 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: ${({ theme }) => theme.textSecondary};
  
  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const CloseButton = styled(ActionButton)``;

const Categories = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 8px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border};
    border-radius: 4px;
  }
`;

const CategoryButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  background-color: ${({ $active, theme }) => $active ? theme.primaryLight : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.primary : theme.textSecondary};
  font-weight: ${({ $active }) => $active ? '500' : 'normal'};
  
  &:hover {
    background-color: ${({ $active, theme }) => $active ? theme.primaryLight : theme.backgroundHover};
  }
  
  & + & {
    margin-left: 8px;
  }
`;

const CategoryIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

const CategoryName = styled.span``;

const CategoryCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 11px;
  margin-left: 8px;
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.errorLight};
  color: ${({ theme }) => theme.error};
  font-size: 13px;
  
  svg {
    margin-right: 8px;
  }
`;

const ReconnectButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: ${({ theme }) => theme.error};
  color: white;
  
  &:hover {
    background-color: ${({ theme }) => theme.errorDark};
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border};
    border-radius: 3px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.backgroundAlt};
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 16px;
`;

const EmptyText = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
`;

const EmptySubtext = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0;
`;

export default NotificationCenter;
