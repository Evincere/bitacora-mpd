import { useEffect } from 'react'
import styled from 'styled-components'
import StatCard from './components/StatCard'
import ActivityTypeStats from './components/ActivityTypeStats'
import ActivityStatusStats from './components/ActivityStatusStats'
import ActivitySummaryList from './components/ActivitySummaryList'
import TeamMembers from './components/TeamMembers'
import AIAssistant from './components/AIAssistant'
import {
  FiActivity,
  FiClipboard,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi'
import { useActivityStatsByStatus } from '@/features/activities/hooks'

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const PageHeader = styled.div`
  margin-bottom: 8px;

  h1 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  p {
    color: ${({ theme }) => theme.textSecondary};
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
`

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`

const ChartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const SideSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Dashboard = () => {
  // Obtener estadísticas de actividades por estado para las tarjetas de estadísticas
  const { data: statusStats, isLoading: isLoadingStats } = useActivityStatsByStatus();

  // Calcular totales para las tarjetas de estadísticas
  const stats = {
    enProgreso: statusStats?.find(stat => stat.status === 'EN_PROGRESO')?.count || 0,
    pendientes: statusStats?.find(stat => stat.status === 'PENDIENTE')?.count || 0,
    completadas: statusStats?.find(stat => stat.status === 'COMPLETADA')?.count || 0,
    total: statusStats?.reduce((sum, stat) => sum + stat.count, 0) || 0
  };

  useEffect(() => {
    // Aquí se cargarían datos adicionales del dashboard si fuera necesario
  }, [])

  return (
    <DashboardContainer>
      <PageHeader>
        <h1>Dashboard</h1>
        <p>Bienvenido de nuevo, aquí tienes un resumen de las actividades.</p>
      </PageHeader>

      <StatsGrid>
        <StatCard
          title="Tareas en progreso"
          value={stats.enProgreso}
          icon={<FiActivity />}
          color="#6C5CE7"
          trend={0}
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Tareas pendientes"
          value={stats.pendientes}
          icon={<FiClipboard />}
          color="#00B8D4"
          trend={0}
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Tareas completadas"
          value={stats.completadas}
          icon={<FiCheckCircle />}
          color="#4CD964"
          trend={0}
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Total actividades"
          value={stats.total}
          icon={<FiClock />}
          color="#FF3366"
          trend={0}
          isLoading={isLoadingStats}
        />
      </StatsGrid>

      <DashboardGrid>
        <ChartSection>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <ActivityTypeStats />
            </div>
            <div style={{ flex: 1 }}>
              <ActivityStatusStats />
            </div>
          </div>
        </ChartSection>

        <SideSection>
          <ActivitySummaryList />
          <AIAssistant />
          <TeamMembers />
        </SideSection>
      </DashboardGrid>
    </DashboardContainer>
  )
}

export default Dashboard
