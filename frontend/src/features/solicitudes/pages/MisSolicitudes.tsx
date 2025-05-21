import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus,
  FiFilter,
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiLoader,
  FiRefreshCw,
  FiEdit2
} from 'react-icons/fi';
import useSolicitudes from '../hooks/useSolicitudes';
import { Activity } from '@/types/models';
import { Tooltip } from '@/shared/components/ui';
import ReenviarSolicitudModal from '../components/ReenviarSolicitudModal';
import { TaskRequest } from '../services/solicitudesService';

// Datos de respaldo para mostrar en la interfaz si no hay datos reales
const MOCK_SOLICITUDES = [
  {
    id: 1,
    titulo: 'Solicitud de informe técnico',
    descripcion: 'Necesito un informe técnico sobre el caso #12345 para presentar en la audiencia del próximo mes.',
    categoria: 'LEGAL',
    prioridad: 'HIGH',
    fechaCreacion: '2025-05-01T10:30:00',
    fechaLimite: '2025-05-15',
    estado: 'REQUESTED',
    asignador: null,
    ejecutor: null
  },
  {
    id: 2,
    titulo: 'Revisión de expediente administrativo',
    descripcion: 'Solicito la revisión del expediente administrativo #54321 para verificar si hay inconsistencias.',
    categoria: 'ADMINISTRATIVA',
    prioridad: 'MEDIUM',
    fechaCreacion: '2025-04-28T14:15:00',
    fechaLimite: '2025-05-10',
    estado: 'ASSIGNED',
    asignador: 'Carlos Rodríguez',
    ejecutor: 'Ana Martínez'
  },
  {
    id: 3,
    titulo: 'Preparación de presentación para audiencia',
    descripcion: 'Necesito una presentación para la audiencia del caso #67890 que resuma los puntos principales.',
    categoria: 'LEGAL',
    prioridad: 'CRITICAL',
    fechaCreacion: '2025-04-25T09:45:00',
    fechaLimite: '2025-05-05',
    estado: 'IN_PROGRESS',
    asignador: 'Carlos Rodríguez',
    ejecutor: 'Luis Sánchez'
  },
  {
    id: 4,
    titulo: 'Análisis de documentación financiera',
    descripcion: 'Solicito un análisis detallado de la documentación financiera del caso #24680 para identificar posibles irregularidades.',
    categoria: 'FINANCIERA',
    prioridad: 'HIGH',
    fechaCreacion: '2025-04-20T11:00:00',
    fechaLimite: '2025-04-30',
    estado: 'COMPLETED',
    asignador: 'Carlos Rodríguez',
    ejecutor: 'María López'
  },
  {
    id: 5,
    titulo: 'Solicitud de dictamen pericial',
    descripcion: 'Necesito un dictamen pericial sobre las evidencias del caso #13579 para presentar como prueba.',
    categoria: 'TECNICA',
    prioridad: 'MEDIUM',
    fechaCreacion: '2025-04-15T16:30:00',
    fechaLimite: '2025-04-25',
    estado: 'APPROVED',
    asignador: 'Carlos Rodríguez',
    ejecutor: 'Pedro Gómez'
  },
  {
    id: 6,
    titulo: 'Solicitud de entrevista con testigo',
    descripcion: 'Solicito coordinar una entrevista con el testigo principal del caso #97531 para recabar información adicional.',
    categoria: 'LEGAL',
    prioridad: 'LOW',
    fechaCreacion: '2025-04-10T13:15:00',
    fechaLimite: '2025-04-20',
    estado: 'REJECTED',
    asignador: 'Carlos Rodríguez',
    ejecutor: null,
    motivoRechazo: 'El testigo ya no está disponible para entrevistas.'
  }
];

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
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
    border-radius: 6px;
    border: 2px solid ${({ theme }) => theme.border};
    background-color: ${({ theme }) => theme.backgroundSecondary};
    color: ${({ theme }) => theme.text};
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:focus {
      border-color: ${({ theme }) => theme.primary};
      outline: none;
      box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}40`};
    }

    &::placeholder {
      color: ${({ theme }) => theme.textSecondary};
      opacity: 0.9;
    }
  }

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.primary};
    opacity: 0.9;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border-radius: 6px;
  border: 2px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  min-width: 150px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding-right: 30px;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}40`};
  }
