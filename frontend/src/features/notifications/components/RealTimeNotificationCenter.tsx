import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiBell, FiX, FiCheck, FiCheckCircle, FiAlertCircle, FiInfo, FiCalendar } from 'react-icons/fi';
import { useRealTimeNotifications } from '../contexts/RealTimeNotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedNotificationList from './EnhancedNotificationList';

const NotificationIconContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${({ theme }) => theme.error};
  color: white;
  font-size: 10px;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.backgroundPrimary};
`;

const NotificationPanel = styled(motion.div)`
  position: absolute;
  top: 50px;
  right: 0;
  width: 320px;
  max-height: 500px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const NotificationTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const NotificationList = styled.div`
  overflow-y: auto;
  max-height: 400px;
  flex: 1;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.textTertiary};
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: 14px;
`;

const NotificationItem = styled.div<{ read: boolean }>`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ read, theme }) => read ? 'transparent' : theme.backgroundTertiary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
`;

const NotificationItemTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const NotificationItemTime = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textTertiary};
  white-space: nowrap;
  margin-left: 8px;
`;

const NotificationItemContent = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 4px;
`;

const NotificationItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NotificationItemType = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.textTertiary};
`;

const NotificationItemAction = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundTertiary};
  }
`;

const NotificationFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const MarkAllReadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  font-size: 13px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundTertiary};
  }

  &:disabled {
    color: ${({ theme }) => theme.textTertiary};
    cursor: not-allowed;
  }
`;

const ConnectionStatus = styled.div<{ connected: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  padding: 8px 16px;
  background-color: ${({ connected, theme }) =>
    connected ? theme.successLight || '#e6f7e6' : theme.errorLight || '#ffe6e6'};
  color: ${({ connected, theme }) =>
    connected ? theme.success : theme.error};
`;

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'ASSIGNMENT':
      return <FiCalendar size={14} />;
    case 'REMINDER':
      return <FiInfo size={14} />;
    case 'SUCCESS':
      return <FiCheckCircle size={14} />;
    case 'ERROR':
      return <FiAlertCircle size={14} />;
    default:
      return <FiInfo size={14} />;
  }
};

const RealTimeNotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, connected } = useRealTimeNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  // Cerrar el panel al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Manejar clic en el icono de notificaciones
  const handleTogglePanel = () => {
    setIsOpen(!isOpen);
  };

  // Manejar clic en una notificación
  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);

    if (link) {
      // Navegar al enlace
      window.location.href = link;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <NotificationIconContainer onClick={handleTogglePanel}>
        <FiBell size={20} />
        {unreadCount > 0 && (
          <NotificationBadge>
            {unreadCount > 9 ? '9+' : unreadCount}
          </NotificationBadge>
        )}
      </NotificationIconContainer>

      <AnimatePresence>
        {isOpen && (
          <NotificationPanel
            ref={panelRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <NotificationHeader>
              <NotificationTitle>Notificaciones</NotificationTitle>
              <NotificationItemAction onClick={() => setIsOpen(false)}>
                <FiX size={18} />
              </NotificationItemAction>
            </NotificationHeader>

            <ConnectionStatus connected={connected}>
              {connected ? (
                <>
                  <FiCheckCircle size={14} />
                  <span>Conectado al servidor de notificaciones</span>
                </>
              ) : (
                <>
                  <FiAlertCircle size={14} />
                  <span>Sin conexión al servidor de notificaciones</span>
                </>
              )}
            </ConnectionStatus>

            <NotificationList>
              <EnhancedNotificationList
                notifications={notifications}
                onNotificationClick={handleNotificationClick}
              />
            </NotificationList>

            {notifications.length > 0 && (
              <NotificationFooter>
                <MarkAllReadButton
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <FiCheck size={14} />
                  Marcar todas como leídas
                </MarkAllReadButton>
              </NotificationFooter>
            )}
          </NotificationPanel>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RealTimeNotificationCenter;
