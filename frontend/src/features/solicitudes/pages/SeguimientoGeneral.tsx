/**
 * @file SeguimientoGeneral.tsx
 * @description Página general de seguimiento de solicitudes para usuarios SOLICITANTE
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiAlertCircle,
  FiClock,
  FiPlus,
  FiSearch,
  FiFilter,
  FiLoader,
  FiFileText,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiEye
} from 'react-icons/fi';
import solicitudesService from '../services/solicitudesService';
import { useSolicitudes } from '../hooks/useSolicitudes';
import { StatusBadge, PriorityBadge } from '@/shared/components/ui';
import { glassCard } from '@/shared/styles';

// Función para formatear fechas
const formatDate = (dateString: string) => {
  if (!dateString) return 'No disponible';

  try {
    const date = new Date(dateString);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.error('Fecha inválida:', dateString);
      return 'Fecha inválida';
    }

    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error, dateString);
    return 'Error en fecha';
  }
};

// Función para obtener el texto de estado
const getStatusText = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return 'Solicitada';
    case 'SUBMITTED':
      return 'Enviada';
    case 'ASSIGNED':
      return 'Asignada';
    case 'IN_PROGRESS':
      return 'En Progreso';
    case 'COMPLETED':
      return 'Completada';
    case 'APPROVED':
      return 'Aprobada';
    case 'REJECTED':
      return 'Rechazada';
    default:
      return status;
  }
};

// Función para obtener el icono de estado
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return <FiClock size={14} />;
    case 'SUBMITTED':
      return <FiClock size={14} />;
    case 'ASSIGNED':
      return <FiClock size={14} />;
    case 'IN_PROGRESS':
      return <FiClock size={14} />;
    case 'COMPLETED':
      return <FiCheckCircle size={14} />;
    case 'APPROVED':
      return <FiCheckCircle size={14} />;
    case 'REJECTED':
      return <FiXCircle size={14} />;
    default:
      return <FiAlertCircle size={14} />;
  }
};

// Función para obtener el texto de prioridad
const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'CRITICAL':
      return 'Crítica';
    case 'HIGH':
      return 'Alta';
    case 'MEDIUM':
      return 'Media';
    case 'LOW':
      return 'Baja';
    case 'TRIVIAL':
      return 'Trivial';
    default:
      return priority;
  }
};

// Styled components
const PageContainer = styled.div`
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  background-color: ${({ theme, $primary }) => $primary ? theme.primary : theme.backgroundSecondary};
  color: ${({ theme, $primary }) => $primary ? 'white' : theme.text};
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    background-color: ${({ theme, $primary }) => $primary ? theme.primaryHover : theme.backgroundHover};
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  input {
    width: 100%;
    padding: 10px 16px 10px 40px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.border};
    background-color: ${({ theme }) => theme.backgroundSecondary};
    color: ${({ theme }) => theme.text};
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}20`};
    }
  }

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}20`};
  }
`;

const EmptyState = styled.div`
  ${glassCard}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};

  svg {
    color: ${({ theme }) => theme.textTertiary};
    margin-bottom: 16px;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0 0 24px 0;
    max-width: 500px;
  }
`;

const SolicitudesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SolicitudCard = styled.div<{ $isUrgent?: boolean; $isOverdue?: boolean }>`
  ${glassCard}
  overflow: hidden;
  transition: all 0.2s ease;
  position: relative;
  border-left: 4px solid ${({ $isUrgent, $isOverdue, theme }) =>
    $isOverdue ? theme.error :
    $isUrgent ? theme.warning :
    'transparent'};

  ${({ $isUrgent, $isOverdue, theme }) => ($isUrgent || $isOverdue) && `
    box-shadow: 0 4px 12px ${$isOverdue ? `${theme.error}40` : `${theme.warning}40`};
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px ${({ $isUrgent, $isOverdue, theme }) =>
      $isOverdue ? `${theme.error}40` :
      $isUrgent ? `${theme.warning}40` :
      'rgba(0, 0, 0, 0.1)'};
  }

  ${({ $isUrgent, theme }) => $isUrgent && `
    &:before {
      content: '⚠️ Urgente';
      position: absolute;
      top: 0;
      right: 0;
      background-color: ${theme.warning};
      color: white;
      font-size: 10px;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 0 0 0 8px;
      z-index: 1;
    }
  `}

  ${({ $isOverdue, theme }) => $isOverdue && `
    &:before {
      content: '⚠️ Vencida';
      position: absolute;
      top: 0;
      right: 0;
      background-color: ${theme.error};
      color: white;
      font-size: 10px;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 0 0 0 8px;
      z-index: 1;
    }
  `}
`;

const SolicitudHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
`;

const SolicitudTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`;

const SolicitudMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SolicitudDate = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

/**
 * Componente SeguimientoGeneral
 * @returns {JSX.Element} Componente SeguimientoGeneral
 */