`;

const SolicitudesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SolicitudCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundPaper};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 16px;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const SolicitudHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const SolicitudTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  ${({ $status, theme }) => {
    switch ($status) {
      case 'REQUESTED':
        return `
          background-color: #E6F2FF;
          color: #0066CC;
          border: 1px solid #99CCFF;
        `;
      case 'ASSIGNED':
        return `
          background-color: #FFF8E6;
          color: #CC7700;
          border: 1px solid #FFCC66;
        `;
      case 'IN_PROGRESS':
        return `
          background-color: #F0E6FF;
          color: #6600CC;
          border: 1px solid #CC99FF;
        `;
      case 'COMPLETED':
        return `
          background-color: #E6FFE6;
          color: #007700;
          border: 1px solid #99DD99;
        `;
      case 'APPROVED':
        return `
          background-color: #E6FFE6;
          color: #007700;
          border: 1px solid #99DD99;
        `;
      case 'REJECTED':
        return `
          background-color: #FFE6E6;
          color: #CC0000;
          border: 1px solid #FF9999;
        `;
      default:
        return `
          background-color: #F0F0F5;
          color: #666666;
          border: 1px solid #CCCCCC;
        `;
    }
  }}
`;

const PriorityBadge = styled.span<{ $priority: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  ${({ $priority, theme }) => {
    switch ($priority) {
      case 'CRITICAL':
        return `
          background-color: #FFE6E6;
          color: #CC0000;
          border: 1px solid #FF9999;
        `;
      case 'HIGH':
        return `
          background-color: #FFF0E6;
          color: #CC4400;
          border: 1px solid #FFAA77;
        `;
      case 'MEDIUM':
        return `
          background-color: #E6F2FF;
          color: #0066CC;
          border: 1px solid #99CCFF;
        `;
      case 'LOW':
        return `
          background-color: #E6FFE6;
          color: #007700;
          border: 1px solid #99DD99;
        `;
      case 'TRIVIAL':
        return `
          background-color: #F0F0F5;
          color: #666666;
          border: 1px solid #CCCCCC;
        `;
      default:
        return `
          background-color: #F0F0F5;
          color: #666666;
          border: 1px solid #CCCCCC;
        `;
    }
  }}
`;

const SolicitudDetails = styled.div<{ $isOpen: boolean }>`
  padding: ${({ $isOpen }) => ($isOpen ? '16px' : '0')};
  max-height: ${({ $isOpen }) => ($isOpen ? '500px' : '0')};
  overflow: hidden;
  transition: all 0.3s ease;
  border-top: ${({ $isOpen, theme }) => ($isOpen ? `1px solid ${theme.border}` : 'none')};
  background-color: ${({ theme }) => theme.backgroundPaper};
  box-shadow: ${({ $isOpen }) => ($isOpen ? 'inset 0 2px 4px rgba(0, 0, 0, 0.05)' : 'none')};
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
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const DetailValue = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: ${({ theme }) => theme.backgroundPaper};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  svg {
    color: ${({ theme }) => theme.primary};
    margin-bottom: 16px;
    opacity: 0.8;
  }

  h3 {
    margin: 0 0 8px;
    color: ${({ theme }) => theme.text};
    font-weight: 600;
  }

  p {
    margin: 0 0 20px;
    color: ${({ theme }) => theme.text};
    opacity: 0.8;
  }
`;

// Función para formatear fechas
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Función para obtener el texto de estado
const getStatusText = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return 'Solicitada';
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

const MisSolicitudes: React.FC = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setpriorityFilter] = useState('');
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [showReenviarModal, setShowReenviarModal] = useState(false);
  const [selectedTaskRequest, setSelectedTaskRequest] = useState<TaskRequest | null>(null);

  // Obtener solicitudes del usuario actual
  const {
    mySolicitudes,
    isLoadingMySolicitudes,
    mySolicitudesError,
    isResubmittingTaskRequest,
    resubmitTaskRequest,
    refetchMySolicitudes
  } = useSolicitudes();

  // Actualizar el estado local cuando se reciben los datos
  useEffect(() => {
    console.log('MisSolicitudes: Datos recibidos:', mySolicitudes);

    if (mySolicitudes && mySolicitudes.taskRequests) {
      console.log('MisSolicitudes: Solicitudes encontradas:', mySolicitudes.taskRequests.length);

      // Mapear las solicitudes al formato esperado por el componente
      const mappedSolicitudes = mySolicitudes.taskRequests.map((taskRequest) => {
        console.log('MisSolicitudes: Procesando solicitud:', taskRequest);

        return {
          id: taskRequest.id,
          titulo: taskRequest.title,
          descripcion: taskRequest.description,
          categoria: taskRequest.category?.name || '',
          prioridad: taskRequest.priority || 'MEDIUM',
          fechaCreacion: taskRequest.requestDate,
          fechaLimite: taskRequest.dueDate,
          estado: taskRequest.status,
          asignador: null,
          ejecutor: null
        };
      });

      console.log('MisSolicitudes: Solicitudes mapeadas:', mappedSolicitudes);
      setSolicitudes(mappedSolicitudes);
    } else {
      console.warn('MisSolicitudes: No se encontraron solicitudes en la respuesta');
    }
  }, [mySolicitudes]);

  // Usar solo datos reales, no usar datos de respaldo
  const solicitudesData = solicitudes;

  // Filtrar solicitudes según los criterios
  const filteredSolicitudes = solicitudesData.filter(solicitud => {
    const matchesSearch = searchTerm === '' ||
      solicitud.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || solicitud.estado === statusFilter;
    const matchesPriority = priorityFilter === '' || solicitud.prioridad === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleReenviar = (solicitudId: number) => {
    // Buscar la solicitud en los datos originales
    const taskRequest = mySolicitudes?.taskRequests.find(tr => tr.id === solicitudId) || null;

    // Mostrar modal de reenvío
    setSelectedTaskRequest(taskRequest);
    setShowReenviarModal(true);
  };

  const handleConfirmReenviar = (notes?: string) => {
    if (!selectedTaskRequest) return;

    // Reenviar la solicitud
    resubmitTaskRequest({
      taskRequestId: selectedTaskRequest.id,
      notes
    });

    // Cerrar el modal y limpiar el estado
    setShowReenviarModal(false);
    setSelectedTaskRequest(null);

    // Cerrar el panel expandido
    setExpandedId(null);
  };

  const handleCancelReenviar = () => {
    setShowReenviarModal(false);
    setSelectedTaskRequest(null);
  };

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>Mis Solicitudes</PageTitle>
          <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)' }}>
            Historial completo de todas tus solicitudes
          </p>
        </div>
        <ButtonGroup>
          <Button onClick={() => navigate('/app/solicitudes/seguimiento')}>
            <FiClock size={16} />
            Ver seguimiento
          </Button>
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
          <option value="REQUESTED">Solicitada</option>
          <option value="ASSIGNED">Asignada</option>
          <option value="IN_PROGRESS">En Progreso</option>
          <option value="COMPLETED">Completada</option>
          <option value="APPROVED">Aprobada</option>
          <option value="REJECTED">Rechazada</option>
        </FilterSelect>
        <FilterSelect
          value={priorityFilter}
          onChange={(e) => setpriorityFilter(e.target.value)}
        >
          <option value="">Todas las prioridades</option>
          <option value="CRITICAL">Crítica</option>
          <option value="HIGH">Alta</option>
          <option value="MEDIUM">Media</option>
          <option value="LOW">Baja</option>
          <option value="TRIVIAL">Trivial</option>
        </FilterSelect>
        <Button>
          <FiFilter size={16} />
          Más filtros
        </Button>
      </FiltersContainer>

      {/* Modal de reenvío de solicitud rechazada */}
      <ReenviarSolicitudModal
        isOpen={showReenviarModal}
        onClose={handleCancelReenviar}
        onResubmit={handleConfirmReenviar}
        taskRequest={selectedTaskRequest}
        isResubmitting={isResubmittingTaskRequest}
      />

      {isLoadingMySolicitudes ? (
        <EmptyState>
          <FiLoader size={48} />
          <h3>Cargando solicitudes...</h3>
          <p>Por favor espere mientras obtenemos sus solicitudes.</p>
        </EmptyState>
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
                {solicitud.asignador && (
                  <DetailRow>
                    <DetailLabel>Asignador:</DetailLabel>
                    <DetailValue>{solicitud.asignador}</DetailValue>
                  </DetailRow>
                )}
                {solicitud.ejecutor && (
                  <DetailRow>
                    <DetailLabel>Ejecutor:</DetailLabel>
                    <DetailValue>{solicitud.ejecutor}</DetailValue>
                  </DetailRow>
                )}
                {solicitud.motivoRechazo && (
                  <DetailRow>
                    <DetailLabel>Motivo de rechazo:</DetailLabel>
                    <DetailValue>{solicitud.motivoRechazo}</DetailValue>
                  </DetailRow>
                )}
                <DetailRow style={{ marginTop: '16px', justifyContent: 'flex-end', gap: '12px' }}>
                  {solicitud.estado === 'REJECTED' && (
                    <>
                      <Tooltip
                        title="Edita esta solicitud rechazada para corregir los problemas señalados"
                        arrow
                      >
                        <ActionButton
                          onClick={() => navigate(`/app/solicitudes/editar/${solicitud.id}`)}
                          style={{ backgroundColor: '#2196F3' }}
                        >
                          <FiEdit2 size={14} />
                          Editar solicitud
                        </ActionButton>
                      </Tooltip>
                      <Tooltip
                        title="Reenvía esta solicitud rechazada con las correcciones necesarias"
                        arrow
                      >
                        <ActionButton
                          onClick={() => handleReenviar(solicitud.id)}
                          style={{ backgroundColor: '#f44336' }}
                        >
                          <FiRefreshCw size={14} />
                          Reenviar solicitud
                        </ActionButton>
                      </Tooltip>
                    </>
                  )}
                  <Tooltip
                    title="Accede al seguimiento detallado de esta solicitud para ver su progreso, historial y comentarios"
                    arrow
                  >
                    <ActionButton onClick={() => navigate(`/app/solicitudes/seguimiento/${solicitud.id}`)}>
                      <FiEye size={14} />
                      Ver seguimiento
                    </ActionButton>
                  </Tooltip>
                </DetailRow>
              </SolicitudDetails>
            </SolicitudCard>
          ))}
        </SolicitudesList>
      ) : mySolicitudesError ? (
        <EmptyState>
          <FiAlertCircle size={48} />
          <h3>Error al cargar solicitudes</h3>
          <p>Ocurrió un error al intentar cargar sus solicitudes. Por favor intente nuevamente.</p>
          <Button $primary onClick={() => refetchMySolicitudes()}>
            Reintentar
          </Button>
        </EmptyState>
      ) : (
        <EmptyState>
          <FiAlertCircle size={48} />
          <h3>No se encontraron solicitudes</h3>
          <p>No hay solicitudes que coincidan con los criterios de búsqueda o filtros aplicados.</p>
          <Button $primary onClick={() => navigate('/app/solicitudes/nueva')}>
            <FiPlus size={16} />
            Crear nueva solicitud
          </Button>
        </EmptyState>
      )}
    </PageContainer>
  );
};

export default MisSolicitudes;
