import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FiBell,
  FiX,
  FiCheck,
  FiClock,
  FiCalendar,
  FiMessageSquare,
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
  FiFilter,
  FiSettings,
  FiTrash2,
  FiEye
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRealTimeNotifications } from '@/features/notifications/contexts/RealTimeNotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Mapeo de tipos de notificaciones del backend a tipos locales
const mapTipoNotificacion = (tipo: string) => {
  switch (tipo) {
    case 'TASK_ASSIGNMENT':
      return 'ASIGNACION';
    case 'TASK_STATUS_CHANGE':
      return 'CAMBIO_ESTADO';
    case 'DEADLINE_REMINDER':
      return 'FECHA_LIMITE';
    case 'COLLABORATION':
    case 'MENTION':
      return 'COMENTARIO';
    case 'ANNOUNCEMENT':
    case 'SYSTEM':
    case 'ERROR':
    case 'SUCCESS':
    case 'INFO':
    case 'WARNING':
      return 'SISTEMA';
    default:
      return 'SISTEMA';
  }
};

const PanelContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${({ $isOpen }) => ($isOpen ? '0' : '-400px')};
  width: 380px;
  height: 100vh;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  box-shadow: ${({ theme }) => theme.shadow};
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const PanelHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const FiltersContainer = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.backgroundAlt};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border};
    border-radius: 4px;
  }
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $active, theme }) =>
    $active
      ? `
        background-color: ${theme.primary};
        color: white;
        border: none;
      `
      : `
        background-color: ${theme.backgroundAlt};
        color: ${theme.textSecondary};
        border: 1px solid ${theme.border};

        &:hover {
          background-color: ${theme.backgroundHover};
        }
      `
  }
`;

const NotificacionesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.backgroundAlt};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border};
    border-radius: 4px;
  }
`;

const NotificacionItem = styled.div<{ $leida: boolean }>`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.borderLight};
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  ${({ $leida, theme }) => !$leida && `
    background-color: ${theme.backgroundAlt};

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: ${theme.primary};
    }
  `}

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const NotificacionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const NotificacionTipo = styled.div<{ $tipo: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;

  ${({ $tipo, theme }) => {
    switch ($tipo) {
      case 'ASIGNACION':
        return `color: ${theme.primary};`;
      case 'CAMBIO_ESTADO':
        return `color: ${theme.success};`;
      case 'FECHA_LIMITE':
        return `color: ${theme.warning};`;
      case 'COMENTARIO':
        return `color: ${theme.info};`;
      case 'SISTEMA':
        return `color: ${theme.textSecondary};`;
      default:
        return `color: ${theme.textSecondary};`;
    }
  }}
`;

const NotificacionFecha = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.textSecondary};
`;

const NotificacionTitulo = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 4px;
`;

const NotificacionMensaje = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
`;

const NotificacionAcciones = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const AccionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 12px;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const PanelFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
`;

const FooterButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};

  svg {
    margin-bottom: 16px;
    color: ${({ theme }) => theme.textSecondary};
  }

  h3 {
    margin: 0 0 8px;
    font-size: 16px;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
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

interface NotificacionesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificacionesPanel: React.FC<NotificacionesPanelProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [filtroActivo, setFiltroActivo] = useState('TODAS');

  // Usar el contexto de notificaciones reales
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useRealTimeNotifications();

  // Adaptar las notificaciones del contexto al formato esperado por el componente
  const adaptarNotificaciones = () => {
    return notifications.map(notification => ({
      id: notification.id,
      tipo: mapTipoNotificacion(notification.type),
      titulo: notification.title,
      mensaje: notification.message,
      fecha: notification.createdAt,
      leida: notification.read,
      entidadId: notification.link ? parseInt(notification.link.split('/').pop() || '0') : null,
      entidadTipo: notification.link?.includes('tareas') ? 'TAREA' : 'OTRO',
      datos: {}
    }));
  };

  const notificaciones = adaptarNotificaciones();

  const filteredNotificaciones = notificaciones.filter(notificacion => {
    if (filtroActivo === 'TODAS') return true;
    if (filtroActivo === 'NO_LEIDAS') return !notificacion.leida;
    return notificacion.tipo === filtroActivo;
  });

  const handleMarcarLeida = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    markAsRead(id);
    toast.success('Notificación marcada como leída');
  };

  const handleEliminar = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // No hay una función para eliminar notificaciones en el contexto,
    // pero podríamos marcarla como leída para que no aparezca en el contador
    markAsRead(id);
    toast.success('Notificación eliminada');
  };

  const handleVerDetalle = (notificacion: any) => {
    // Navegar a la entidad relacionada
    if (notificacion.entidadTipo === 'TAREA' && notificacion.entidadId) {
      navigate(`/app/tareas/detalle/${notificacion.entidadId}`);
      onClose();
    }

    // Marcar como leída
    if (!notificacion.leida) {
      markAsRead(notificacion.id);
    }
  };

  const handleMarcarTodasLeidas = () => {
    markAllAsRead();
    toast.success('Todas las notificaciones marcadas como leídas');
  };

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'ASIGNACION':
        return <FiCheck size={14} />;
      case 'CAMBIO_ESTADO':
        return <FiInfo size={14} />;
      case 'FECHA_LIMITE':
        return <FiClock size={14} />;
      case 'COMENTARIO':
        return <FiMessageSquare size={14} />;
      case 'SISTEMA':
        return <FiAlertCircle size={14} />;
      default:
        return <FiBell size={14} />;
    }
  };

  const getTextoTipo = (tipo: string) => {
    switch (tipo) {
      case 'ASIGNACION':
        return 'Asignación';
      case 'CAMBIO_ESTADO':
        return 'Cambio de estado';
      case 'FECHA_LIMITE':
        return 'Fecha límite';
      case 'COMENTARIO':
        return 'Comentario';
      case 'SISTEMA':
        return 'Sistema';
      default:
        return tipo;
    }
  };

  // Formatear fecha relativa usando date-fns
  const formatearFechaRelativa = (fechaStr: string) => {
    try {
      const fecha = new Date(fechaStr);

      // Verificar si la fecha es válida
      if (isNaN(fecha.getTime())) {
        return 'Fecha desconocida';
      }

      return formatDistanceToNow(fecha, {
        addSuffix: true,
        locale: es
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha desconocida';
    }
  };

  return (
    <PanelContainer $isOpen={isOpen}>
      <PanelHeader>
        <PanelTitle>
          <FiBell size={18} />
          Notificaciones
          {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
        </PanelTitle>
        <CloseButton onClick={onClose}>
          <FiX size={20} />
        </CloseButton>
      </PanelHeader>

      <FiltersContainer>
        <FilterButton
          $active={filtroActivo === 'TODAS'}
          onClick={() => setFiltroActivo('TODAS')}
        >
          Todas
        </FilterButton>
        <FilterButton
          $active={filtroActivo === 'NO_LEIDAS'}
          onClick={() => setFiltroActivo('NO_LEIDAS')}
        >
          No leídas
        </FilterButton>
        <FilterButton
          $active={filtroActivo === 'ASIGNACION'}
          onClick={() => setFiltroActivo('ASIGNACION')}
        >
          Asignaciones
        </FilterButton>
        <FilterButton
          $active={filtroActivo === 'CAMBIO_ESTADO'}
          onClick={() => setFiltroActivo('CAMBIO_ESTADO')}
        >
          Cambios de estado
        </FilterButton>
        <FilterButton
          $active={filtroActivo === 'FECHA_LIMITE'}
          onClick={() => setFiltroActivo('FECHA_LIMITE')}
        >
          Fechas límite
        </FilterButton>
        <FilterButton
          $active={filtroActivo === 'COMENTARIO'}
          onClick={() => setFiltroActivo('COMENTARIO')}
        >
          Comentarios
        </FilterButton>
        <FilterButton
          $active={filtroActivo === 'SISTEMA'}
          onClick={() => setFiltroActivo('SISTEMA')}
        >
          Sistema
        </FilterButton>
      </FiltersContainer>

      <NotificacionesList>
        {filteredNotificaciones.length > 0 ? (
          filteredNotificaciones.map((notificacion) => (
            <NotificacionItem
              key={notificacion.id}
              $leida={notificacion.leida}
              onClick={() => handleVerDetalle(notificacion)}
            >
              <NotificacionHeader>
                <NotificacionTipo $tipo={notificacion.tipo}>
                  {getIconoTipo(notificacion.tipo)}
                  {getTextoTipo(notificacion.tipo)}
                </NotificacionTipo>
                <NotificacionFecha>
                  {formatearFechaRelativa(notificacion.fecha)}
                </NotificacionFecha>
              </NotificacionHeader>
              <NotificacionTitulo>{notificacion.titulo}</NotificacionTitulo>
              <NotificacionMensaje>{notificacion.mensaje}</NotificacionMensaje>
              <NotificacionAcciones>
                {!notificacion.leida && (
                  <AccionButton onClick={(e) => handleMarcarLeida(notificacion.id, e)}>
                    <FiCheckCircle size={14} />
                    Marcar como leída
                  </AccionButton>
                )}
                <AccionButton onClick={(e) => handleEliminar(notificacion.id, e)}>
                  <FiTrash2 size={14} />
                  Eliminar
                </AccionButton>
                {notificacion.entidadId && (
                  <AccionButton onClick={(e) => {
                    e.stopPropagation();
                    handleVerDetalle(notificacion);
                  }}>
                    <FiEye size={14} />
                    Ver detalle
                  </AccionButton>
                )}
              </NotificacionAcciones>
            </NotificacionItem>
          ))
        ) : (
          <EmptyState>
            <FiBell size={40} />
            <h3>No hay notificaciones</h3>
            <p>No tienes notificaciones que coincidan con los filtros seleccionados.</p>
          </EmptyState>
        )}
      </NotificacionesList>

      <PanelFooter>
        <FooterButton onClick={handleMarcarTodasLeidas}>
          <FiCheck size={14} />
          Marcar todas como leídas
        </FooterButton>
        <FooterButton onClick={() => navigate('/app/configuracion/notificaciones')}>
          <FiSettings size={14} />
          Configuración
        </FooterButton>
      </PanelFooter>
    </PanelContainer>
  );
};

export default NotificacionesPanel;
