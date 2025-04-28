import React, { useState } from 'react';
import styled from 'styled-components';
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
  FiUser
} from 'react-icons/fi';
import { toast } from 'react-toastify';

// Datos de ejemplo para mostrar en la interfaz
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
    solicitante: 'Juan Pérez',
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
    estado: 'REQUESTED',
    solicitante: 'María López',
    asignador: null,
    ejecutor: null
  },
  {
    id: 3,
    titulo: 'Preparación de presentación para audiencia',
    descripcion: 'Necesito una presentación para la audiencia del caso #67890 que resuma los puntos principales.',
    categoria: 'LEGAL',
    prioridad: 'CRITICAL',
    fechaCreacion: '2025-04-25T09:45:00',
    fechaLimite: '2025-05-05',
    estado: 'REQUESTED',
    solicitante: 'Pedro Gómez',
    asignador: null,
    ejecutor: null
  }
];

// Datos de ejemplo para los ejecutores disponibles
const MOCK_EJECUTORES = [
  { id: 1, nombre: 'Ana Martínez', cargaActual: 3, especialidad: 'LEGAL' },
  { id: 2, nombre: 'Luis Sánchez', cargaActual: 2, especialidad: 'LEGAL' },
  { id: 3, nombre: 'María López', cargaActual: 1, especialidad: 'FINANCIERA' },
  { id: 4, nombre: 'Pedro Gómez', cargaActual: 4, especialidad: 'TECNICA' },
  { id: 5, nombre: 'Sofía Rodríguez', cargaActual: 2, especialidad: 'ADMINISTRATIVA' }
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
    background-color: ${({ theme }) => theme.backgroundInput};
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
  background-color: ${({ theme }) => theme.backgroundInput};
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
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  ${({ $status, theme }) => {
    switch ($status) {
      case 'REQUESTED':
        return `
          background-color: ${theme.infoLight};
          color: ${theme.info};
        `;
      case 'ASSIGNED':
        return `
          background-color: ${theme.warningLight};
          color: ${theme.warning};
        `;
      case 'IN_PROGRESS':
        return `
          background-color: ${theme.primaryLight};
          color: ${theme.primary};
        `;
      case 'COMPLETED':
        return `
          background-color: ${theme.successLight};
          color: ${theme.success};
        `;
      case 'APPROVED':
        return `
          background-color: ${theme.successLight};
          color: ${theme.success};
        `;
      case 'REJECTED':
        return `
          background-color: ${theme.errorLight};
          color: ${theme.error};
        `;
      default:
        return `
          background-color: ${theme.backgroundHover};
          color: ${theme.textSecondary};
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
  font-weight: 500;

  ${({ $priority, theme }) => {
    switch ($priority) {
      case 'CRITICAL':
        return `
          background-color: ${theme.errorLight};
          color: ${theme.error};
        `;
      case 'HIGH':
        return `
          background-color: ${theme.warningLight};
          color: ${theme.warning};
        `;
      case 'MEDIUM':
        return `
          background-color: ${theme.infoLight};
          color: ${theme.info};
        `;
      case 'LOW':
        return `
          background-color: ${theme.successLight};
          color: ${theme.success};
        `;
      case 'TRIVIAL':
        return `
          background-color: ${theme.backgroundHover};
          color: ${theme.textSecondary};
        `;
      default:
        return `
          background-color: ${theme.backgroundHover};
          color: ${theme.textSecondary};
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
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;

  ${({ $carga, theme }) => {
    if ($carga <= 2) {
      return `
        background-color: ${theme.successLight};
        color: ${theme.success};
      `;
    } else if ($carga <= 4) {
      return `
        background-color: ${theme.warningLight};
        color: ${theme.warning};
      `;
    } else {
      return `
        background-color: ${theme.errorLight};
        color: ${theme.error};
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

const BandejaEntrada: React.FC = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedEjecutor, setSelectedEjecutor] = useState<number | null>(null);
  const [asignacionNotas, setAsignacionNotas] = useState('');

  // Filtrar solicitudes según los criterios
  const filteredSolicitudes = MOCK_SOLICITUDES.filter(solicitud => {
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

    // Aquí iría la lógica para asignar la solicitud al ejecutor seleccionado
    const ejecutor = MOCK_EJECUTORES.find(e => e.id === selectedEjecutor);

    toast.success(`Solicitud asignada a ${ejecutor?.nombre}`);

    // Cerrar el panel expandido
    setExpandedId(null);
    setSelectedEjecutor(null);
    setAsignacionNotas('');
  };

  const handleRechazar = (solicitudId: number) => {
    // Aquí iría la lógica para rechazar la solicitud
    toast.info('Solicitud rechazada');

    // Cerrar el panel expandido
    setExpandedId(null);
  };

  // Filtrar ejecutores por especialidad según la categoría de la solicitud seleccionada
  const getEjecutoresFiltrados = (solicitudId: number) => {
    const solicitud = MOCK_SOLICITUDES.find(s => s.id === solicitudId);
    if (!solicitud) return MOCK_EJECUTORES;

    // Si la solicitud tiene una categoría específica, filtrar por especialidad
    if (solicitud.categoria) {
      return MOCK_EJECUTORES.filter(
        e => e.especialidad === solicitud.categoria || e.especialidad === 'GENERAL'
      );
    }

    return MOCK_EJECUTORES;
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
          <option value="REQUESTED">Solicitada</option>
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
        <Button>
          <FiFilter size={16} />
          Más filtros
        </Button>
      </FiltersContainer>

      {filteredSolicitudes.length > 0 ? (
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
                  <DetailValue>{solicitud.solicitante}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Categoría:</DetailLabel>
                  <DetailValue>{getCategoryText(solicitud.categoria)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Fecha de creación:</DetailLabel>
                  <DetailValue>{formatDate(solicitud.fechaCreacion)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Fecha límite:</DetailLabel>
                  <DetailValue>{formatDate(solicitud.fechaLimite)}</DetailValue>
                </DetailRow>

                <AsignacionSection>
                  <AsignacionTitle>Asignar a ejecutor</AsignacionTitle>

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
                            <EjecutorName>{ejecutor.nombre}</EjecutorName>
                            <EjecutorMeta>
                              <span>Especialidad: {getCategoryText(ejecutor.especialidad)}</span>
                              <CargaIndicator $carga={ejecutor.cargaActual}>
                                Carga: {ejecutor.cargaActual} tareas
                              </CargaIndicator>
                            </EjecutorMeta>
                          </EjecutorDetails>
                        </EjecutorInfo>
                      </EjecutorItem>
                    ))}
                  </EjecutoresList>

                  <div>
                    <DetailLabel>Notas de asignación:</DetailLabel>
                    <textarea
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        marginTop: '8px',
                        minHeight: '80px'
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
                      disabled={!selectedEjecutor}
                    >
                      <FiUserPlus size={16} />
                      Asignar
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
