import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiTrash2,
  FiX,
  FiAlertCircle,
  FiCheck,
  FiSearch,
  FiRefreshCw,
  FiClock,
  FiMapPin,
  FiMonitor,
  FiCalendar,
  FiActivity,
  FiShield
} from 'react-icons/fi';
import { useSessions } from '../../hooks/useSessions';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../hooks/useConfirm';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import VirtualList from '../../components/common/VirtualList';
import Skeleton from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';

// Componentes estilizados
const PageContainer = styled.div`
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary, $danger }) =>
    $primary ? theme.primary : $danger ? theme.danger : theme.cardBackground};
  color: ${({ theme, $primary, $danger }) =>
    $primary || $danger ? theme.buttonText : theme.textPrimary};
  border: 1px solid ${({ theme, $primary, $danger }) =>
    $primary ? theme.primary : $danger ? theme.danger : theme.borderColor};

  &:hover {
    background-color: ${({ theme, $primary, $danger }) =>
      $primary ? theme.primaryHover : $danger ? theme.dangerHover : theme.backgroundHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px 10px 40px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryLight};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textSecondary};
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};

  th {
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: ${({ theme }) => theme.textSecondary};
    font-size: 14px;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${({ theme }) => theme.backgroundHover};
    }

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 16px;
    color: ${({ theme }) => theme.textPrimary};
    font-size: 14px;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ theme, $status }) => {
    switch ($status) {
      case 'ACTIVE':
        return theme.successLight;
      case 'EXPIRED':
        return theme.warningLight;
      case 'REVOKED':
        return theme.dangerLight;
      case 'LOGGED_OUT':
        return theme.infoLight;
      default:
        return theme.backgroundAlt;
    }
  }};
  color: ${({ theme, $status }) => {
    switch ($status) {
      case 'ACTIVE':
        return theme.success;
      case 'EXPIRED':
        return theme.warning;
      case 'REVOKED':
        return theme.danger;
      case 'LOGGED_OUT':
        return theme.info;
      default:
        return theme.textSecondary;
    }
  }};
`;

const DeviceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DeviceName = styled.span`
  font-weight: 500;
`;

const IpAddress = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 13px;
`;

const TimeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TimeLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const TimeValue = styled.span`
  font-weight: 500;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme, $danger }) => $danger ? theme.danger : theme.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, $danger }) =>
      $danger ? theme.dangerLight : theme.backgroundHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SuspiciousBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.dangerLight};
  color: ${({ theme }) => theme.danger};
`;

const SuspiciousReason = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  font-style: italic;
  margin-top: 4px;
  display: block;
`;

const CurrentSessionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.primaryLight};
  color: ${({ theme }) => theme.primary};
  margin-left: 8px;
`;

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
`;

const NoDataIcon = styled.div`
  font-size: 48px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 16px;
`;

const NoDataTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 8px;
`;

const NoDataText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  max-width: 400px;
  margin: 0 auto;
`;

const LoadingContainer = styled.div`
  padding: 24px;
`;

const SkeletonRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
`;

const VirtualTableContainer = styled.div`
  overflow: auto;
  max-height: 600px;
