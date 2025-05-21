import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiAlertTriangle, 
  FiClock, 
  FiCheck, 
  FiX,
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiRefreshCw
} from 'react-icons/fi';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  SecurityAlertNotification, 
  SecurityAlertType, 
  SecurityAlertSeverity 
} from '../types/securityAlertTypes';

// Estilos
const Container = styled.div`
  position: relative;
`;

const NotificationButton = styled.button<{ $hasUnread: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
  
  ${({ $hasUnread }) => $hasUnread && `
    &::after {
      content: '';
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background-color: #ef4444;
      border-radius: 50%;
    }
  `}
`;

const NotificationsPanel = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 350px;
  max-height: 500px;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  display: ${({ $show }) => ($show ? 'flex' : 'none')};
  flex-direction: column;
  margin-top: 8px;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const PanelTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PanelActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const NotificationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.backgroundSecondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.textTertiary};
  }
`;

const NotificationItem = styled.div<{ $unread: boolean }>`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme, $unread }) => 
    $unread ? theme.backgroundSecondary : theme.cardBackground};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const NotificationIcon = styled.div<{ $severity: SecurityAlertSeverity }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ $severity }) => 
    $severity === SecurityAlertSeverity.CRITICAL ? '#ef4444' + '20' :
    $severity === SecurityAlertSeverity.HIGH ? '#f97316' + '20' :
    $severity === SecurityAlertSeverity.MEDIUM ? '#f59e0b' + '20' :
    $severity === SecurityAlertSeverity.LOW ? '#10b981' + '20' :
    '#94a3b8' + '20'};
  color: ${({ $severity }) => 
    $severity === SecurityAlertSeverity.CRITICAL ? '#ef4444' :
    $severity === SecurityAlertSeverity.HIGH ? '#f97316' :
    $severity === SecurityAlertSeverity.MEDIUM ? '#f59e0b' :
    $severity === SecurityAlertSeverity.LOW ? '#10b981' :
    '#94a3b8'};
`;

const NotificationContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NotificationTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const NotificationTime = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const NotificationActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MarkAsReadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const PanelFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: transparent;
  color: ${({ theme }) => theme.primary};
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const LoadingSpinner = styled(FiRefreshCw)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

interface SecurityAlertNotificationsProps {
  onViewAlert: (alertId: string) => void;
  onViewAllAlerts: () => void;
}

/**
 * Componente para mostrar notificaciones de alertas de seguridad
 */
const SecurityAlertNotifications: React.FC<SecurityAlertNotificationsProps> = ({
  onViewAlert,
  onViewAllAlerts
}) => {
  // Estado para mostrar/ocultar el panel
  const [showPanel, setShowPanel] = useState(false);
  
  // Estado para las notificaciones
  const [notifications, setNotifications] = useState<SecurityAlertNotification[]>([]);
  
  // Estado para carga
  const [isLoading, setIsLoading] = useState(false);
  
  // Efecto para cargar notificaciones
  useEffect(() => {
    // Simulación de carga de notificaciones
    const loadNotifications = () => {
      setIsLoading(true);
      
      // Simulación de delay
      setTimeout(() => {
        // Datos de ejemplo
        const mockNotifications: SecurityAlertNotification[] = [
          {
            id: '1',
            alertId: '1',
            alertType: SecurityAlertType.FAILED_LOGIN,
            alertSeverity: SecurityAlertSeverity.HIGH,
            message: 'Múltiples intentos fallidos de inicio de sesión',
            timestamp: new Date().toISOString(),
            read: false
          },
          {
            id: '2',
            alertId: '2',
            alertType: SecurityAlertType.UNUSUAL_ACCESS_TIME,
            alertSeverity: SecurityAlertSeverity.MEDIUM,
            message: 'Acceso en horario inusual',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            read: false
          },
          {
            id: '3',
            alertId: '3',
            alertType: SecurityAlertType.UNUSUAL_LOCATION,
            alertSeverity: SecurityAlertSeverity.HIGH,
            message: 'Acceso desde ubicación inusual',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            read: true
          },
          {
            id: '4',
            alertId: '4',
            alertType: SecurityAlertType.PERMISSION_CHANGE,
            alertSeverity: SecurityAlertSeverity.HIGH,
            message: 'Cambio de permisos críticos',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            read: true
          },
          {
            id: '5',
            alertId: '5',
            alertType: SecurityAlertType.MASS_DELETION,
            alertSeverity: SecurityAlertSeverity.CRITICAL,
            message: 'Eliminación masiva de registros',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            read: false
          }
        ];
        
        setNotifications(mockNotifications);
        setIsLoading(false);
      }, 1000);
    };
    
    if (showPanel) {
      loadNotifications();
    }
  }, [showPanel]);
  
  // Función para alternar el panel
  const togglePanel = () => {
    setShowPanel(!showPanel);
  };
  
  // Función para marcar una notificación como leída
  const markAsRead = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Función para marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Función para refrescar las notificaciones
  const refreshNotifications = () => {
    setIsLoading(true);
    
    // Simulación de delay
    setTimeout(() => {
      // Actualizar con nuevas notificaciones
      setIsLoading(false);
    }, 1000);
  };
  
  // Función para formatear tiempo relativo
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: es
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };
  
  // Verificar si hay notificaciones no leídas
  const hasUnreadNotifications = notifications.some(notification => !notification.read);
  
  // Cerrar el panel al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notifications-panel') && !target.closest('.notifications-button')) {
        setShowPanel(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <Container>
      <NotificationButton 
        $hasUnread={hasUnreadNotifications}
        onClick={togglePanel}
        className="notifications-button"
        title="Notificaciones de seguridad"
      >
        <FiAlertTriangle size={20} />
      </NotificationButton>
      
      <NotificationsPanel $show={showPanel} className="notifications-panel">
        <PanelHeader>
          <PanelTitle>
            <FiAlertTriangle size={16} />
            Alertas de Seguridad
          </PanelTitle>
          
          <PanelActions>
            <ActionButton 
              onClick={refreshNotifications}
              title="Refrescar"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size={16} />
              ) : (
                <FiRefreshCw size={16} />
              )}
            </ActionButton>
            <ActionButton 
              onClick={markAllAsRead}
              title="Marcar todas como leídas"
              disabled={!hasUnreadNotifications}
            >
              <FiCheck size={16} />
            </ActionButton>
            <ActionButton 
              onClick={() => setShowPanel(false)}
              title="Cerrar"
            >
              <FiX size={16} />
            </ActionButton>
          </PanelActions>
        </PanelHeader>
        
        <NotificationsList>
          {isLoading ? (
            <EmptyState>
              <LoadingSpinner size={24} style={{ marginBottom: '8px' }} />
              <div>Cargando notificaciones...</div>
            </EmptyState>
          ) : notifications.length === 0 ? (
            <EmptyState>
              <FiCheck size={24} style={{ marginBottom: '8px' }} />
              <div>No hay notificaciones</div>
            </EmptyState>
          ) : (
            notifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                $unread={!notification.read}
                onClick={() => {
                  onViewAlert(notification.alertId);
                  setShowPanel(false);
                  
                  // Marcar como leída al hacer clic
                  if (!notification.read) {
                    setNotifications(prev => 
                      prev.map(n => 
                        n.id === notification.id 
                          ? { ...n, read: true } 
                          : n
                      )
                    );
                  }
                }}
              >
                <NotificationIcon $severity={notification.alertSeverity}>
                  <FiAlertTriangle size={20} />
                </NotificationIcon>
                
                <NotificationContent>
                  <NotificationTitle>{notification.message}</NotificationTitle>
                  <NotificationTime>{formatRelativeTime(notification.timestamp)}</NotificationTime>
                </NotificationContent>
                
                {!notification.read && (
                  <NotificationActions>
                    <MarkAsReadButton 
                      onClick={(e) => markAsRead(notification.id, e)}
                      title="Marcar como leída"
                    >
                      <FiCheck size={14} />
                    </MarkAsReadButton>
                  </NotificationActions>
                )}
              </NotificationItem>
            ))
          )}
        </NotificationsList>
        
        <PanelFooter>
          <ViewAllButton onClick={() => {
            onViewAllAlerts();
            setShowPanel(false);
          }}>
            Ver todas las alertas
            <FiChevronRight size={14} />
          </ViewAllButton>
        </PanelFooter>
      </NotificationsPanel>
    </Container>
  );
};

export default SecurityAlertNotifications;
