import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  FiFilter,
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiUserPlus,
  FiUser,
  FiUsers,
  FiLoader,
  FiInfo
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Hooks y servicios
import { useAsignacion } from '../hooks/useAsignacion';
import { TaskRequest } from '@/features/solicitudes/services/solicitudesService';
import { Ejecutor } from '../services/asignacionService';

// Animación para el spinner
const SpinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Componente para el spinner
const Spinner = styled(FiLoader)`
  animation: ${SpinAnimation} 1s linear infinite;
`;

const PageContainer = styled.div`
  padding: 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  input {
    width: 100%;
    padding: 10px 12px 10px 36px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.border};
    background-color: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.text};
    font-size: 14px;
    transition: border-color 0.2s;

    &:focus {
      border-color: ${({ theme }) => theme.primary};
      outline: none;
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
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: border-color 0.2s;
  min-width: 150px;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $primary, theme }) =>
    $primary
      ? `
    background-color: ${theme.primary};
    color: white;
    border: none;

    &:hover {
      background-color: ${theme.primaryDark};
    }
  `
      : `
    background-color: transparent;
    color: ${theme.textSecondary};
    border: 1px solid ${theme.border};

    &:hover {
      background-color: ${theme.backgroundHover};
    }
  `}
`;

const SolicitudesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SolicitudCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

const SolicitudHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
`;

const SolicitudTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SolicitudMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SolicitudDate = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 13px;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);

  ${({ $status, theme }) => {
    switch ($status) {
      case 'REQUESTED':
        return `
          background-color: #E3F2FD;
          color: #0D47A1;
          border: 1px solid #2196F3;
        `;
      case 'SUBMITTED':
        return `
          background-color: #E3F2FD;
          color: #0D47A1;
          border: 1px solid #2196F3;
        `;
      case 'ASSIGNED':
        return `
          background-color: #FFF8E1;
          color: #E65100;
          border: 1px solid #FFC107;
        `;
      case 'IN_PROGRESS':
        return `
          background-color: #EDE7F6;
          color: #4527A0;
          border: 1px solid #673AB7;
        `;
      case 'COMPLETED':
        return `
          background-color: #E8F5E9;
          color: #1B5E20;
          border: 1px solid #4CAF50;
        `;
      case 'APPROVED':
        return `
          background-color: #E8F5E9;
          color: #1B5E20;
          border: 1px solid #4CAF50;
        `;
      case 'REJECTED':
        return `
          background-color: #FFEBEE;
          color: #B71C1C;
          border: 1px solid #F44336;
        `;
      default:
        return `
          background-color: #ECEFF1;
          color: #263238;
          border: 1px solid #607D8B;
        `;
    }
  }}
`;

const PriorityBadge = styled.span<{ $priority: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);

  ${({ $priority, theme }) => {
    switch ($priority) {
      case 'CRITICAL':
        return `
          background-color: #FFEBEE;
          color: #B71C1C;
          border: 1px solid #F44336;
        `;
      case 'HIGH':
        return `
          background-color: #FFF3E0;
          color: #E65100;
          border: 1px solid #FF9800;
        `;
      case 'MEDIUM':
        return `
          background-color: #E3F2FD;
          color: #0D47A1;
          border: 1px solid #2196F3;
        `;
      case 'LOW':
        return `
          background-color: #E8F5E9;
          color: #1B5E20;
          border: 1px solid #4CAF50;
        `;
      case 'TRIVIAL':
        return `
          background-color: #ECEFF1;
          color: #263238;
          border: 1px solid #607D8B;
        `;
      default:
        return `
          background-color: #ECEFF1;
          color: #263238;
          border: 1px solid #607D8B;
        `;
    }
  }}
`;

const SolicitudDetails = styled.div<{ $isOpen: boolean }>`
  padding: ${({ $isOpen }) => ($isOpen ? '16px' : '0')};
  max-height: ${({ $isOpen }) => ($isOpen ? '1000px' : '0')};
  overflow: hidden;
  transition: all 0.3s ease;
  border-top: ${({ $isOpen, theme }) => ($isOpen ? `1px solid ${theme.border}` : 'none')};
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.div`
  width: 150px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const DetailValue = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const AsignacionSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const AsignacionTitle = styled.h4`
  margin: 0 0 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

