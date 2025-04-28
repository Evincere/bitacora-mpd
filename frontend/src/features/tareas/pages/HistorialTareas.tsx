import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiFilter,
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiFileText,
  FiDownload
} from 'react-icons/fi';

// Datos de ejemplo para mostrar en la interfaz
const MOCK_HISTORIAL_TAREAS = [
  {
    id: 101,
    titulo: 'Revisión de contrato de arrendamiento',
    descripcion: 'Revisar el contrato de arrendamiento del caso #12345 para identificar posibles cláusulas abusivas.',
    categoria: 'LEGAL',
    prioridad: 'HIGH',
    fechaAsignacion: '2025-03-15T10:30:00',
    fechaCompletado: '2025-03-20T14:45:00',
    fechaLimite: '2025-03-25',
    estado: 'APPROVED',
    solicitante: 'Juan Pérez',
    asignador: 'Carlos Rodríguez',
    tiempoCompletado: 5, // días
    comentarioAprobacion: 'Excelente trabajo, muy detallado y completo.'
  },
  {
    id: 102,
    titulo: 'Análisis de documentación financiera',
    descripcion: 'Realizar un análisis detallado de la documentación financiera del caso #54321.',
    categoria: 'FINANCIERA',
    prioridad: 'MEDIUM',
    fechaAsignacion: '2025-03-10T09:15:00',
    fechaCompletado: '2025-03-18T11:30:00',
    fechaLimite: '2025-03-20',
    estado: 'APPROVED',
    solicitante: 'María López',
    asignador: 'Carlos Rodríguez',
    tiempoCompletado: 8, // días
    comentarioAprobacion: 'Buen trabajo, aunque podría haber sido más detallado en algunos aspectos.'
  },
  {
    id: 103,
    titulo: 'Preparación de informe pericial',
    descripcion: 'Elaborar un informe pericial sobre las evidencias del caso #67890.',
    categoria: 'TECNICA',
    prioridad: 'CRITICAL',
    fechaAsignacion: '2025-02-25T14:00:00',
    fechaCompletado: '2025-03-05T16:20:00',
    fechaLimite: '2025-03-10',
    estado: 'APPROVED',
    solicitante: 'Pedro Gómez',
    asignador: 'Carlos Rodríguez',
    tiempoCompletado: 8, // días
    comentarioAprobacion: 'Informe muy completo y bien estructurado. Excelente trabajo.'
  },
  {
    id: 104,
    titulo: 'Revisión de expediente administrativo',
    descripcion: 'Revisar el expediente administrativo del caso #13579 para verificar si hay inconsistencias.',
    categoria: 'ADMINISTRATIVA',
    prioridad: 'LOW',
    fechaAsignacion: '2025-02-20T11:45:00',
    fechaCompletado: '2025-02-22T10:15:00',
    fechaLimite: '2025-03-01',
    estado: 'APPROVED',
    solicitante: 'Ana Martínez',
    asignador: 'Carlos Rodríguez',
    tiempoCompletado: 2, // días
    comentarioAprobacion: 'Trabajo rápido y eficiente.'
  },
  {
    id: 105,
    titulo: 'Análisis de jurisprudencia',
    descripcion: 'Realizar un análisis de la jurisprudencia relacionada con el caso #97531.',
    categoria: 'LEGAL',
    prioridad: 'HIGH',
    fechaAsignacion: '2025-02-15T09:30:00',
    fechaCompletado: '2025-02-25T14:10:00',
    fechaLimite: '2025-02-28',
    estado: 'REJECTED',
    solicitante: 'Luis Sánchez',
    asignador: 'Carlos Rodríguez',
    tiempoCompletado: 10, // días
    comentarioRechazo: 'El análisis no incluye casos recientes importantes. Por favor, revisar y completar.'
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

const HeaderActions = styled.div`
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

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const StatFooter = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 8px;
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

const FeedbackBox = styled.div<{ $isPositive: boolean }>`
  background-color: ${({ $isPositive, theme }) =>
    $isPositive ? `${theme.successLight}` : `${theme.errorLight}`};
  border-radius: 4px;
  padding: 12px;
  margin-top: 16px;

  h4 {
    margin: 0 0 8px;
    font-size: 14px;
    color: ${({ $isPositive, theme }) =>
      $isPositive ? theme.success : theme.error};
  }

  p {
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.text};
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${({ theme }) => theme.backgroundAlt};
  color: ${({ theme }) => theme.textSecondary};
  border: none;

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

// Función para formatear fechas con hora
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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

const HistorialTareas: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Calcular estadísticas
  const totalTareas = MOCK_HISTORIAL_TAREAS.length;
  const tareasAprobadas = MOCK_HISTORIAL_TAREAS.filter(t => t.estado === 'APPROVED').length;
  const tareasRechazadas = MOCK_HISTORIAL_TAREAS.filter(t => t.estado === 'REJECTED').length;
  const tiempoPromedioCompletado = MOCK_HISTORIAL_TAREAS.reduce((acc, t) => acc + t.tiempoCompletado, 0) / totalTareas;

  // Filtrar tareas según los criterios
  const filteredTareas = MOCK_HISTORIAL_TAREAS.filter(tarea => {
    const matchesSearch = searchTerm === '' ||
      tarea.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarea.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || tarea.estado === statusFilter;
    const matchesCategory = categoryFilter === '' || tarea.categoria === categoryFilter;

    // Filtro por fecha (simplificado para el ejemplo)
    let matchesDate = true;
    if (dateFilter === 'last-week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const completedDate = new Date(tarea.fechaCompletado);
      matchesDate = completedDate >= oneWeekAgo;
    } else if (dateFilter === 'last-month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const completedDate = new Date(tarea.fechaCompletado);
      matchesDate = completedDate >= oneMonthAgo;
    } else if (dateFilter === 'last-3-months') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const completedDate = new Date(tarea.fechaCompletado);
      matchesDate = completedDate >= threeMonthsAgo;
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDescargarInforme = (id: number) => {
    // Aquí iría la lógica para descargar el informe
    console.log(`Descargando informe de la tarea ${id}`);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Historial de Tareas</PageTitle>
        <HeaderActions>
          <Button>
            <FiDownload size={16} />
            Exportar Historial
          </Button>
        </HeaderActions>
      </PageHeader>

      <StatsContainer>
        <StatCard>
          <StatTitle>Total de Tareas</StatTitle>
          <StatValue>{totalTareas}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Tareas Aprobadas</StatTitle>
          <StatValue>{tareasAprobadas}</StatValue>
          <StatFooter>{((tareasAprobadas / totalTareas) * 100).toFixed(0)}% del total</StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>Tareas Rechazadas</StatTitle>
          <StatValue>{tareasRechazadas}</StatValue>
          <StatFooter>{((tareasRechazadas / totalTareas) * 100).toFixed(0)}% del total</StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>Tiempo Promedio</StatTitle>
          <StatValue>{tiempoPromedioCompletado.toFixed(1)}</StatValue>
          <StatFooter>días por tarea</StatFooter>
        </StatCard>
      </StatsContainer>

      <FiltersContainer>
        <SearchInput>
          <FiSearch size={16} />
          <input
            type="text"
            placeholder="Buscar en historial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="APPROVED">Aprobadas</option>
          <option value="REJECTED">Rechazadas</option>
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
        <FilterSelect
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="">Cualquier fecha</option>
          <option value="last-week">Última semana</option>
          <option value="last-month">Último mes</option>
          <option value="last-3-months">Últimos 3 meses</option>
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
                    {formatDate(tarea.fechaCompletado)}
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
                  <DetailValue>{formatDateTime(tarea.fechaAsignacion)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Fecha de completado:</DetailLabel>
                  <DetailValue>{formatDateTime(tarea.fechaCompletado)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Tiempo completado:</DetailLabel>
                  <DetailValue>{tarea.tiempoCompletado} días</DetailValue>
                </DetailRow>

                {tarea.estado === 'APPROVED' && tarea.comentarioAprobacion && (
                  <FeedbackBox $isPositive={true}>
                    <h4>Comentario de aprobación</h4>
                    <p>{tarea.comentarioAprobacion}</p>
                  </FeedbackBox>
                )}

                {tarea.estado === 'REJECTED' && tarea.comentarioRechazo && (
                  <FeedbackBox $isPositive={false}>
                    <h4>Motivo de rechazo</h4>
                    <p>{tarea.comentarioRechazo}</p>
                  </FeedbackBox>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <ActionButton onClick={() => handleDescargarInforme(tarea.id)}>
                    <FiFileText size={14} />
                    Ver informe completo
                  </ActionButton>
                </div>
              </TareaDetails>
            </TareaCard>
          ))}
        </TareasList>
      ) : (
        <EmptyState>
          <FiAlertCircle size={48} />
          <h3>No se encontraron tareas</h3>
          <p>No hay tareas en el historial que coincidan con los criterios de búsqueda o filtros aplicados.</p>
        </EmptyState>
      )}
    </PageContainer>
  );
};

export default HistorialTareas;
