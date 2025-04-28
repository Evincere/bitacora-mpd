import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiUsers, 
  FiFilter, 
  FiSearch, 
  FiBarChart2, 
  FiCheckCircle, 
  FiClock,
  FiAlertCircle,
  FiUser,
  FiCalendar,
  FiList
} from 'react-icons/fi';

// Datos de ejemplo para los ejecutores
const MOCK_EJECUTORES = [
  { 
    id: 1, 
    nombre: 'Ana Martínez', 
    cargaActual: 3, 
    especialidad: 'LEGAL',
    tareas: [
      { id: 101, titulo: 'Revisión de contrato', prioridad: 'HIGH', fechaLimite: '2025-05-10', estado: 'IN_PROGRESS' },
      { id: 102, titulo: 'Preparación de informe legal', prioridad: 'MEDIUM', fechaLimite: '2025-05-15', estado: 'ASSIGNED' },
      { id: 103, titulo: 'Análisis de caso', prioridad: 'CRITICAL', fechaLimite: '2025-05-05', estado: 'IN_PROGRESS' }
    ]
  },
  { 
    id: 2, 
    nombre: 'Luis Sánchez', 
    cargaActual: 2, 
    especialidad: 'LEGAL',
    tareas: [
      { id: 201, titulo: 'Preparación de presentación', prioridad: 'HIGH', fechaLimite: '2025-05-08', estado: 'IN_PROGRESS' },
      { id: 202, titulo: 'Revisión de expediente', prioridad: 'MEDIUM', fechaLimite: '2025-05-20', estado: 'ASSIGNED' }
    ]
  },
  { 
    id: 3, 
    nombre: 'María López', 
    cargaActual: 1, 
    especialidad: 'FINANCIERA',
    tareas: [
      { id: 301, titulo: 'Análisis financiero', prioridad: 'MEDIUM', fechaLimite: '2025-05-12', estado: 'IN_PROGRESS' }
    ]
  },
  { 
    id: 4, 
    nombre: 'Pedro Gómez', 
    cargaActual: 4, 
    especialidad: 'TECNICA',
    tareas: [
      { id: 401, titulo: 'Informe técnico', prioridad: 'CRITICAL', fechaLimite: '2025-05-03', estado: 'IN_PROGRESS' },
      { id: 402, titulo: 'Evaluación de evidencias', prioridad: 'HIGH', fechaLimite: '2025-05-07', estado: 'IN_PROGRESS' },
      { id: 403, titulo: 'Dictamen pericial', prioridad: 'MEDIUM', fechaLimite: '2025-05-18', estado: 'ASSIGNED' },
      { id: 404, titulo: 'Análisis de documentación', prioridad: 'LOW', fechaLimite: '2025-05-25', estado: 'ASSIGNED' }
    ]
  },
  { 
    id: 5, 
    nombre: 'Sofía Rodríguez', 
    cargaActual: 2, 
    especialidad: 'ADMINISTRATIVA',
    tareas: [
      { id: 501, titulo: 'Revisión de expediente administrativo', prioridad: 'HIGH', fechaLimite: '2025-05-09', estado: 'IN_PROGRESS' },
      { id: 502, titulo: 'Organización de documentación', prioridad: 'LOW', fechaLimite: '2025-05-22', estado: 'ASSIGNED' }
    ]
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
  display: flex;
  align-items: center;
  gap: 12px;
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

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  color: ${({ theme }) => theme.textSecondary};
  border: 1px solid ${({ theme }) => theme.border};

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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

const DistribucionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const EjecutorCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

const EjecutorHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const EjecutorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => `${theme.primary}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
`;

const EjecutorInfo = styled.div`
  flex: 1;
`;

const EjecutorName = styled.h3`
  margin: 0 0 4px;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

const EjecutorMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 13px;
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

const EjecutorContent = styled.div`
  padding: 16px;
`;

const TareasList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TareaItem = styled.div`
  padding: 10px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-left: 3px solid ${({ theme }) => theme.border};
  
  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const TareaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const TareaTitulo = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const TareaMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const TareaFecha = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PriorityBadge = styled.span<{ $priority: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
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

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
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

const EmptyTareas = styled.div`
  padding: 20px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const ProgressBar = styled.div`
  height: 6px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 3px;
  margin-top: 12px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background-color: ${({ $color }) => $color};
  transition: width 0.3s ease;
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
      return <FiClock size={12} />;
    case 'ASSIGNED':
      return <FiClock size={12} />;
    case 'IN_PROGRESS':
      return <FiClock size={12} />;
    case 'COMPLETED':
      return <FiCheckCircle size={12} />;
    case 'APPROVED':
      return <FiCheckCircle size={12} />;
    case 'REJECTED':
      return <FiAlertCircle size={12} />;
    default:
      return <FiAlertCircle size={12} />;
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

// Función para obtener el color de progreso según la carga
const getProgressColor = (carga: number) => {
  if (carga <= 2) return '#10b981'; // success
  if (carga <= 4) return '#f59e0b'; // warning
  return '#ef4444'; // error
};

const DistribucionCarga: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [especialidadFilter, setEspecialidadFilter] = useState('');

  // Calcular estadísticas
  const totalEjecutores = MOCK_EJECUTORES.length;
  const totalTareas = MOCK_EJECUTORES.reduce((acc, ejecutor) => acc + ejecutor.tareas.length, 0);
  const tareasEnProgreso = MOCK_EJECUTORES.reduce(
    (acc, ejecutor) => acc + ejecutor.tareas.filter(t => t.estado === 'IN_PROGRESS').length, 
    0
  );
  const tareasAsignadas = MOCK_EJECUTORES.reduce(
    (acc, ejecutor) => acc + ejecutor.tareas.filter(t => t.estado === 'ASSIGNED').length, 
    0
  );
  const cargaPromedio = totalTareas / totalEjecutores;

  // Filtrar ejecutores según los criterios
  const filteredEjecutores = MOCK_EJECUTORES.filter(ejecutor => {
    const matchesSearch = searchTerm === '' || 
      ejecutor.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEspecialidad = especialidadFilter === '' || ejecutor.especialidad === especialidadFilter;
    
    return matchesSearch && matchesEspecialidad;
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <FiUsers size={24} />
          Distribución de Carga de Trabajo
        </PageTitle>
      </PageHeader>

      <StatsContainer>
        <StatCard>
          <StatTitle>Total de Ejecutores</StatTitle>
          <StatValue>{totalEjecutores}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total de Tareas</StatTitle>
          <StatValue>{totalTareas}</StatValue>
          <StatFooter>
            {tareasEnProgreso} en progreso, {tareasAsignadas} asignadas
          </StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>Carga Promedio</StatTitle>
          <StatValue>{cargaPromedio.toFixed(1)}</StatValue>
          <StatFooter>tareas por ejecutor</StatFooter>
        </StatCard>
      </StatsContainer>

      <FiltersContainer>
        <SearchInput>
          <FiSearch size={16} />
          <input
            type="text"
            placeholder="Buscar ejecutores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
        <FilterSelect
          value={especialidadFilter}
          onChange={(e) => setEspecialidadFilter(e.target.value)}
        >
          <option value="">Todas las especialidades</option>
          <option value="ADMINISTRATIVA">Administrativa</option>
          <option value="LEGAL">Legal</option>
          <option value="TECNICA">Técnica</option>
          <option value="FINANCIERA">Financiera</option>
          <option value="RECURSOS_HUMANOS">Recursos Humanos</option>
        </FilterSelect>
        <Button>
          <FiFilter size={16} />
          Más filtros
        </Button>
      </FiltersContainer>

      <DistribucionGrid>
        {filteredEjecutores.map((ejecutor) => (
          <EjecutorCard key={ejecutor.id}>
            <EjecutorHeader>
              <EjecutorAvatar>
                <FiUser size={20} />
              </EjecutorAvatar>
              <EjecutorInfo>
                <EjecutorName>{ejecutor.nombre}</EjecutorName>
                <EjecutorMeta>
                  <span>Especialidad: {ejecutor.especialidad}</span>
                  <CargaIndicator $carga={ejecutor.cargaActual}>
                    {ejecutor.cargaActual} tareas
                  </CargaIndicator>
                </EjecutorMeta>
              </EjecutorInfo>
            </EjecutorHeader>
            <EjecutorContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>
                  <FiList size={14} style={{ marginRight: '6px' }} />
                  Tareas asignadas
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {ejecutor.tareas.length} tareas
                </div>
              </div>
              
              <ProgressBar>
                <ProgressFill 
                  $percentage={(ejecutor.cargaActual / 5) * 100} 
                  $color={getProgressColor(ejecutor.cargaActual)} 
                />
              </ProgressBar>
              
              {ejecutor.tareas.length > 0 ? (
                <TareasList>
                  {ejecutor.tareas.map((tarea) => (
                    <TareaItem key={tarea.id}>
                      <TareaHeader>
                        <TareaTitulo>{tarea.titulo}</TareaTitulo>
                        <PriorityBadge $priority={tarea.prioridad}>
                          {getPriorityText(tarea.prioridad)}
                        </PriorityBadge>
                      </TareaHeader>
                      <TareaMeta>
                        <TareaFecha>
                          <FiCalendar size={12} />
                          {formatDate(tarea.fechaLimite)}
                        </TareaFecha>
                        <StatusBadge $status={tarea.estado}>
                          {getStatusIcon(tarea.estado)}
                          {getStatusText(tarea.estado)}
                        </StatusBadge>
                      </TareaMeta>
                    </TareaItem>
                  ))}
                </TareasList>
              ) : (
                <EmptyTareas>
                  No hay tareas asignadas
                </EmptyTareas>
              )}
            </EjecutorContent>
          </EjecutorCard>
        ))}
      </DistribucionGrid>
    </PageContainer>
  );
};

export default DistribucionCarga;
