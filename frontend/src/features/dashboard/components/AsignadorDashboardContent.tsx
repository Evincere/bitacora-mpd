/**
 * @file AsignadorDashboardContent component
 * @description Dashboard content specific to ASIGNADOR role
 */

import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  FiInbox,
  FiUsers,
  FiPieChart,
  FiClock,
  FiBarChart2,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import useSmartDashboardData from '../hooks/useSmartDashboardData';
import StatisticsCard from './StatisticsCard';
import TaskList from './TaskList';
import MetricsChart from './MetricsChart';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
import { useAsignacion } from '@/features/asignacion/hooks/useAsignacion';
import { useRealTimeNotifications } from '@/features/notifications/hooks/useRealTimeNotifications';
import { toast } from 'react-toastify';

// Styled components
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const WorkloadTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const TableRow = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.backgroundTertiary};
  border-radius: 4px;
  overflow: hidden;
`;

interface ProgressFillProps {
  $percentage: number;
  $color: string;
}

const ProgressFill = styled.div<ProgressFillProps>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background-color: ${({ $color }) => $color};
  border-radius: 4px;
`;

/**
 * AsignadorDashboardContent component
 * @returns {JSX.Element} The AsignadorDashboardContent component
 */
const AsignadorDashboardContent: React.FC = () => {
  const { data, isLoading, error } = useSmartDashboardData();

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

  // Usar el hook de notificaciones en tiempo real
  const { notifications } = useRealTimeNotifications();

  // Efecto para mostrar notificaciones cuando una tarea es completada
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      // Buscar notificaciones de tareas completadas
      const completedTaskNotifications = notifications.filter(
        notification => notification.type === 'TASK_COMPLETED' && !notification.read
      );

      // Mostrar notificaciones de tareas completadas
      completedTaskNotifications.forEach(notification => {
        toast.success(
          <div>
            <strong>Tarea completada</strong>
            <p>{notification.message}</p>
          </div>,
          { autoClose: 5000 }
        );
      });
    }
  }, [notifications]);

  // Efecto para actualizar los datos cuando se monta el componente
  useEffect(() => {
    refreshAllData();
  }, []);

  // Calculate urgent requests
  const urgentRequests = React.useMemo(() => {
    if (!pendingRequests?.taskRequests) return 0;

    return pendingRequests.taskRequests.filter((request: any) =>
      request.priority === 'CRITICAL' || request.priority === 'HIGH'
    ).length;
  }, [pendingRequests]);

  // Calculate overdue requests
  const overdueRequests = React.useMemo(() => {
    if (!pendingRequests?.taskRequests) return 0;

    return pendingRequests.taskRequests.filter((request: any) => {
      if (!request.dueDate) return false;
      return new Date(request.dueDate) < new Date();
    }).length;
  }, [pendingRequests]);

  // Calcular estadísticas de ejecutores
  const activeExecutors = React.useMemo(() => {
    return workloadDistribution?.length || 0;
  }, [workloadDistribution]);

  // Calcular tareas pendientes totales
  const totalPendingTasks = React.useMemo(() => {
    if (!workloadDistribution) return 0;
    return workloadDistribution.reduce((acc, curr) => acc + (curr.pendingTasks || 0), 0);
  }, [workloadDistribution]);

  // Calcular promedio de tareas por ejecutor
  const averageWorkload = React.useMemo(() => {
    if (!workloadDistribution || workloadDistribution.length === 0) return 0;
    return totalPendingTasks / workloadDistribution.length;
  }, [workloadDistribution, totalPendingTasks]);

  // Calcular tareas completadas recientemente (últimos 7 días)
  const recentlyCompletedTasks = React.useMemo(() => {
    if (!assignedTasksByExecutor) return 0;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let completedCount = 0;

    assignedTasksByExecutor.forEach(ejecutor => {
      ejecutor.tareas.forEach(tarea => {
        if (tarea.estado === 'COMPLETED' || tarea.estado === 'APPROVED') {
          // Si no tenemos fecha de completado, asumimos que es reciente
          completedCount++;
        }
      });
    });

    return completedCount;
  }, [assignedTasksByExecutor]);

  return (
    <ContentContainer>
      <StatsGrid>
        <StatisticsCard
          title="Solicitudes Pendientes"
          value={pendingRequests?.taskRequests?.length || 0}
          icon={<FiInbox size={20} />}
          color="#FF3366"
          isLoading={isLoadingPendingRequests}
          footer={`${urgentRequests || 0} urgentes, ${overdueRequests || 0} vencidas`}
        />
        <StatisticsCard
          title="Ejecutores Activos"
          value={activeExecutors}
          icon={<FiUsers size={20} />}
          color="#6C5CE7"
          isLoading={isLoadingWorkload}
          footer={`${totalPendingTasks} tareas pendientes`}
        />
        <StatisticsCard
          title="Distribución de Carga"
          value={averageWorkload.toFixed(1)}
          icon={<FiPieChart size={20} />}
          color="#00B8D4"
          isLoading={isLoadingWorkload}
          footer="tareas por ejecutor"
        />
        <StatisticsCard
          title="Tareas Completadas"
          value={recentlyCompletedTasks}
          icon={<FiCheckCircle size={20} />}
          color="#4CD964"
          isLoading={isLoadingAssignedTasks}
          footer="en los últimos 7 días"
        />
      </StatsGrid>

      <ContentGrid>
        <TaskList
          title="Solicitudes Pendientes de Asignación"
          icon={<FiInbox size={18} />}
          items={pendingRequests?.taskRequests || []}
          viewAllLink="/app/asignacion/bandeja"
          viewAllLabel="Ver todas las solicitudes"
          emptyMessage="No hay solicitudes pendientes"
          isLoading={isLoadingPendingRequests}
          type="assignment"
        />

        <ContentGrid style={{ gridTemplateColumns: '1fr' }}>
          <MetricsChart
            title="Distribución de Carga de Trabajo"
            icon={<FiUsers size={18} />}
            type="bar"
            isLoading={isLoadingWorkload}
            isEmpty={!workloadDistribution || workloadDistribution.length === 0}
          >
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
                {workloadDistribution && workloadDistribution.map((ejecutor: any, index: number) => {
                  // Calculate workload percentage
                  const maxTasks = Math.max(...workloadDistribution.map((e: any) => e.pendingTasks || 0), 1);
                  const cargaPorcentaje = maxTasks > 0 ? ((ejecutor.pendingTasks || 0) / maxTasks) * 100 : 0;

                  // Determine color based on percentage
                  let color = '#4CD964'; // Green for low workload
                  if (cargaPorcentaje > 75) {
                    color = '#FF3366'; // Red for high workload
                  } else if (cargaPorcentaje > 50) {
                    color = '#FFCC00'; // Yellow for medium workload
                  }

                  return (
                    <TableRow key={index}>
                      <TableCell>{ejecutor.executorName}</TableCell>
                      <TableCell>{ejecutor.assignedTasks || 0}</TableCell>
                      <TableCell>{ejecutor.pendingTasks || 0}</TableCell>
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
          </MetricsChart>

          <MetricsChart
            title="Métricas de Asignación"
            icon={<FiBarChart2 size={18} />}
            type="bar"
            isLoading={isLoadingPendingRequests || isLoadingAssignedTasks}
            isEmpty={false}
          >
            {(() => {
              // Calcular estadísticas para el gráfico
              const pendientes = pendingRequests?.taskRequests?.length || 0;

              // Contar tareas por estado
              let asignadas = 0;
              let enProgreso = 0;
              let completadas = 0;

              if (assignedTasksByExecutor) {
                assignedTasksByExecutor.forEach(ejecutor => {
                  ejecutor.tareas.forEach(tarea => {
                    if (tarea.estado === 'ASSIGNED') {
                      asignadas++;
                    } else if (tarea.estado === 'IN_PROGRESS') {
                      enProgreso++;
                    } else if (tarea.estado === 'COMPLETED' || tarea.estado === 'APPROVED') {
                      completadas++;
                    }
                  });
                });
              }

              const total = pendientes + asignadas + enProgreso + completadas;

              return (
                <DoughnutChart
                  data={{
                    labels: ['Pendientes', 'Asignadas', 'En Progreso', 'Completadas'],
                    datasets: [
                      {
                        data: [
                          pendientes,
                          asignadas,
                          enProgreso,
                          completadas
                        ],
                        backgroundColor: [
                          'rgba(255, 51, 102, 0.7)',
                          'rgba(255, 153, 0, 0.7)',
                          'rgba(0, 184, 212, 0.7)',
                          'rgba(76, 217, 100, 0.7)',
                        ],
                        borderColor: [
                          'rgba(255, 51, 102, 1)',
                          'rgba(255, 153, 0, 1)',
                          'rgba(0, 184, 212, 1)',
                          'rgba(76, 217, 100, 1)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  centerText="Total"
                  centerValue={total}
                  size={180}
                />
              );
            })()}
          </MetricsChart>
        </ContentGrid>
      </ContentGrid>
    </ContentContainer>
  );
};

export default AsignadorDashboardContent;
