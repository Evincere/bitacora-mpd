import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FiBell, FiX, FiCheck, FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiClock, FiSettings } from 'react-icons/fi';
import { useRealTimeNotifications } from '../../../contexts/RealTimeNotificationContext';
import NotificationItem from './NotificationItem';
import NotificationCategories from './NotificationCategories';
import NotificationPreferences from './NotificationPreferences';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Animaciones
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Contenedor principal
const NotificationCenterContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// Botón de notificaciones
const NotificationButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 20px;
  cursor: pointer;
  position: relative;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover, &:focus {
    background-color: ${({ theme }) => theme.backgroundHover};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary};
  }
`;

// Indicador de notificaciones no leídas
const UnreadBadge = styled.span<{ $count: number }>`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${({ theme }) => theme.error};
  color: white;
  border-radius: 50%;
  min-width: ${({ $count }) => $count > 9 ? '20px' : '16px'};
  height: 16px;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
`;

// Panel de notificaciones
const NotificationPanel = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 350px;
  max-height: 500px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  animation: ${fadeIn} 0.2s ease-in-out;
  margin-top: 8px;

  @media (max-width: 480px) {
    width: 300px;
    right: -100px;
  }
`;

// Encabezado del panel
const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

// Título del panel
const PanelTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

// Acciones del panel
const PanelActions = styled.div`
  display: flex;
  gap: 8px;
`;

// Botón de acción
const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover, &:focus {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary};
  }
`;

// Contenido del panel
const PanelContent = styled.div`
  overflow-y: auto;
  flex: 1;

  /* Estilizar la barra de desplazamiento */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border};
    border-radius: 3px;
  }
`;

// Lista de notificaciones
const NotificationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;



// Mensaje cuando no hay notificaciones
const EmptyState = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};

  svg {
    font-size: 32px;
    margin-bottom: 8px;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

// Indicador de estado de conexión
const ConnectionStatus = styled.div<{ $connected: boolean }>`
  padding: 8px 16px;
  font-size: 12px;
  text-align: center;
  background-color: ${({ $connected, theme }) =>
    $connected ? theme.backgroundSuccess : theme.backgroundError};
  color: ${({ $connected, theme }) =>
    $connected ? theme.success : theme.error};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

// Componente principal
const RealTimeNotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [filteredNotifications, setFilteredNotifications] = useState<RealTimeNotification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Obtener datos y funciones del contexto
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    isConnected,
    reconnect
  } = useRealTimeNotifications();

  // Inicializar las notificaciones filtradas
  useEffect(() => {
    setFilteredNotifications(notifications);
  }, [notifications]);

  // Cerrar el panel al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowPreferences(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Alternar el panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowPreferences(false);
    }
  };

  // Manejar clic en una notificación
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  // Manejar cambio de categoría
  const handleCategoryChange = (filtered: RealTimeNotification[]) => {
    setFilteredNotifications(filtered);
  };

  // Alternar panel de preferencias
  const togglePreferences = () => {
    setShowPreferences(!showPreferences);
  };

  // Guardar preferencias
  const handleSavePreferences = (preferences: any) => {
    // Aquí se implementaría la lógica para guardar las preferencias
    console.log('Preferencias guardadas:', preferences);
  };



  return (
    <NotificationCenterContainer>
      <NotificationButton
        ref={buttonRef}
        onClick={togglePanel}
        aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} no leídas)` : ''}`}
        aria-expanded={isOpen}
        aria-controls="notification-panel"
      >
        <FiBell />
        {unreadCount > 0 && <UnreadBadge $count={unreadCount}>{unreadCount}</UnreadBadge>}
      </NotificationButton>

      <NotificationPanel
        $isOpen={isOpen}
        ref={panelRef}
        id="notification-panel"
        role="region"
        aria-label="Panel de notificaciones"
      >
        <PanelHeader>
          <PanelTitle>Notificaciones</PanelTitle>
          <PanelActions>
            <ActionButton onClick={markAllAsRead} aria-label="Marcar todas como leídas">
              <FiCheck size={14} />
              <span>Marcar como leídas</span>
            </ActionButton>
            <ActionButton onClick={clearNotifications} aria-label="Limpiar todas">
              <FiX size={14} />
              <span>Limpiar</span>
            </ActionButton>
            <ActionButton onClick={togglePreferences} aria-label="Preferencias">
              <FiSettings size={14} />
              <span>Preferencias</span>
            </ActionButton>
          </PanelActions>
        </PanelHeader>

        <ConnectionStatus $connected={isConnected}>
          {isConnected ? (
            <>
              <FiCheckCircle size={14} />
              <span>Conectado en tiempo real</span>
            </>
          ) : (
            <>
              <FiAlertCircle size={14} />
              <span>Desconectado</span>
              <ActionButton onClick={reconnect} aria-label="Reconectar">
                Reconectar
              </ActionButton>
            </>
          )}
        </ConnectionStatus>

        {showPreferences ? (
          <NotificationPreferences
            onClose={togglePreferences}
            onSave={handleSavePreferences}
          />
        ) : (
          <>
            <NotificationCategories
              notifications={notifications}
              onCategoryChange={handleCategoryChange}
            />

            <PanelContent>
              {filteredNotifications.length === 0 ? (
                <EmptyState>
                  <FiBell />
                  <p>{notifications.length === 0 ? 'No tienes notificaciones' : 'No hay notificaciones en esta categoría'}</p>
                </EmptyState>
              ) : (
                <NotificationList>
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onClick={() => handleNotificationClick(notification.id)}
                    />
                  ))}
                </NotificationList>
              )}
            </PanelContent>
          </>
        )}
      </NotificationPanel>
    </NotificationCenterContainer>
  );
};

export default RealTimeNotificationCenter;
