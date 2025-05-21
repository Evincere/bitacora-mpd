/**
 * @file SolicitanteDashboardContent component
 * @description Dashboard content specific to SOLICITANTE role
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiBarChart2,
  FiRefreshCw
} from 'react-icons/fi';
import useSmartDashboardData from '../hooks/useSmartDashboardData';
import StatisticsCard from './StatisticsCard';
import TaskList from './TaskList';
import CalendarView from './CalendarView';
import MetricsChart from './MetricsChart';
import BarChart from './BarChart';

// Animación para el icono de actualización
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled components
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: transparent;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.theme.textPrimary};

  &:hover {
    background-color: ${props => props.theme.backgroundSecondary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:active svg {
    transform: rotate(180deg);
  }

  .spinning {
    animation: ${spin} 1s linear infinite;
  }
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

/**
 * SolicitanteDashboardContent component
 * @returns {JSX.Element} The SolicitanteDashboardContent component
 */
const SolicitanteDashboardContent: React.FC = () => {
  const { data, isLoading, error, refreshData } = useSmartDashboardData();

  // Log para depuración
  React.useEffect(() => {
    console.log('SolicitanteDashboardContent: Datos recibidos:', {
      data,
      isLoading,
      error,
      totalSolicitudes: data.totalSolicitudes,
      solicitudesPendientes: data.solicitudesPendientes,
      solicitudesAsignadas: data.solicitudesAsignadas,
      solicitudesCompletadas: data.solicitudesCompletadas
    });
  }, [data, isLoading, error]);

  // Prepare calendar events from solicitudes
  const calendarEvents = React.useMemo(() => {
    if (!data.solicitudes) return [];

    console.log('SolicitanteDashboardContent: Preparando eventos de calendario con solicitudes:', data.solicitudes);

    return data.solicitudes
      .filter((solicitud: any) => solicitud.dueDate)
      .map((solicitud: any) => ({
        id: solicitud.id,
        date: solicitud.dueDate,
        title: solicitud.title || solicitud.titulo
      }));
  }, [data.solicitudes]);

  // Sort solicitudes by creation date (most recent first)
  const recentSolicitudes = React.useMemo(() => {
    if (!data.solicitudes) return [];

    console.log('SolicitanteDashboardContent: Preparando solicitudes recientes con:', data.solicitudes);

    return [...data.solicitudes]
      .sort((a, b) => {
        // Usar requestDate o fechaCreacion según la estructura disponible
        const dateA = a.requestDate || a.fechaCreacion || a.createdAt || '';
        const dateB = b.requestDate || b.fechaCreacion || b.createdAt || '';
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })
      .slice(0, 5);
  }, [data.solicitudes]);

  // Función para manejar la actualización manual
  const handleRefresh = () => {
    console.log('SolicitanteDashboardContent: Actualizando datos manualmente...');
    refreshData();
  };

  return (
    <ContentContainer>
      <HeaderContainer>
        <h2>Dashboard del Solicitante</h2>
        <RefreshButton onClick={handleRefresh} disabled={isLoading}>
          <FiRefreshCw size={16} className={isLoading ? 'spinning' : ''} />
          {isLoading ? 'Actualizando...' : 'Actualizar datos'}
        </RefreshButton>
      </HeaderContainer>
      <StatsGrid>
        <StatisticsCard
          title="Total de Solicitudes"
          value={data.totalSolicitudes || 0}
          icon={<FiFileText size={20} />}
          color="#6C5CE7"
          isLoading={isLoading}
          footer={`${data.solicitudesPendientes || 0} pendientes, ${data.solicitudesAsignadas || 0} en proceso`}
        />
        <StatisticsCard
          title="Solicitudes Pendientes"
          value={data.solicitudesPendientes || 0}
          icon={<FiClock size={20} />}
          color="#00B8D4"
          isLoading={isLoading}
        />
        <StatisticsCard
          title="Solicitudes Completadas"
          value={data.solicitudesCompletadas || 0}
          icon={<FiCheckCircle size={20} />}
          color="#4CD964"
          isLoading={isLoading}
        />
        <StatisticsCard
          title="Tiempo Promedio de Respuesta"
          value={3.5} // This would come from the API in a real implementation
          icon={<FiAlertCircle size={20} />}
          color="#FF3366"
          isLoading={isLoading}
          footer="días"
        />
      </StatsGrid>

      <ContentGrid>
        <TaskList
          title="Mis Solicitudes Recientes"
          icon={<FiFileText size={18} />}
          items={recentSolicitudes}
          viewAllLink="/app/solicitudes"
          viewAllLabel="Ver todas mis solicitudes"
          emptyMessage="No tienes solicitudes recientes"
          isLoading={isLoading}
          type="request"
        />

        <ContentGrid style={{ gridTemplateColumns: '1fr' }}>
          <CalendarView
            title="Próximos Vencimientos"
            events={calendarEvents}
            isLoading={isLoading}
            emptyMessage="No hay fechas límite próximas"
          />

          <MetricsChart
            title="Tiempos de Respuesta"
            icon={<FiBarChart2 size={18} />}
            type="bar"
            isLoading={isLoading}
            isEmpty={false}
          >
            <BarChart
              data={{
                labels: ['Urgente', 'Alta', 'Media', 'Baja'],
                datasets: [
                  {
                    label: 'Tiempo promedio (días)',
                    data: [1.2, 2.5, 3.8, 5.2],
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
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Tiempo de respuesta por prioridad',
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

export default SolicitanteDashboardContent;
