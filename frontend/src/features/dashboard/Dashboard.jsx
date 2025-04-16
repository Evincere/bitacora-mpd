import { useEffect } from 'react'
import styled from 'styled-components'
import StatCard from './components/StatCard'
import ActivityChart from './components/ActivityChart'
import RecentActivities from './components/RecentActivities'
import TeamMembers from './components/TeamMembers'
import AIAssistant from './components/AIAssistant'
import { 
  FiActivity, 
  FiClipboard, 
  FiCheckCircle, 
  FiClock 
} from 'react-icons/fi'

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
  useEffect(() => {
    // Aquí se cargarían los datos del dashboard
    // dispatch(fetchDashboardData())
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
          value={38} 
          icon={<FiActivity />} 
          color="#6C5CE7"
          trend={+5}
        />
        <StatCard 
          title="Tareas pendientes" 
          value={59} 
          icon={<FiClipboard />} 
          color="#00B8D4"
          trend={-3}
        />
        <StatCard 
          title="Tareas completadas" 
          value={87} 
          icon={<FiCheckCircle />} 
          color="#4CD964"
          trend={+12}
        />
        <StatCard 
          title="Horas registradas" 
          value={43} 
          icon={<FiClock />} 
          color="#FF3366"
          trend={+2}
        />
      </StatsGrid>
      
      <DashboardGrid>
        <ChartSection>
          <ActivityChart />
          <RecentActivities />
        </ChartSection>
        
        <SideSection>
          <AIAssistant />
          <TeamMembers />
        </SideSection>
      </DashboardGrid>
    </DashboardContainer>
  )
}

export default Dashboard