const EjecutoresList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;

  /* Estilo para la barra de desplazamiento */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--primary-color, #6C5CE7);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #5a4bd1;
  }
`;

const EjecutorItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${({ $selected, theme }) =>
    $selected ? `${theme.primary}10` : theme.backgroundAlt};
  border: 1px solid ${({ $selected, theme }) =>
    $selected ? theme.primary : 'transparent'};

  &:hover {
    background-color: ${({ $selected, theme }) =>
      $selected ? `${theme.primary}15` : theme.backgroundHover};
  }
`;

const EjecutorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const EjecutorAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => `${theme.primary}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
`;

const EjecutorDetails = styled.div``;

const EjecutorName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const EjecutorMeta = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 12px;
  display: flex;
  gap: 8px;
`;

const CargaIndicator = styled.div<{ $carga: number }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  ${({ $carga, theme }) => {
    if ($carga <= 2) {
      return `
        background-color: #E8F5E9;
        color: #1B5E20;
        border: 1px solid #4CAF50;
      `;
    } else if ($carga <= 4) {
      return `
        background-color: #FFF3E0;
        color: #E65100;
        border: 1px solid #FF9800;
      `;
    } else {
      return `
        background-color: #FFEBEE;
        color: #B71C1C;
        border: 1px solid #F44336;
      `;
    }
  }}
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  text-align: center;

  svg {
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 16px;
  }

  h3 {
    margin: 0 0 8px;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0 0 20px;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

// Función para formatear fechas
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha inválida';
  }
};

// Función para obtener el texto de estado
const getStatusText = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return 'Borrador';
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
    case 'CANCELLED':
      return 'Cancelada';
    default:
      return status;
  }
};

// Función para obtener el icono de estado
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'DRAFT':
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
    case 'CANCELLED':
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

// Función para obtener el texto de categoría
const getCategoryText = (category: string) => {
  switch (category) {
    case 'ADMINISTRATIVA':
      return 'Administrativa';
    case 'LEGAL':
      return 'Legal';
    case 'TECNICA':
      return 'Técnica';
    case 'FINANCIERA':
      return 'Financiera';
    case 'RECURSOS_HUMANOS':
      return 'Recursos Humanos';
    case 'OTRA':
      return 'Otra';
    default:
      return category;
  }
};

const BandejaEntrada: React.FC = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedEjecutor, setSelectedEjecutor] = useState<number | null>(null);
  const [asignacionNotas, setAsignacionNotas] = useState('');
  const [showAllExecutors, setShowAllExecutors] = useState(false);

  // Usar el hook personalizado para obtener datos y funcionalidades
  const {
    pendingRequests,
    availableExecutors,
    isLoadingPendingRequests,
    isLoadingExecutors,
    isAssigningTask,
    isRejectingTask,
    assignTaskRequest,
    rejectTaskRequest,
    filterExecutorsBySpecialty
  } = useAsignacion();

  // Adaptar los datos del backend al formato esperado por el componente
  const adaptarSolicitudes = (): any[] => {
    if (!pendingRequests?.taskRequests) return [];

    return pendingRequests.taskRequests.map(tr => ({
      id: tr.id,
      titulo: tr.title,
      descripcion: tr.description,
      categoria: tr.category?.name || 'OTRA',
      prioridad: tr.priority,
      fechaCreacion: tr.requestDate,
      fechaLimite: tr.dueDate,
      estado: tr.status,
      solicitante: tr.requesterName || (tr.requesterId ? `Usuario #${tr.requesterId}` : 'Desconocido'),
      asignador: tr.assignerName,
      ejecutor: tr.executorName
    }));
  };

  // Filtrar solicitudes según los criterios
  const filteredSolicitudes = adaptarSolicitudes().filter(solicitud => {
    const matchesSearch = searchTerm === '' ||
      solicitud.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || solicitud.estado === statusFilter;
    const matchesPriority = priorityFilter === '' || solicitud.prioridad === priorityFilter;
    const matchesCategory = categoryFilter === '' || solicitud.categoria === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
    setSelectedEjecutor(null);
    setAsignacionNotas('');
  };

  const handleSelectEjecutor = (id: number) => {
    setSelectedEjecutor(id);
  };

  const handleAsignar = (solicitudId: number) => {
    if (!selectedEjecutor) {
      toast.error('Debe seleccionar un ejecutor para asignar la solicitud');
      return;
    }

    // Asignar la solicitud al ejecutor seleccionado
    assignTaskRequest({
      taskRequestId: solicitudId,
      executorId: selectedEjecutor,
      notes: asignacionNotas
    });

    // Cerrar el panel expandido
    setExpandedId(null);
    setSelectedEjecutor(null);
    setAsignacionNotas('');
  };

  const [rechazoReason, setRechazoReason] = useState('');
  const [rechazoNotes, setRechazoNotes] = useState('');
  const [showRechazoModal, setShowRechazoModal] = useState(false);
  const [solicitudIdToReject, setSolicitudIdToReject] = useState<number | null>(null);

  const handleRechazar = (solicitudId: number) => {
    // Mostrar modal de rechazo
    setSolicitudIdToReject(solicitudId);
    setShowRechazoModal(true);
  };

  const confirmRechazar = () => {
    if (!solicitudIdToReject) return;

    if (!rechazoReason.trim()) {
      toast.error('Debe proporcionar un motivo de rechazo');
      return;
    }

    // Rechazar la solicitud
    rejectTaskRequest({
      taskRequestId: solicitudIdToReject,
      rechazo: {
        reason: rechazoReason,
        notes: rechazoNotes
      }
    });

    // Limpiar el estado
    setRechazoReason('');
    setRechazoNotes('');
    setShowRechazoModal(false);
    setSolicitudIdToReject(null);

    // Cerrar el panel expandido
    setExpandedId(null);
  };

  const cancelRechazar = () => {
    setRechazoReason('');
    setRechazoNotes('');
    setShowRechazoModal(false);
    setSolicitudIdToReject(null);
  };

  // Filtrar ejecutores por especialidad según la categoría de la solicitud seleccionada
  // o mostrar todos los ejecutores disponibles según la preferencia del usuario
  const getEjecutoresFiltrados = (solicitudId: number) => {
    if (!availableExecutors) return [];

    // Si el usuario ha elegido ver todos los ejecutores, devolver la lista completa
    if (showAllExecutors) {
      return availableExecutors;
    }

    // De lo contrario, filtrar por especialidad según la categoría de la solicitud
    const solicitud = adaptarSolicitudes().find(s => s.id === solicitudId);
    if (!solicitud) return availableExecutors;

    // Si la solicitud tiene una categoría específica, filtrar por especialidad
    if (solicitud.categoria) {
      return filterExecutorsBySpecialty(solicitud.categoria);
    }

    return availableExecutors;
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Bandeja de Entrada</PageTitle>
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
          <option value="CRITICAL">Crítica</option>
          <option value="HIGH">Alta</option>
          <option value="MEDIUM">Media</option>
          <option value="LOW">Baja</option>
          <option value="TRIVIAL">Trivial</option>
        </FilterSelect>
        <FilterSelect
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          <option value="ADMINISTRATIVA">Administrativa</option>
          <option value="LEGAL">Legal</option>
          <option value="TECNICA">Técnica</option>
          <option value="FINANCIERA">Financiera</option>
          <option value="RECURSOS_HUMANOS">Recursos Humanos</option>
          <option value="OTRA">Otra</option>
        </FilterSelect>
      </FiltersContainer>

      {/* Modal de rechazo */}
      {showRechazoModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--background-secondary, #2d2d3a)',
            borderRadius: '8px',
            padding: '24px',
            width: '500px',
            maxWidth: '90%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 16px', color: 'var(--text-color, #e1e1e6)' }}>Rechazar Solicitud</h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-color, #e1e1e6)', fontWeight: 'bold' }}>
                Motivo de rechazo: *
              </label>
              <input
                type="text"
                value={rechazoReason}
                onChange={(e) => setRechazoReason(e.target.value)}
                placeholder="Ej: No cumple con los requisitos"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color, #3f3f4e)',
                  backgroundColor: 'var(--background-dark, #1e1e2a)',
                  color: 'var(--text-color, #e1e1e6)'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-color, #e1e1e6)', fontWeight: 'bold' }}>
                Notas adicionales:
              </label>
              <textarea
                value={rechazoNotes}
                onChange={(e) => setRechazoNotes(e.target.value)}
                placeholder="Detalles adicionales sobre el rechazo..."
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color, #3f3f4e)',
                  backgroundColor: 'var(--background-dark, #1e1e2a)',
                  color: 'var(--text-color, #e1e1e6)',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button onClick={cancelRechazar}>
                Cancelar
              </Button>
              <Button
                $primary
                onClick={confirmRechazar}
                disabled={isRejectingTask}
              >
                {isRejectingTask ? (
                  <>
                    <Spinner size={16} />
                    Rechazando...
                  </>
                ) : (
                  <>
                    <FiXCircle size={16} />
                    Confirmar Rechazo
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoadingPendingRequests ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Spinner size={32} />
        </div>
      ) : filteredSolicitudes.length > 0 ? (
        <SolicitudesList>
          {filteredSolicitudes.map((solicitud) => (
            <SolicitudCard key={solicitud.id}>
              <SolicitudHeader onClick={() => toggleExpand(solicitud.id)}>
                <SolicitudTitle>
                  {solicitud.titulo}
                </SolicitudTitle>
                <SolicitudMeta>
                  <StatusBadge $status={solicitud.estado}>
                    {getStatusIcon(solicitud.estado)}
                    {getStatusText(solicitud.estado)}
                  </StatusBadge>
                  <PriorityBadge $priority={solicitud.prioridad}>
                    {getPriorityText(solicitud.prioridad)}
                  </PriorityBadge>
                  <SolicitudDate>
                    <FiClock size={14} />
                    {formatDate(solicitud.fechaCreacion)}
                  </SolicitudDate>
                  {expandedId === solicitud.id ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                </SolicitudMeta>
              </SolicitudHeader>
              <SolicitudDetails $isOpen={expandedId === solicitud.id}>
                <DetailRow>
                  <DetailLabel>Descripción:</DetailLabel>
                  <DetailValue>{solicitud.descripcion}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Solicitante:</DetailLabel>
                  <DetailValue>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-color, #6C5CE7)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {solicitud.solicitante.charAt(0).toUpperCase()}
                      </div>
                      {solicitud.solicitante}
                    </div>
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Categoría:</DetailLabel>
                  <DetailValue>{getCategoryText(solicitud.categoria)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Fecha de creación:</DetailLabel>
                  <DetailValue>{formatDate(solicitud.fechaCreacion)}</DetailValue>
                </DetailRow>
                {solicitud.fechaLimite && (
                  <DetailRow>
                    <DetailLabel>Fecha límite:</DetailLabel>
                    <DetailValue>{formatDate(solicitud.fechaLimite)}</DetailValue>
                  </DetailRow>
                )}

                <AsignacionSection>
                  <AsignacionTitle>Asignar solicitud</AsignacionTitle>

                  <div style={{
                    marginBottom: '15px',
                    padding: '12px',
                    backgroundColor: 'var(--background-dark, #2d2d3a)',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color-dark, #3f3f4e)',
                    color: 'var(--text-color-light, #e1e1e6)'
                  }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: 'var(--primary-color, #6C5CE7)' }}>
                      <FiInfo size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      Instrucciones:
                    </p>
                    <p style={{ margin: '0', lineHeight: '1.5' }}>
                      Seleccione un ejecutor de la lista y opcionalmente añada notas de asignación.
                      Al hacer clic en "Asignar", la solicitud cambiará a estado "Asignada" y se asignará al ejecutor seleccionado.
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px',
                    padding: '10px',
                    backgroundColor: 'var(--background-dark, #2d2d3a)',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color-dark, #3f3f4e)'
                  }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-color-light, #e1e1e6)' }}>Mostrar ejecutores:</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        backgroundColor: !showAllExecutors ? 'var(--primary-color, #6C5CE7)' : 'rgba(108, 92, 231, 0.2)',
                        color: 'white'
                      }}>
                        <input
                          type="radio"
                          checked={!showAllExecutors}
                          onChange={() => setShowAllExecutors(false)}
                          style={{ marginRight: '6px' }}
                        />
                        Recomendados
                      </label>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        backgroundColor: showAllExecutors ? 'var(--primary-color, #6C5CE7)' : 'rgba(108, 92, 231, 0.2)',
                        color: 'white'
                      }}>
                        <input
                          type="radio"
                          checked={showAllExecutors}
                          onChange={() => setShowAllExecutors(true)}
                          style={{ marginRight: '6px' }}
                        />
                        Todos los ejecutores
                      </label>
                    </div>
                  </div>

                  {isLoadingExecutors ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                      <Spinner size={24} />
                    </div>
                  ) : getEjecutoresFiltrados(solicitud.id).length > 0 ? (
                    <EjecutoresList>
                      {getEjecutoresFiltrados(solicitud.id).map((ejecutor) => (
                        <EjecutorItem
                          key={ejecutor.id}
                          $selected={selectedEjecutor === ejecutor.id}
                          onClick={() => handleSelectEjecutor(ejecutor.id)}
                        >
                          <EjecutorInfo>
                            <EjecutorAvatar>
                              <FiUser size={16} />
                            </EjecutorAvatar>
                            <EjecutorDetails>
                              <EjecutorName>{ejecutor.fullName}</EjecutorName>
                              <EjecutorMeta>
                                <span>Especialidad: {getCategoryText(ejecutor.especialidad || 'GENERAL')}</span>
                                <CargaIndicator $carga={ejecutor.cargaActual || 0}>
                                  Carga: {ejecutor.cargaActual || 0} tareas
                                </CargaIndicator>
                              </EjecutorMeta>
                            </EjecutorDetails>
                          </EjecutorInfo>
                        </EjecutorItem>
                      ))}
                    </EjecutoresList>
                  ) : (
                    <div style={{
                      padding: '20px',
                      textAlign: 'center',
                      backgroundColor: 'var(--background-dark, #2d2d3a)',
                      borderRadius: '8px',
                      color: 'var(--text-color-light, #e1e1e6)',
                      border: '1px solid var(--border-color-dark, #3f3f4e)'
                    }}>
                      <FiAlertCircle size={24} style={{ marginBottom: '8px', color: 'var(--primary-color, #6C5CE7)' }} />
                      <p>No hay ejecutores {!showAllExecutors ? 'recomendados' : 'disponibles'} para esta solicitud.</p>
                      <p style={{ marginTop: '8px', fontSize: '14px' }}>
                        {!showAllExecutors ? (
                          <button
                            onClick={() => setShowAllExecutors(true)}
                            style={{
                              background: 'var(--primary-color, #6C5CE7)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '8px 12px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              marginTop: '8px',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                            }}
                          >
                            <FiUsers size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                            Ver todos los ejecutores disponibles
                          </button>
                        ) : (
                          'No hay ejecutores disponibles en el sistema. Contacte al administrador.'
                        )}
                      </p>
                    </div>
                  )}

                  <div>
                    <DetailLabel>Notas de asignación:</DetailLabel>
                    <textarea
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color-dark, #3f3f4e)',
                        backgroundColor: 'var(--background-dark, #2d2d3a)',
                        color: 'var(--text-color-light, #e1e1e6)',
                        marginTop: '8px',
                        minHeight: '80px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                      placeholder="Añadir notas o instrucciones para el ejecutor..."
                      value={asignacionNotas}
                      onChange={(e) => setAsignacionNotas(e.target.value)}
                    />
                  </div>

                  <ButtonGroup>
                    <Button onClick={() => handleRechazar(solicitud.id)}>
                      <FiXCircle size={16} />
                      Rechazar
                    </Button>
                    <Button
                      $primary
                      onClick={() => handleAsignar(solicitud.id)}
                      disabled={!selectedEjecutor || isAssigningTask}
                    >
                      {isAssigningTask ? (
                        <Spinner size={16} />
                      ) : (
                        <FiUserPlus size={16} />
                      )}
                      {isAssigningTask ? 'Asignando...' : 'Asignar'}
                    </Button>
                  </ButtonGroup>
                </AsignacionSection>
              </SolicitudDetails>
            </SolicitudCard>
          ))}
        </SolicitudesList>
      ) : (
        <EmptyState>
          <FiAlertCircle size={48} />
          <h3>No hay solicitudes pendientes</h3>
          <p>No hay solicitudes que coincidan con los criterios de búsqueda o filtros aplicados.</p>
        </EmptyState>
      )}
    </PageContainer>
  );
};

export default BandejaEntrada;
