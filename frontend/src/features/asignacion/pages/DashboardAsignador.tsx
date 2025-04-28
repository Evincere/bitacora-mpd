import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  FiInbox,
  FiUsers,
  FiPieChart,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiFileText,
  FiArrowRight,
  FiRefreshCw,
  FiFilter
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Componentes
import { StatusBadge } from '@/shared/components/ui';
import { Button } from '@/components/ui';

// Hooks y servicios
import useAsignacion from '../hooks/useAsignacion';

// Tipos
import { Activity, ActivityStatus } from '@/types/models';

// Datos de ejemplo (se reemplazarán por datos reales del backend)
const MOCK_SOLICITUDES = [
  {
    id: 1,
    title: 'Solicitud de informe técnico',
    description: 'Necesito un informe técnico sobre el caso #12345 para presentar en la audiencia del próximo mes.',
    category: 'LEGAL',
    priority: 'HIGH',
    requestDate: '2025-05-01T10:30:00',
    dueDate: '2025-05-15',
    status: 'REQUESTED',
    requesterName: 'Juan Pérez',
    assignerName: null,
    executorName: null
  },
  {
    id: 2,
    title: 'Análisis de documentación',
    description: 'Requiero un análisis detallado de la documentación presentada por la contraparte en el caso #54321.',
    category: 'LEGAL',
    priority: 'MEDIUM',
    requestDate: '2025-04-28T14:15:00',
    dueDate: '2025-05-10',
    status: 'REQUESTED',
    requesterName: 'María López',
    assignerName: null,
    executorName: null
  },
  {
    id: 3,
    title: 'Revisión de contrato',
    description: 'Necesito una revisión del contrato de arrendamiento para el local comercial.',
    category: 'LEGAL',
    priority: 'LOW',
    requestDate: '2025-04-25T09:45:00',
    dueDate: '2025-05-05',
    status: 'REQUESTED',
    requesterName: 'Pedro Gómez',
    assignerName: null,
    executorName: null
  }
];

// Datos de ejemplo para distribución de carga
const MOCK_DISTRIBUCION_CARGA = [
  { executorName: 'Ana Martínez', assignedTasks: 5, completedTasks: 3, pendingTasks: 2 },
  { executorName: 'Luis Sánchez', assignedTasks: 8, completedTasks: 4, pendingTasks: 4 },
  { executorName: 'María López', assignedTasks: 3, completedTasks: 2, pendingTasks: 1 },
  { executorName: 'Pedro Gómez', assignedTasks: 6, completedTasks: 5, pendingTasks: 1 }
];

// Estilos
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

const RefreshButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
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
  display: flex;
  align-items: center;
  gap: 8px;
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

const SectionTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ContentSection = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const SolicitudesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SolicitudItem = styled.div`
  background-color: ${({ theme }) => theme.backgroundPrimary};
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

const SolicitudHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SolicitudTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const SolicitudMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SolicitudDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SolicitudDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SolicitudFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`;

const SolicitudRequester = styled.div`
  color: ${({ theme }) => theme.textSecondary};
`;

const SolicitudAction = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
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

const WorkloadTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const TableRow = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const TableCell = styled.td`
  padding: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme.borderLight};
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 4px;
`;

const ProgressFill = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background-color: ${({ $color }) => $color};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

// Funciones auxiliares
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha inválida';
  }
};

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

