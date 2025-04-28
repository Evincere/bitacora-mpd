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
  FiPlay,
  FiPause,
  FiCheck,
  FiCalendar,
  FiUser
} from 'react-icons/fi';
import { toast } from 'react-toastify';

// Datos de ejemplo para mostrar en la interfaz
const MOCK_TAREAS = [
  {
    id: 1,
    titulo: 'Revisión de contrato',
    descripcion: 'Revisar el contrato del caso #12345 para identificar posibles cláusulas abusivas.',
    categoria: 'LEGAL',
    prioridad: 'HIGH',
    fechaAsignacion: '2025-05-01T10:30:00',
    fechaLimite: '2025-05-10',
    estado: 'ASSIGNED',
    solicitante: 'Juan Pérez',
    asignador: 'Carlos Rodríguez',
    notas: 'Prestar especial atención a las cláusulas de penalización y rescisión.'
  },
  {
    id: 2,
    titulo: 'Preparación de informe legal',
    descripcion: 'Elaborar un informe legal sobre las implicaciones del caso #54321.',
    categoria: 'LEGAL',
    prioridad: 'MEDIUM',
    fechaAsignacion: '2025-04-28T14:15:00',
    fechaLimite: '2025-05-15',
    estado: 'ASSIGNED',
    solicitante: 'María López',
    asignador: 'Carlos Rodríguez',
    notas: 'Incluir referencias a jurisprudencia reciente.'
  },
  {
    id: 3,
    titulo: 'Análisis de caso',
    descripcion: 'Realizar un análisis detallado del caso #67890 para identificar fortalezas y debilidades.',
    categoria: 'LEGAL',
    prioridad: 'CRITICAL',
    fechaAsignacion: '2025-04-25T09:45:00',
    fechaLimite: '2025-05-05',
    estado: 'IN_PROGRESS',
    solicitante: 'Pedro Gómez',
    asignador: 'Carlos Rodríguez',
    notas: 'Este caso es prioritario debido a la proximidad de la audiencia.',
    progreso: 65
  },
  {
    id: 4,
    titulo: 'Análisis financiero',
    descripcion: 'Realizar un análisis financiero de la documentación del caso #24680.',
    categoria: 'FINANCIERA',
    prioridad: 'MEDIUM',
    fechaAsignacion: '2025-04-20T11:00:00',
    fechaLimite: '2025-05-12',
    estado: 'IN_PROGRESS',
    solicitante: 'Ana Martínez',
    asignador: 'Carlos Rodríguez',
    notas: 'Verificar especialmente los movimientos bancarios de los últimos 6 meses.',
    progreso: 30
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
    background-color: ${({ theme }) => theme.backgroundTertiary};
    color: ${({ theme }) => theme.text};
    font-size: 14px;
    transition: all 0.2s;

    &:focus {
      border-color: ${({ theme }) => theme.primary};
      outline: none;
      box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}30`};
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

const TareasList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TareaCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

const TareaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
`;

const TareaTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TareaMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TareaDate = styled.div`
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

const TareaDetails = styled.div<{ $isOpen: boolean }>`
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

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'success' | 'warning' | 'danger' }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: ${theme.primary};
          color: white;
          &:hover {
            background-color: ${theme.primaryDark};
          }
        `;
      case 'success':
        return `
          background-color: ${theme.success};
          color: white;
          &:hover {
            background-color: ${theme.successDark};
          }
        `;
      case 'warning':
        return `
          background-color: ${theme.warning};
          color: white;
          &:hover {
            background-color: ${theme.warningDark};
          }
        `;
      case 'danger':
        return `
          background-color: ${theme.error};
          color: white;
          &:hover {
            background-color: ${theme.errorDark};
          }
        `;
      default:
        return `
          background-color: ${theme.backgroundAlt};
          color: ${theme.textSecondary};
          &:hover {
            background-color: ${theme.backgroundHover};
            color: ${theme.text};
          }
        `;
    }
  }}
`;

const ProgressContainer = styled.div`
  margin-top: 16px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ProgressLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ProgressValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background-color: ${({ theme }) => theme.primary};
  border-radius: 4px;
  transition: width 0.3s ease;
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

const MisTareas: React.FC = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Filtrar tareas según los criterios
  const filteredTareas = MOCK_TAREAS.filter(tarea => {
    const matchesSearch = searchTerm === '' ||
      tarea.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarea.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || tarea.estado === statusFilter;
    const matchesPriority = priorityFilter === '' || tarea.prioridad === priorityFilter;
    const matchesCategory = categoryFilter === '' || tarea.categoria === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleIniciarTarea = (id: number) => {
    // Aquí iría la lógica para iniciar la tarea
    toast.success('Tarea iniciada correctamente');

    // Cerrar el panel expandido
    setExpandedId(null);
  };

  const handlePausarTarea = (id: number) => {
    // Aquí iría la lógica para pausar la tarea
    toast.info('Tarea pausada');

    // Cerrar el panel expandido
    setExpandedId(null);
  };

  const handleCompletarTarea = (id: number) => {
    // Aquí iría la lógica para completar la tarea
    toast.success('Tarea completada correctamente');

    // Cerrar el panel expandido
    setExpandedId(null);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Mis Tareas</PageTitle>
      </PageHeader>

      <FiltersContainer>
        <SearchInput>
          <FiSearch size={16} />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="ASSIGNED">Asignada</option>
          <option value="IN_PROGRESS">En Progreso</option>
          <option value="COMPLETED">Completada</option>
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

      {filteredTareas.length > 0 ? (
        <TareasList>
          {filteredTareas.map((tarea) => (
            <TareaCard key={tarea.id}>
              <TareaHeader onClick={() => toggleExpand(tarea.id)}>
                <TareaTitle>
                  {tarea.titulo}
                </TareaTitle>
                <TareaMeta>
                  <StatusBadge $status={tarea.estado}>
                    {getStatusIcon(tarea.estado)}
                    {getStatusText(tarea.estado)}
                  </StatusBadge>
                  <PriorityBadge $priority={tarea.prioridad}>
                    {getPriorityText(tarea.prioridad)}
                  </PriorityBadge>
                  <TareaDate>
                    <FiCalendar size={14} />
                    {formatDate(tarea.fechaLimite)}
                  </TareaDate>
                  {expandedId === tarea.id ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                </TareaMeta>
              </TareaHeader>
              <TareaDetails $isOpen={expandedId === tarea.id}>
                <DetailRow>
                  <DetailLabel>Descripción:</DetailLabel>
                  <DetailValue>{tarea.descripcion}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Solicitante:</DetailLabel>
                  <DetailValue>{tarea.solicitante}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Asignador:</DetailLabel>
                  <DetailValue>{tarea.asignador}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Categoría:</DetailLabel>
                  <DetailValue>{getCategoryText(tarea.categoria)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Fecha de asignación:</DetailLabel>
                  <DetailValue>{formatDate(tarea.fechaAsignacion)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Fecha límite:</DetailLabel>
                  <DetailValue>{formatDate(tarea.fechaLimite)}</DetailValue>
                </DetailRow>
                {tarea.notas && (
                  <DetailRow>
                    <DetailLabel>Notas:</DetailLabel>
                    <DetailValue>{tarea.notas}</DetailValue>
                  </DetailRow>
                )}

                {tarea.estado === 'IN_PROGRESS' && tarea.progreso !== undefined && (
                  <ProgressContainer>
                    <ProgressHeader>
                      <ProgressLabel>Progreso</ProgressLabel>
                      <ProgressValue>{tarea.progreso}%</ProgressValue>
                    </ProgressHeader>
                    <ProgressBar>
                      <ProgressFill $percentage={tarea.progreso} />
                    </ProgressBar>
                  </ProgressContainer>
                )}

                <ActionButtons>
                  {tarea.estado === 'ASSIGNED' && (
                    <ActionButton $variant="primary" onClick={() => handleIniciarTarea(tarea.id)}>
                      <FiPlay size={14} />
                      Iniciar tarea
                    </ActionButton>
                  )}
                  {tarea.estado === 'IN_PROGRESS' && (
                    <>
                      <ActionButton $variant="warning" onClick={() => handlePausarTarea(tarea.id)}>
                        <FiPause size={14} />
                        Pausar
                      </ActionButton>
                      <ActionButton $variant="success" onClick={() => handleCompletarTarea(tarea.id)}>
                        <FiCheck size={14} />
                        Completar
                      </ActionButton>
                    </>
                  )}
                  <ActionButton onClick={() => navigate(`/app/tareas/detalle/${tarea.id}`)}>
                    Ver detalles
                  </ActionButton>
                </ActionButtons>
              </TareaDetails>
            </TareaCard>
          ))}
        </TareasList>
      ) : (
        <EmptyState>
          <FiAlertCircle size={48} />
          <h3>No se encontraron tareas</h3>
          <p>No hay tareas que coincidan con los criterios de búsqueda o filtros aplicados.</p>
        </EmptyState>
      )}
    </PageContainer>
  );
};

export default MisTareas;
