import React, { useState } from 'react';
import styled from 'styled-components';
import { FiBell } from 'react-icons/fi';
import NotificacionesPanel from './NotificacionesPanel';
import { useRealTimeNotifications } from '@/features/notifications/contexts/RealTimeNotificationContext';

const ButtonContainer = styled.div`
  position: relative;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${({ theme }) => theme.error};
  color: white;
  font-size: 10px;
  font-weight: 600;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

interface NotificacionesButtonProps {
  // Puedes añadir props si es necesario
}

const NotificacionesButton: React.FC<NotificacionesButtonProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Usar el contexto de notificaciones reales
  const { unreadCount } = useRealTimeNotifications();

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ButtonContainer>
        <IconButton onClick={togglePanel}>
          <FiBell size={20} />
          {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
        </IconButton>
      </ButtonContainer>

      <Backdrop $isOpen={isOpen} onClick={closePanel} />
      <NotificacionesPanel isOpen={isOpen} onClose={closePanel} />
    </>
  );
};

export default NotificacionesButton;
