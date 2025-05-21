/**
 * @file EjecutorDashboardContent component
 * @description Dashboard content specific to EJECUTOR role
 */

import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  FiCheckSquare,
  FiClock,
  FiCalendar,
  FiBarChart2,
  FiAlertCircle,
  FiInfo
} from 'react-icons/fi';
import useSmartDashboardData from '../hooks/useSmartDashboardData';
import StatisticsCard from './StatisticsCard';
import TaskList from './TaskList';
import CalendarView from './CalendarView';
import MetricsChart from './MetricsChart';
import LineChart from './LineChart';

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

const InfoAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: ${({ theme }) => theme.backgroundInfo};
  border-left: 4px solid ${({ theme }) => theme.info};
  border-radius: 8px;
  margin-bottom: 16px;

  .icon {
    color: ${({ theme }) => theme.info};
    flex-shrink: 0;
  }

  .content {
    h4 {
      margin: 0 0 4px;
      font-size: 15px;
    }

    p {
      margin: 0;
      font-size: 14px;
      color: ${({ theme }) => theme.textSecondary};
    }
  }
`;

/**
 * EjecutorDashboardContent component
 * @returns {JSX.Element} The EjecutorDashboardContent component
 */
const EjecutorDashboardContent: React.FC = () => {
  const { data, isLoading, error } = useSmartDashboardData();

  // Calculate urgent tasks
  const urgentTasks = React.useMemo(() => {
    if (!data.assignedTasks) return 0;

    return data.assignedTasks.filter((task: any) =>
      task.priority === 'CRITICAL' || task.priority === 'HIGH'
    ).length;
  }, [data.assignedTasks]);

  // Calculate overdue tasks
  const overdueTasks = React.useMemo(() => {
    if (!data.assignedTasks) return 0;

    return data.assignedTasks.filter((task: any) => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date();
    }).length;
  }, [data.assignedTasks]);

  // Calculate average progress
  const averageProgress = React.useMemo(() => {
    if (!data.inProgressTasks || data.inProgressTasks.length === 0) return 0;

    const totalProgress = data.inProgressTasks.reduce((acc: number, task: any) =>
      acc + (task.progress || 0), 0
    );

    return Math.round(totalProgress / data.inProgressTasks.length);
  }, [data.inProgressTasks]);

  // Prepare calendar events from tasks
  const calendarEvents = React.useMemo(() => {
    if (!data.assignedTasks) return [];

    return [
      ...(data.assignedTasks || []),
      ...(data.inProgressTasks || [])
    ]
      .filter((task: any) => task.dueDate)
      .map((task: any) => ({
        id: task.id,
        date: task.dueDate,
        title: task.title
      }));
  }, [data.assignedTasks, data.inProgressTasks]);

  // Verificar si hay tareas asignadas o en progreso
  const hasTasks = React.useMemo(() => {
    return (data.assignedTasks && data.assignedTasks.length > 0) ||
           (data.inProgressTasks && data.inProgressTasks.length > 0);
  }, [data.assignedTasks, data.inProgressTasks]);

  // Efecto para registrar cambios en los datos
  useEffect(() => {
    if (!isLoading) {
      console.log('EjecutorDashboard: Datos actualizados', {
        assignedTasks: data.assignedTasks?.length || 0,
        inProgressTasks: data.inProgressTasks?.length || 0,
        hasTasks
      });
    }
  }, [isLoading, data, hasTasks]);

  return (
    <ContentContainer>
      {!isLoading && !hasTasks && (
        <InfoAlert>
          <div className="icon">
            <FiInfo size={24} />
          </div>
          <div className="content">
            <h4>No tienes tareas asignadas</h4>
            <p>Actualmente no tienes tareas pendientes ni en progreso. Cuando recibas nuevas asignaciones, aparecerán aquí.</p>
          </div>
        </InfoAlert>
      )}

      <StatsGrid>
        <StatisticsCard
          title="Tareas Asignadas"
          value={data.totalAssignedTasks || 0}
          icon={<FiCheckSquare size={20} />}
          color="#6C5CE7"
          isLoading={isLoading}
          footer={`${urgentTasks || 0} urgentes, ${overdueTasks || 0} vencidas`}
        />
        <StatisticsCard
          title="Tareas en Progreso"
          value={data.totalInProgressTasks || 0}
          icon={<FiClock size={20} />}
          color="#00B8D4"
          isLoading={isLoading}
          footer={`${averageProgress}% completado (promedio)`}
        />
        <StatisticsCard
          title="Próximos Vencimientos"
          value={data.upcomingDeadlines?.length || 0}
          icon={<FiCalendar size={20} />}
          color="#FF3366"
          isLoading={isLoading}
          footer="tareas con fecha límite próxima"
        />
        <StatisticsCard
          title="Tiempo Promedio de Completado"
          value={data.averageCompletionTime ? parseFloat(data.averageCompletionTime) : 0}
          icon={<FiBarChart2 size={20} />}
          color="#4CD964"
          isLoading={isLoading}
          footer={data.averageCompletionTime ? "días" : "Sin datos suficientes"}
          noDataMessage={!data.averageCompletionTime}
        />
      </StatsGrid>

      <ContentGrid>
        <ContentGrid style={{ gridTemplateColumns: '1fr', gridTemplateRows: 'auto auto' }}>
          <TaskList
            title="Tareas Asignadas"
            icon={<FiCheckSquare size={18} />}
            items={data.assignedTasks || []}
            viewAllLink="/app/tareas/asignadas"
            viewAllLabel="Ver todas las tareas asignadas"
            emptyMessage="No tienes tareas asignadas"
            isLoading={isLoading}
            type="task"
          />

          <TaskList
            title="Tareas en Progreso"
            icon={<FiClock size={18} />}
            items={data.inProgressTasks || []}
            viewAllLink="/app/tareas/progreso"
            viewAllLabel="Ver todas las tareas en progreso"
            emptyMessage="No tienes tareas en progreso"
            isLoading={isLoading}
            type="task"
          />
        </ContentGrid>

        <ContentGrid style={{ gridTemplateColumns: '1fr' }}>
          <CalendarView
            title="Calendario de Vencimientos"
            events={calendarEvents}
            isLoading={isLoading}
            emptyMessage="No hay fechas límite próximas"
          />

          <MetricsChart
            title="Progreso de Tareas"
            icon={<FiBarChart2 size={18} />}
            type="bar"
            isLoading={isLoading}
            isEmpty={!data.inProgressTasks || data.inProgressTasks.length === 0}
          >
            <LineChart
              data={{
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [
                  {
                    label: 'Tareas Completadas',
                    data: [2, 3, 1, 4, 2, 0, 1],
                    borderColor: 'rgba(76, 217, 100, 1)',
                    backgroundColor: 'rgba(76, 217, 100, 0.2)',
                    fill: true,
                    tension: 0.4,
                  },
                  {
                    label: 'Tareas Asignadas',
                    data: [3, 2, 4, 3, 5, 1, 2],
                    borderColor: 'rgba(0, 184, 212, 1)',
                    backgroundColor: 'rgba(0, 184, 212, 0.1)',
                    fill: true,
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Actividad semanal',
                    font: {
                      size: 14,
                    },
                  },
                },
              }}
              height={200}
            />
          </MetricsChart>
        </ContentGrid>
      </ContentGrid>
    </ContentContainer>
  );
};

export default EjecutorDashboardContent;