const SeguimientoGeneral: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Obtener solicitudes del usuario actual
  const {
    mySolicitudes,
    isLoadingMySolicitudes,
    mySolicitudesError,
    refetchMySolicitudes
  } = useSolicitudes();

  // Filtrar solicitudes en seguimiento (no completadas, no rechazadas)
  const solicitudesEnSeguimiento = React.useMemo(() => {
    if (!mySolicitudes?.taskRequests) return [];

    return mySolicitudes.taskRequests.filter(solicitud =>
      solicitud.status !== 'COMPLETED' &&
      solicitud.status !== 'APPROVED' &&
      solicitud.status !== 'REJECTED'
    );
  }, [mySolicitudes]);

  // Aplicar filtros adicionales
  const filteredSolicitudes = React.useMemo(() => {
    if (!solicitudesEnSeguimiento) return [];

    return solicitudesEnSeguimiento.filter(solicitud => {
      // Filtro por término de búsqueda
      const matchesSearch = searchTerm === '' ||
        solicitud.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solicitud.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por estado
      const matchesStatus = statusFilter === '' || solicitud.status === statusFilter;

      // Filtro por prioridad
      const matchesPriority = priorityFilter === '' || solicitud.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [solicitudesEnSeguimiento, searchTerm, statusFilter, priorityFilter]);

  // Navegar a la página de seguimiento específica
  const handleVerSeguimiento = (id: number) => {
    navigate(`/app/solicitudes/seguimiento/${id}`);
  };

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>Seguimiento de Solicitudes</PageTitle>
          <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)' }}>
            Solicitudes activas que requieren tu atención o están en proceso
          </p>
        </div>
        <ButtonGroup>
          <Button onClick={() => refetchMySolicitudes()}>
            <FiLoader size={16} />
            Recargar
          </Button>
          <Button $primary onClick={() => navigate('/app/solicitudes/nueva')}>
            <FiPlus size={16} />
            Nueva Solicitud
          </Button>
        </ButtonGroup>
      </PageHeader>

      <FiltersContainer>
        <SearchInput>
          <FiSearch size={16} />
          <input
            type="text"
            placeholder="Buscar solicitudes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>

        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="SUBMITTED">Enviada</option>
          <option value="ASSIGNED">Asignada</option>
          <option value="IN_PROGRESS">En Progreso</option>
        </FilterSelect>

        <FilterSelect
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">Todas las prioridades</option>
          <option value="LOW">Baja</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
          <option value="CRITICAL">Crítica</option>
        </FilterSelect>
      </FiltersContainer>

      {isLoadingMySolicitudes ? (
        <EmptyState>
          <FiLoader size={48} />
          <h3>Cargando solicitudes...</h3>
          <p>Por favor espere mientras obtenemos sus solicitudes en seguimiento.</p>
        </EmptyState>
      ) : filteredSolicitudes.length > 0 ? (
        <SolicitudesList>
          {filteredSolicitudes.map((solicitud) => {
            // Determinar si la solicitud es urgente (prioridad alta o crítica)
            const isUrgent = solicitud.priority === 'HIGH' || solicitud.priority === 'CRITICAL';

            // Determinar si la solicitud está vencida (tiene fecha límite y ya pasó)
            const isOverdue = solicitud.dueDate && new Date(solicitud.dueDate) < new Date();

            return (
              <SolicitudCard
                key={solicitud.id}
                onClick={() => handleVerSeguimiento(solicitud.id)}
                $isUrgent={isUrgent && !isOverdue} // Solo mostrar como urgente si no está vencida
                $isOverdue={isOverdue}
              >
                <SolicitudHeader>
                  <SolicitudTitle>
                    {solicitud.title}
                  </SolicitudTitle>
                  <SolicitudMeta>
                    <StatusBadge $status={solicitud.status}>
                      {getStatusIcon(solicitud.status)}
                      {getStatusText(solicitud.status)}
                    </StatusBadge>
                    <PriorityBadge $priority={solicitud.priority}>
                      {getPriorityText(solicitud.priority)}
                    </PriorityBadge>
                    <SolicitudDate>
                      <FiCalendar size={14} />
                      {formatDate(solicitud.createdAt)}
                    </SolicitudDate>
                    {solicitud.dueDate && (
                      <SolicitudDate style={{
                        color: isOverdue ? '#EF4444' : 'inherit',
                        fontWeight: isOverdue ? 'bold' : 'normal'
                      }}>
                        <FiCalendar size={14} />
                        Límite: {formatDate(solicitud.dueDate)}
                      </SolicitudDate>
                    )}
                  </SolicitudMeta>
                </SolicitudHeader>
              </SolicitudCard>
            );
          })}
        </SolicitudesList>
      ) : mySolicitudesError ? (
        <EmptyState>
          <FiAlertCircle size={48} />
          <h3>Error al cargar solicitudes</h3>
          <p>Ocurrió un error al intentar cargar sus solicitudes en seguimiento. Por favor intente nuevamente.</p>
          <Button $primary onClick={() => refetchMySolicitudes()}>
            Reintentar
          </Button>
        </EmptyState>
      ) : (
        <EmptyState>
          <FiAlertCircle size={48} />
          <h3>No hay solicitudes en seguimiento</h3>
          <p>
            No tienes solicitudes activas para dar seguimiento en este momento.
            Las solicitudes aparecerán aquí cuando estén en proceso de atención.
          </p>
          <ButtonGroup>
            <Button onClick={() => navigate('/app/solicitudes')}>
              <FiEye size={16} />
              Ver todas mis solicitudes
            </Button>
            <Button $primary onClick={() => navigate('/app/solicitudes/nueva')}>
              <FiPlus size={16} />
              Crear nueva solicitud
            </Button>
          </ButtonGroup>
        </EmptyState>
      )}
    </PageContainer>
  );
};

export default SeguimientoGeneral;
