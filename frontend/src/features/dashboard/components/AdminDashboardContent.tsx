/**
 * @file AdminDashboardContent component
 * @description Dashboard content specific to ADMIN role
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiClipboard,
  FiActivity,
  FiServer,
  FiPieChart,
  FiBarChart2,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiSettings,
  FiFileText,
  FiDatabase
} from 'react-icons/fi';
import useSmartDashboardData from '../hooks/useSmartDashboardData';
import StatisticsCard from './StatisticsCard';
import TaskList from './TaskList';
import MetricsChart from './MetricsChart';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
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

const TabsContainer = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

interface TabProps {
  $active: boolean;
}

const Tab = styled.button<TabProps>`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  background-color: ${({ $active, theme }) =>
    $active ? theme.backgroundSecondary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.primary : theme.textSecondary};
  border-bottom: 2px solid ${({ $active, theme }) =>
    $active ? theme.primary : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const ActivityItem = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  margin-bottom: 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const ActivityTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  margin: 0;
`;

const ActivityTime = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textTertiary};
`;

const ActivityDescription = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0;
`;

/**
 * AdminDashboardContent component
 * @returns {JSX.Element} The AdminDashboardContent component
 */
const AdminDashboardContent: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useSmartDashboardData();
  const [activeTab, setActiveTab] = useState('system');

  // Mock data for system overview
  const systemStats = {
    users: 25,
    totalTasks: data.stats?.total || 0,
    activeTasks: data.stats?.enProgreso || 0,
    systemHealth: 98.5
  };

  // Mock data for recent activity
  const recentActivity = [
    { id: 1, user: 'Adriana Sánchez', action: 'Asignó tarea #123 a Matías Silva', time: '10 minutos atrás' },
    { id: 2, user: 'Juan Pérez', action: 'Creó nueva solicitud #456', time: '25 minutos atrás' },
    { id: 3, user: 'Matías Silva', action: 'Completó tarea #789', time: '1 hora atrás' },
    { id: 4, user: 'Admin', action: 'Actualizó configuración del sistema', time: '2 horas atrás' },
    { id: 5, user: 'Laura Gómez', action: 'Creó nueva solicitud #457', time: '3 horas atrás' }
  ];

  return (
    <ContentContainer>
      <StatsGrid>
        <StatisticsCard
          title="Usuarios"
          value={systemStats.users}
          icon={<FiUsers size={20} />}
          color="#6C5CE7"
          isLoading={isLoading}
          trend={8}
        />
        <StatisticsCard
          title="Tareas Totales"
          value={systemStats.totalTasks}
          icon={<FiClipboard size={20} />}
          color="#00B8D4"
          isLoading={isLoading}
          trend={15}
        />
        <StatisticsCard
          title="Tareas Activas"
          value={systemStats.activeTasks}
          icon={<FiActivity size={20} />}
          color="#FF3366"
          isLoading={isLoading}
          trend={5}
        />
        <StatisticsCard
          title="Salud del Sistema"
          value={systemStats.systemHealth}
          icon={<FiServer size={20} />}
          color="#4CD964"
          isLoading={isLoading}
          footer="%"
        />
      </StatsGrid>

      <ContentGrid>
        <ContentGrid style={{ gridTemplateColumns: '1fr' }}>
          <MetricsChart
            title="Métricas por Rol"
            icon={<FiPieChart size={18} />}
            type="bar"
            isLoading={isLoading}
            isEmpty={false}
          >
            <TabsContainer>
              <Tab
                $active={activeTab === 'system'}
                onClick={() => setActiveTab('system')}
              >
                Sistema
              </Tab>
              <Tab
                $active={activeTab === 'solicitante'}
                onClick={() => setActiveTab('solicitante')}
              >
                Solicitantes
              </Tab>
              <Tab
                $active={activeTab === 'asignador'}
                onClick={() => setActiveTab('asignador')}
              >
                Asignadores
              </Tab>
              <Tab
                $active={activeTab === 'ejecutor'}
                onClick={() => setActiveTab('ejecutor')}
              >
                Ejecutores
              </Tab>
            </TabsContainer>

            {activeTab === 'system' && (
              <LineChart
                data={{
                  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                  datasets: [
                    {
                      label: 'Solicitudes',
                      data: [65, 78, 90, 81, 86, 95, 91, 85, 90, 99, 103, 95],
                      borderColor: 'rgba(108, 92, 231, 1)',
                      backgroundColor: 'rgba(108, 92, 231, 0.1)',
                      fill: true,
                    },
                    {
                      label: 'Tareas',
                      data: [40, 55, 75, 81, 56, 55, 60, 70, 65, 75, 80, 75],
                      borderColor: 'rgba(0, 184, 212, 1)',
                      backgroundColor: 'rgba(0, 184, 212, 0.1)',
                      fill: true,
                    }
                  ],
                }}
                height={200}
              />
            )}

            {activeTab === 'solicitante' && (
              <BarChart
                data={{
                  labels: ['Pendientes', 'En Proceso', 'Completadas', 'Rechazadas'],
                  datasets: [
                    {
                      label: 'Solicitudes',
                      data: [12, 8, 24, 3],
                      backgroundColor: [
                        'rgba(255, 153, 0, 0.7)',
                        'rgba(0, 184, 212, 0.7)',
                        'rgba(76, 217, 100, 0.7)',
                        'rgba(255, 51, 102, 0.7)',
                      ],
                    }
                  ],
                }}
                height={200}
              />
            )}

            {activeTab === 'asignador' && (
              <DoughnutChart
                data={{
                  labels: ['Pendientes', 'Asignadas', 'Rechazadas'],
                  datasets: [
                    {
                      data: [8, 15, 2],
                      backgroundColor: [
                        'rgba(255, 153, 0, 0.7)',
                        'rgba(0, 184, 212, 0.7)',
                        'rgba(255, 51, 102, 0.7)',
                      ],
                    }
                  ],
                }}
                size={180}
              />
            )}

            {activeTab === 'ejecutor' && (
              <BarChart
                data={{
                  labels: ['Asignadas', 'En Progreso', 'Completadas'],
                  datasets: [
                    {
                      label: 'Tareas',
                      data: [15, 10, 35],
                      backgroundColor: [
                        'rgba(255, 153, 0, 0.7)',
                        'rgba(0, 184, 212, 0.7)',
                        'rgba(76, 217, 100, 0.7)',
                      ],
                    }
                  ],
                }}
                height={200}
              />
            )}
          </MetricsChart>

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiActivity size={18} />
              Actividad Reciente
            </h3>

            {recentActivity.map(activity => (
              <ActivityItem key={activity.id}>
                <ActivityHeader>
                  <ActivityTitle>{activity.user}</ActivityTitle>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityHeader>
                <ActivityDescription>{activity.action}</ActivityDescription>
              </ActivityItem>
            ))}
          </div>
        </ContentGrid>

        <ContentGrid style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiBarChart2 size={18} />
              Distribución por Estado
            </h3>

            <StatsGrid style={{ gridTemplateColumns: '1fr 1fr' }}>
              <StatisticsCard
                title="En Progreso"
                value={data.stats?.enProgreso || 0}
                icon={<FiClock size={16} />}
                color="#00B8D4"
                isLoading={isLoading}
              />
              <StatisticsCard
                title="Pendientes"
                value={data.stats?.pendientes || 0}
                icon={<FiAlertCircle size={16} />}
                color="#FF3366"
                isLoading={isLoading}
              />
              <StatisticsCard
                title="Completadas"
                value={data.stats?.completadas || 0}
                icon={<FiCheckCircle size={16} />}
                color="#4CD964"
                isLoading={isLoading}
              />
              <StatisticsCard
                title="Total"
                value={data.stats?.total || 0}
                icon={<FiClipboard size={16} />}
                color="#6C5CE7"
                isLoading={isLoading}
              />
            </StatsGrid>
          </div>

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiUsers size={18} />
              Accesos Rápidos
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#6C5CE720',
                  color: '#6C5CE7',
                  fontWeight: 600,
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={() => navigate('/app/admin/usuarios')}
              >
                <FiUsers size={16} />
                Gestionar Usuarios
              </button>
              <button
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#00B8D420',
                  color: '#00B8D4',
                  fontWeight: 600,
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={() => navigate('/app/configuracion/tareas')}
              >
                <FiSettings size={16} />
                Configuración del Sistema
              </button>
              <button
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#4CD96420',
                  color: '#4CD964',
                  fontWeight: 600,
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={() => navigate('/app/reportes')}
              >
                <FiBarChart2 size={16} />
                Reportes y Métricas
              </button>
              <button
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#FF336620',
                  color: '#FF3366',
                  fontWeight: 600,
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FiDatabase size={16} />
                Logs del Sistema
              </button>
            </div>
          </div>
        </ContentGrid>
      </ContentGrid>
    </ContentContainer>
  );
};

export default AdminDashboardContent;