`;

/**
 * Componente para mostrar y gestionar las sesiones activas del usuario
 */
const SessionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { confirm } = useConfirm();
  const toast = useToast();

  const {
    activeSessions,
    allSessions,
    isLoadingActiveSessions,
    isErrorActiveSessions,
    activeSessionsError,
    refetchActiveSessions,
    closeSession,
    closeOtherSessions,
    isClosingSession,
    isClosingOtherSessions,
  } = useSessions();

  // Obtener el token actual para identificar la sesión actual
  const currentToken = localStorage.getItem('bitacora_token');

  // Filtrar sesiones según la búsqueda
  const filteredSessions = activeSessions.filter(session => {
    const searchLower = searchQuery.toLowerCase();
    return (
      session.device?.toLowerCase().includes(searchLower) ||
      session.ipAddress?.toLowerCase().includes(searchLower) ||
      session.location?.toLowerCase().includes(searchLower)
    );
  });

  // Manejar cierre de sesión individual
  const handleCloseSession = async (sessionId) => {
    const result = await confirm({
      title: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar esta sesión? Si es tu sesión actual, se cerrará tu sesión y serás redirigido a la página de inicio de sesión.',
      confirmText: 'Cerrar sesión',
      cancelText: 'Cancelar',
      confirmVariant: 'danger',
    });

    if (result) {
      closeSession(sessionId);
    }
  };

  // Manejar cierre de todas las sesiones excepto la actual
  const handleCloseOtherSessions = async () => {
    const result = await confirm({
      title: 'Cerrar otras sesiones',
      message: '¿Estás seguro de que deseas cerrar todas las demás sesiones? Esto cerrará todas las sesiones excepto la que estás utilizando actualmente.',
      confirmText: 'Cerrar otras sesiones',
      cancelText: 'Cancelar',
      confirmVariant: 'danger',
    });

    if (result) {
      closeOtherSessions(currentToken);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return {
        relative: formatDistanceToNow(date, { addSuffix: true, locale: es }),
        formatted: format(date, 'dd/MM/yyyy HH:mm:ss')
      };
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return { relative: 'Fecha desconocida', formatted: 'Fecha desconocida' };
    }
  };

  // Obtener icono según el estado de la sesión
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <FiCheck />;
      case 'EXPIRED':
        return <FiClock />;
      case 'REVOKED':
        return <FiX />;
      case 'LOGGED_OUT':
        return <FiX />;
      default:
        return null;
    }
  };

  // Renderizar fila de sesión para la lista virtual
  const renderSessionRow = (session) => {
    const isCurrentSession = session.token === currentToken;
    const loginTime = formatDate(session.loginTime);
    const lastActivityTime = formatDate(session.lastActivityTime);

    return (
      <tr key={session.id}>
        <td>
          <DeviceInfo>
            <DeviceName>
              {session.device || 'Dispositivo desconocido'}
              {isCurrentSession && (
                <CurrentSessionBadge>
                  <FiShield size={10} />
                  Sesión actual
                </CurrentSessionBadge>
              )}
            </DeviceName>
            <IpAddress>{session.ipAddress || 'IP desconocida'}</IpAddress>
          </DeviceInfo>
        </td>
        <td>
          <LocationInfo>
            <FiMapPin size={14} />
            {session.location || 'Ubicación desconocida'}
          </LocationInfo>
        </td>
        <td>
          <TimeInfo>
            <TimeLabel>Inicio de sesión:</TimeLabel>
            <TimeValue title={loginTime.formatted}>{loginTime.relative}</TimeValue>
            <TimeLabel>Última actividad:</TimeLabel>
            <TimeValue title={lastActivityTime.formatted}>{lastActivityTime.relative}</TimeValue>
          </TimeInfo>
        </td>
        <td>
          <StatusBadge $status={session.status}>
            {getStatusIcon(session.status)}
            {session.status === 'ACTIVE' ? 'Activa' :
             session.status === 'EXPIRED' ? 'Expirada' :
             session.status === 'REVOKED' ? 'Revocada' :
             session.status === 'LOGGED_OUT' ? 'Cerrada' : session.status}
          </StatusBadge>
          {session.suspicious && (
            <>
              <SuspiciousBadge>
                <FiAlertCircle size={10} />
                Sospechosa
              </SuspiciousBadge>
              {session.suspiciousReason && (
                <SuspiciousReason>{session.suspiciousReason}</SuspiciousReason>
              )}
            </>
          )}
        </td>
        <td>
          <ActionButton
            $danger
            onClick={() => handleCloseSession(session.id)}
            disabled={isClosingSession || session.status !== 'ACTIVE'}
            title="Cerrar sesión"
          >
            <FiTrash2 size={16} />
          </ActionButton>
        </td>
      </tr>
    );
  };

  // Renderizar estado de carga
  const renderLoading = () => (
    <LoadingContainer>
      <SkeletonRow>
        <Skeleton width="150px" height="40px" />
        <Skeleton width="100px" height="40px" />
      </SkeletonRow>
      <Skeleton width="100%" height="50px" marginBottom="16px" />
      <Skeleton width="100%" height="400px" />
    </LoadingContainer>
  );

  // Renderizar estado de error
  const renderError = () => (
    <ErrorState
      title="Error al cargar las sesiones"
      message={activeSessionsError?.message || 'No se pudieron cargar las sesiones. Por favor, intenta de nuevo.'}
      actionText="Reintentar"
      onAction={refetchActiveSessions}
    />
  );

  // Renderizar estado sin datos
  const renderNoData = () => (
    <NoDataContainer>
      <NoDataIcon>
        <FiActivity />
      </NoDataIcon>
      <NoDataTitle>No hay sesiones activas</NoDataTitle>
      <NoDataText>
        No se encontraron sesiones activas para tu cuenta. Esto podría significar que solo tienes la sesión actual activa.
      </NoDataText>
    </NoDataContainer>
  );

  return (
    <PageContainer>
      <PageHeader>
        <Title>Sesiones Activas</Title>
        <ActionButtons>
          <Button onClick={refetchActiveSessions}>
            <FiRefreshCw size={16} />
            Actualizar
          </Button>
          <Button
            $danger
            onClick={handleCloseOtherSessions}
            disabled={isClosingOtherSessions || activeSessions.length <= 1}
          >
            <FiTrash2 size={16} />
            Cerrar otras sesiones
          </Button>
        </ActionButtons>
      </PageHeader>

      <SearchContainer>
        <SearchIcon>
          <FiSearch size={16} />
        </SearchIcon>
        <SearchInput
          placeholder="Buscar por dispositivo, IP o ubicación..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>

      {isLoadingActiveSessions ? (
        renderLoading()
      ) : isErrorActiveSessions ? (
        renderError()
      ) : (
        <Card>
          {filteredSessions.length === 0 ? (
            renderNoData()
          ) : (
            <>
              <Table>
                <TableHead>
                  <tr>
                    <th>Dispositivo</th>
                    <th>Ubicación</th>
                    <th>Tiempo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </TableHead>
              </Table>

              <VirtualTableContainer>
                <VirtualList
                  items={filteredSessions}
                  height={500}
                  itemHeight={100}
                  renderItem={renderSessionRow}
                  overscan={5}
                />
              </VirtualTableContainer>
            </>
          )}
        </Card>
      )}
    </PageContainer>
  );
};

export default SessionsPage;
