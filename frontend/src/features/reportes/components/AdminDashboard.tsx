import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiActivity, 
  FiCheckCircle, 
  FiClock, 
  FiAlertTriangle,
  FiUsers,
  FiPercent,
  FiTrendingUp,
  FiRefreshCw,
  FiDownload
} from 'react-icons/fi';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

import MetricCard from './MetricCard';
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import DataTable, { Badge } from './DataTable';
import DashboardFilters from './DashboardFilters';

import { 
  useDashboardMetrics,
  useTaskStatusMetrics,
  useUserActivityMetrics,
  useCategoryDistribution,
  usePriorityDistribution,
  useTimelineMetrics,
  usePerformanceMetrics
} from '../hooks/useDashboardMetrics';
import { DashboardFilters as FilterType } from '../types/dashboardTypes';

// Estilos
const DashboardContainer = styled.div`
  padding: 20px;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ActionButtons = styled.div`
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
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.cardBackground};
  color: ${({ theme, $primary }) => 
    $primary ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.border};

  &:hover {
    background-color: ${({ theme, $primary }) => 
      $primary ? theme.primaryDark : theme.hoverBackground};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthSection = styled.div`
  margin-bottom: 20px;
`;

const LoadingSpinner = styled(FiRefreshCw)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

/**
 * Componente principal del dashboard administrativo
 */
const AdminDashboard: React.FC = () => {
  // Estado para los filtros
  const [filters, setFilters] = useState<FilterType>({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  
  // Consultas para obtener métricas
  const { 
    data: dashboardMetrics, 
    isLoading: isLoadingDashboard,
    refetch: refetchDashboard
  } = useDashboardMetrics();
  
  const { 
    data: taskStatusMetrics, 
    isLoading: isLoadingTaskStatus 
  } = useTaskStatusMetrics();
  
  const { 
    data: userActivityMetrics, 
    isLoading: isLoadingUserActivity 
  } = useUserActivityMetrics();
  
  const { 
    data: categoryDistribution, 
    isLoading: isLoadingCategories 
  } = useCategoryDistribution();
  
  const { 
    data: priorityDistribution, 
    isLoading: isLoadingPriorities 
  } = usePriorityDistribution();
  
  const { 
    data: timelineMetrics, 
    isLoading: isLoadingTimeline 
  } = useTimelineMetrics(filters.startDate || '', filters.endDate || '');
  
  const { 
    data: performanceMetrics, 
    isLoading: isLoadingPerformance 
  } = usePerformanceMetrics();
  
  // Estado de carga general
  const isLoading = 
    isLoadingDashboard || 
    isLoadingTaskStatus || 
    isLoadingUserActivity || 
    isLoadingCategories || 
    isLoadingPriorities || 
    isLoadingTimeline || 
    isLoadingPerformance;
  
  // Función para aplicar filtros
  const handleApplyFilters = (newFilters: FilterType) => {
    setFilters(newFilters);
  };
  
  // Función para refrescar datos
  const handleRefresh = () => {
    refetchDashboard();
  };
  
  // Función para exportar datos
  const handleExport = () => {
    // Implementar exportación de datos
    alert('Funcionalidad de exportación en desarrollo');
  };
  
  // Renderizar tarjetas de métricas
  const renderMetricCards = () => {
    if (!dashboardMetrics) return null;
    
    return (
      <MetricsGrid>
        <MetricCard
          title="Total de Tareas"
          value={dashboardMetrics.totalTasks}
          icon={FiActivity}
          color="#6366F1"
          change={5.2}
          footerText="vs. mes anterior"
        />
        
        <MetricCard
          title="Tareas Completadas"
          value={dashboardMetrics.completedTasks}
          icon={FiCheckCircle}
          color="#10B981"
          change={8.7}
          footerText="vs. mes anterior"
        />
        
        <MetricCard
          title="Tareas Pendientes"
          value={dashboardMetrics.pendingTasks}
          icon={FiClock}
          color="#F59E0B"
          change={-3.5}
          footerText="vs. mes anterior"
        />
        
        <MetricCard
          title="Tareas Vencidas"
          value={dashboardMetrics.overdueTasksCount}
          icon={FiAlertTriangle}
          color="#EF4444"
          change={-2.1}
          footerText="vs. mes anterior"
        />
        
        <MetricCard
          title="Tiempo Promedio de Finalización"
          value={dashboardMetrics.averageCompletionTime}
          icon={FiClock}
          color="#8B5CF6"
          format="time"
          change={-10.3}
          footerText="vs. mes anterior"
        />
        
        <MetricCard
          title="Usuarios Activos"
          value={dashboardMetrics.activeUsers}
          icon={FiUsers}
          color="#3B82F6"
          change={12.5}
          footerText="vs. mes anterior"
        />
        
        <MetricCard
          title="Tasa de Finalización"
          value={dashboardMetrics.taskCompletionRate}
          icon={FiPercent}
          color="#059669"
          format="percentage"
          change={3.8}
          footerText="vs. mes anterior"
        />
        
        <MetricCard
          title="Tasa de Creación Diaria"
          value={dashboardMetrics.taskCreationRate}
          icon={FiTrendingUp}
          color="#6366F1"
          change={7.2}
          footerText="vs. mes anterior"
        />
      </MetricsGrid>
    );
  };
  
  // Renderizar gráficos de estado de tareas
  const renderTaskStatusCharts = () => {
    if (!taskStatusMetrics) return null;
    
    const statusColors = {
      PENDING: '#F59E0B',
      ASSIGNED: '#3B82F6',
      IN_PROGRESS: '#8B5CF6',
      COMPLETED: '#10B981'
    };
    
    return (
      <ChartsGrid>
        <PieChart
          title="Distribución de Estados de Tareas"
          labels={taskStatusMetrics.statusDistribution.map(item => item.status)}
          data={taskStatusMetrics.statusDistribution.map(item => item.count)}
          backgroundColor={taskStatusMetrics.statusDistribution.map(item => statusColors[item.status as keyof typeof statusColors] || '#6B7280')}
          doughnut
        />
        
        <BarChart
          title="Estados por Categoría"
          labels={taskStatusMetrics.statusByCategory.map(item => item.category)}
          datasets={[
            {
              label: 'Pendientes',
              data: taskStatusMetrics.statusByCategory.map(item => item.counts.PENDING || 0),
              backgroundColor: statusColors.PENDING
            },
            {
              label: 'Asignadas',
              data: taskStatusMetrics.statusByCategory.map(item => item.counts.ASSIGNED || 0),
              backgroundColor: statusColors.ASSIGNED
            },
            {
              label: 'En Progreso',
              data: taskStatusMetrics.statusByCategory.map(item => item.counts.IN_PROGRESS || 0),
              backgroundColor: statusColors.IN_PROGRESS
            },
            {
              label: 'Completadas',
              data: taskStatusMetrics.statusByCategory.map(item => item.counts.COMPLETED || 0),
              backgroundColor: statusColors.COMPLETED
            }
          ]}
          stacked
        />
      </ChartsGrid>
    );
  };
  
  // Renderizar gráficos de actividad de usuarios
  const renderUserActivityCharts = () => {
    if (!userActivityMetrics) return null;
    
    return (
      <ChartsGrid>
        <LineChart
          title="Actividad de Usuarios en el Tiempo"
          labels={userActivityMetrics.userActivityTimeline.map(item => format(new Date(item.date), 'dd MMM', { locale: es }))}
          datasets={[
            {
              label: 'Usuarios Activos',
              data: userActivityMetrics.userActivityTimeline.map(item => item.activeUsers),
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true
            },
            {
              label: 'Tareas Creadas',
              data: userActivityMetrics.userActivityTimeline.map(item => item.tasksCreated),
              borderColor: '#8B5CF6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              fill: true
            },
            {
              label: 'Tareas Completadas',
              data: userActivityMetrics.userActivityTimeline.map(item => item.tasksCompleted),
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true
            }
          ]}
        />
        
        <PieChart
          title="Distribución de Roles de Usuario"
          labels={userActivityMetrics.userRoleDistribution.map(item => item.role)}
          data={userActivityMetrics.userRoleDistribution.map(item => item.count)}
          backgroundColor={[
            '#3B82F6', // ADMIN
            '#8B5CF6', // ASIGNADOR
            '#10B981', // EJECUTOR
            '#F59E0B'  // SOLICITANTE
          ]}
        />
      </ChartsGrid>
    );
  };
  
  // Renderizar tabla de usuarios más activos
  const renderTopUsersTable = () => {
    if (!userActivityMetrics) return null;
    
    return (
      <FullWidthSection>
        <DataTable
          title="Usuarios Más Activos"
          columns={[
            { id: 'fullName', label: 'Nombre', sortable: true },
            { id: 'username', label: 'Usuario', sortable: true },
            { 
              id: 'tasksCompleted', 
              label: 'Tareas Completadas', 
              sortable: true,
              render: (value) => <strong>{value}</strong>
            },
            { 
              id: 'tasksAssigned', 
              label: 'Tareas Asignadas', 
              sortable: true 
            },
            { 
              id: 'completionRate', 
              label: 'Tasa de Finalización', 
              sortable: true,
              render: (value, row) => {
                const rate = Math.round((row.tasksCompleted / row.tasksAssigned) * 100);
                let color = '#10B981';
                if (rate < 70) color = '#EF4444';
                else if (rate < 90) color = '#F59E0B';
                
                return <Badge $color={color}>{rate}%</Badge>;
              }
            }
          ]}
          data={userActivityMetrics.topActiveUsers.map(user => ({
            ...user,
            completionRate: (user.tasksCompleted / user.tasksAssigned) * 100
          }))}
          sortColumn="tasksCompleted"
          sortDirection="desc"
        />
      </FullWidthSection>
    );
  };
  
  // Renderizar gráficos de distribución de categorías y prioridades
  const renderDistributionCharts = () => {
    if (!categoryDistribution || !priorityDistribution) return null;
    
    return (
      <ChartsGrid>
        <BarChart
          title="Distribución de Categorías"
          labels={categoryDistribution.categories.map(item => item.name)}
          datasets={[
            {
              label: 'Tareas',
              data: categoryDistribution.categories.map(item => item.count),
              backgroundColor: '#6366F1'
            }
          ]}
          horizontal
        />
        
        <BarChart
          title="Distribución de Prioridades"
          labels={priorityDistribution.priorities.map(item => item.name)}
          datasets={[
            {
              label: 'Tareas',
              data: priorityDistribution.priorities.map(item => item.count),
              backgroundColor: [
                '#EF4444', // ALTA
                '#F59E0B', // MEDIA
                '#10B981'  // BAJA
              ]
            }
          ]}
          horizontal
        />
      </ChartsGrid>
    );
  };
  
  // Renderizar gráfico de línea de tiempo
  const renderTimelineChart = () => {
    if (!timelineMetrics) return null;
    
    return (
      <FullWidthSection>
        <LineChart
          title="Creación y Finalización de Tareas en el Tiempo"
          labels={timelineMetrics.taskCreationTimeline.map(item => format(new Date(item.date), 'dd MMM', { locale: es }))}
          datasets={[
            {
              label: 'Tareas Creadas',
              data: timelineMetrics.taskCreationTimeline.map(item => item.count),
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true
            },
            {
              label: 'Tareas Completadas',
              data: timelineMetrics.taskCompletionTimeline.map(item => item.count),
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true
            }
          ]}
        />
      </FullWidthSection>
    );
  };
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>
          <FiActivity size={24} />
          Dashboard Administrativo
        </Title>
        
        <ActionButtons>
          <Button onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner size={16} />
                Cargando...
              </>
            ) : (
              <>
                <FiRefreshCw size={16} />
                Actualizar
              </>
            )}
          </Button>
          
          <Button onClick={handleExport}>
            <FiDownload size={16} />
            Exportar
          </Button>
        </ActionButtons>
      </DashboardHeader>
      
      <DashboardFilters
        categories={categoryDistribution?.categories || []}
        priorities={priorityDistribution?.priorities || []}
        statuses={taskStatusMetrics?.statusDistribution || []}
        users={userActivityMetrics?.topActiveUsers || []}
        initialFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
      
      {renderMetricCards()}
      {renderTaskStatusCharts()}
      {renderUserActivityCharts()}
      {renderTopUsersTable()}
      {renderDistributionCharts()}
      {renderTimelineChart()}
    </DashboardContainer>
  );
};

export default AdminDashboard;