const DashboardAsignador: React.FC = () => {
  const navigate = useNavigate();
  
  // Usar el hook personalizado para asignaciones
  const {
    pendingRequests,
    assignedTasksByExecutor,
    workloadDistribution,
    isLoadingPendingRequests,
    isLoadingAssignedTasks,
    isLoadingWorkload,
    refreshAllData
  } = useAsignacion();

  // Estado para filtros
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  // Usar datos reales o de ejemplo
  const solicitudes = pendingRequests || MOCK_SOLICITUDES;
  const distribucionCarga = workloadDistribution || MOCK_DISTRIBUCION_CARGA;

  // Filtrar solicitudes
  const filteredSolicitudes = solicitudes.filter(solicitud => {
    if (categoryFilter && solicitud.category !== categoryFilter) return false;
    if (priorityFilter && solicitud.priority !== priorityFilter) return false;
    return true;
  });

  // Calcular estadísticas
  const totalSolicitudesPendientes = solicitudes.length;
  const solicitudesUrgentes = solicitudes.filter(s => s.priority === 'CRITICAL' || s.priority === 'HIGH').length;
  const solicitudesVencidas = solicitudes.filter(s => {
    if (!s.dueDate) return false;
    return new Date(s.dueDate) < new Date();
  }).length;

  // Obtener categorías únicas para el filtro
  const uniqueCategories = Array.from(new Set(solicitudes.map(s => s.category)));
  
  // Obtener prioridades únicas para el filtro
  const uniquePriorities = Array.from(new Set(solicitudes.map(s => s.priority)));

  const handleRefresh = () => {
    refreshAllData();
  };

  const handleAsignarSolicitud = (id: number) => {
    navigate(`/app/asignacion/asignar/${id}`);
  };

  const handleVerDistribucion = () => {
    navigate('/app/asignacion/distribucion');
  };

  const handleVerMetricas = () => {
    navigate('/app/asignacion/metricas');
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Dashboard de Asignación</PageTitle>
        <RefreshButton onClick={handleRefresh}>
          <FiRefreshCw size={16} />
          Actualizar datos
        </RefreshButton>
      </PageHeader>

      <StatsContainer>
        <StatCard>
          <StatTitle>
            <FiInbox size={16} />
            Solicitudes Pendientes
          </StatTitle>
          <StatValue>{totalSolicitudesPendientes}</StatValue>
          <StatFooter>
            {solicitudesUrgentes} urgentes, {solicitudesVencidas} vencidas
          </StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiUsers size={16} />
            Ejecutores Activos
          </StatTitle>
          <StatValue>{distribucionCarga.length}</StatValue>
          <StatFooter>
            {distribucionCarga.reduce((acc, curr) => acc + curr.pendingTasks, 0)} tareas pendientes
          </StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiPieChart size={16} />
            Distribución de Carga
          </StatTitle>
          <StatValue>
            {distribucionCarga.length > 0
              ? (distribucionCarga.reduce((acc, curr) => acc + curr.pendingTasks, 0) / distribucionCarga.length).toFixed(1)
              : '0'}
          </StatValue>
          <StatFooter>tareas por ejecutor (promedio)</StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiClock size={16} />
            Tiempo Promedio de Asignación
          </StatTitle>
          <StatValue>1.2</StatValue>
          <StatFooter>días desde la solicitud</StatFooter>
        </StatCard>
      </StatsContainer>

      <ContentGrid>
        <ContentSection>
          <SectionTitle>
            <FiInbox size={18} />
            Bandeja de Entrada
          </SectionTitle>
          
          <FilterContainer>
            <FilterSelect 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </FilterSelect>
            
            <FilterSelect 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">Todas las prioridades</option>
              {uniquePriorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </FilterSelect>
          </FilterContainer>
          
          {filteredSolicitudes.length > 0 ? (
            <SolicitudesList>
              {filteredSolicitudes.map((solicitud) => (
                <SolicitudItem key={solicitud.id} onClick={() => handleAsignarSolicitud(solicitud.id)}>
                  <SolicitudHeader>
                    <SolicitudTitle>{solicitud.title}</SolicitudTitle>
                    <SolicitudMeta>
                      <StatusBadge $status={solicitud.status}>
                        {getStatusIcon(solicitud.status)}
                        {getStatusText(solicitud.status)}
                      </StatusBadge>
                      <SolicitudDate>
                        <FiCalendar size={12} />
                        {formatDate(solicitud.requestDate)}
                      </SolicitudDate>
                    </SolicitudMeta>
                  </SolicitudHeader>
                  <SolicitudDescription>{solicitud.description}</SolicitudDescription>
                  <SolicitudFooter>
                    <SolicitudRequester>Solicitante: {solicitud.requesterName}</SolicitudRequester>
                    <SolicitudAction>
                      Asignar
                      <FiArrowRight size={14} />
                    </SolicitudAction>
                  </SolicitudFooter>
                </SolicitudItem>
              ))}
              
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Button onClick={() => navigate('/app/asignacion/bandeja')}>
                  Ver todas las solicitudes
                </Button>
              </div>
            </SolicitudesList>
          ) : (
            <EmptyState>
              <FiInbox size={48} />
              <h3>No hay solicitudes pendientes</h3>
              <p>Todas las solicitudes han sido asignadas.</p>
            </EmptyState>
          )}
        </ContentSection>

        <ContentSection>
          <SectionTitle>
            <FiUsers size={18} />
            Distribución de Carga
          </SectionTitle>
          
          <WorkloadTable>
            <thead>
              <tr>
                <TableHeader>Ejecutor</TableHeader>
                <TableHeader>Asignadas</TableHeader>
                <TableHeader>Pendientes</TableHeader>
                <TableHeader>Carga</TableHeader>
              </tr>
            </thead>
            <tbody>
              {distribucionCarga.map((ejecutor, index) => {
                const cargaPorcentaje = (ejecutor.pendingTasks / Math.max(...distribucionCarga.map(e => e.pendingTasks))) * 100;
                let color = '#4CAF50'; // Verde para carga baja
                if (cargaPorcentaje > 75) color = '#F44336'; // Rojo para carga alta
                else if (cargaPorcentaje > 50) color = '#FF9800'; // Naranja para carga media
                
                return (
                  <TableRow key={index}>
                    <TableCell>{ejecutor.executorName}</TableCell>
                    <TableCell>{ejecutor.assignedTasks}</TableCell>
                    <TableCell>{ejecutor.pendingTasks}</TableCell>
                    <TableCell>
                      <ProgressBar>
                        <ProgressFill $percentage={cargaPorcentaje} $color={color} />
                      </ProgressBar>
                    </TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </WorkloadTable>
          
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Button onClick={handleVerDistribucion}>
              Ver distribución detallada
            </Button>
          </div>
          
          <SectionTitle style={{ marginTop: '24px' }}>
            <FiPieChart size={18} />
            Métricas de Asignación
          </SectionTitle>
          
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Button onClick={handleVerMetricas}>
              Ver métricas detalladas
            </Button>
          </div>
        </ContentSection>
      </ContentGrid>
    </PageContainer>
  );
};

export default DashboardAsignador;
