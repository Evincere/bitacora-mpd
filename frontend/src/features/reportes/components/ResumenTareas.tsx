import React from 'react';
import styled from 'styled-components';
import { 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';

// Datos de ejemplo para mostrar en la interfaz
const MOCK_RESUMEN = {
  '7': {
    totalTareas: 45,
    tareasCompletadas: 28,
    tareasPendientes: 17,
    tasaCompletado: 62.2,
    tiempoPromedioCompletado: 3.5,
    tendenciaCompletado: 'up',
    tendenciaTiempo: 'down'
  },
  '30': {
    totalTareas: 120,
    tareasCompletadas: 95,
    tareasPendientes: 25,
    tasaCompletado: 79.2,
    tiempoPromedioCompletado: 4.2,
    tendenciaCompletado: 'up',
    tendenciaTiempo: 'down'
  },
  '90': {
    totalTareas: 320,
    tareasCompletadas: 280,
    tareasPendientes: 40,
    tasaCompletado: 87.5,
    tiempoPromedioCompletado: 4.8,
    tendenciaCompletado: 'up',
    tendenciaTiempo: 'neutral'
  },
  '365': {
    totalTareas: 950,
    tareasCompletadas: 850,
    tareasPendientes: 100,
    tasaCompletado: 89.5,
    tiempoPromedioCompletado: 5.2,
    tendenciaCompletado: 'neutral',
    tendenciaTiempo: 'up'
  }
};

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
`;

const Content = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 8px;
  padding: 16px;
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
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatFooter = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TrendIndicator = styled.div<{ $trend: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  
  ${({ $trend, theme }) => {
    switch ($trend) {
      case 'up':
        return `color: ${theme.success};`;
      case 'down':
        return `color: ${theme.error};`;
      default:
        return `color: ${theme.textSecondary};`;
    }
  }}
`;

const ProgressContainer = styled.div`
  margin-top: 16px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ProgressLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const ProgressValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: ${({ theme }) => theme.backgroundHover};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background-color: ${({ theme }) => theme.primary};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

interface ResumenTareasProps {
  periodo: string;
}

const ResumenTareas: React.FC<ResumenTareasProps> = ({ periodo }) => {
  // Obtener datos según el periodo seleccionado
  const datos = MOCK_RESUMEN[periodo as keyof typeof MOCK_RESUMEN] || MOCK_RESUMEN['30'];
  
  return (
    <Container>
      <Header>
        <Title>Resumen de Tareas</Title>
      </Header>
      <Content>
        <StatsGrid>
          <StatCard>
            <StatTitle>Total de Tareas</StatTitle>
            <StatValue>
              {datos.totalTareas}
            </StatValue>
            <StatFooter>
              en el periodo seleccionado
            </StatFooter>
          </StatCard>
          
          <StatCard>
            <StatTitle>Tareas Completadas</StatTitle>
            <StatValue>
              <FiCheckCircle size={20} color="#10b981" />
              {datos.tareasCompletadas}
            </StatValue>
            <StatFooter>
              <TrendIndicator $trend={datos.tendenciaCompletado}>
                {datos.tendenciaCompletado === 'up' && <FiTrendingUp size={12} />}
                {datos.tendenciaCompletado === 'down' && <FiTrendingDown size={12} />}
                {datos.tendenciaCompletado === 'up' ? '+' : datos.tendenciaCompletado === 'down' ? '-' : ''}
                {datos.tendenciaCompletado !== 'neutral' && '8.5%'}
                {datos.tendenciaCompletado === 'neutral' && 'Sin cambios'}
              </TrendIndicator>
              vs. periodo anterior
            </StatFooter>
          </StatCard>
          
          <StatCard>
            <StatTitle>Tareas Pendientes</StatTitle>
            <StatValue>
              <FiClock size={20} color="#f59e0b" />
              {datos.tareasPendientes}
            </StatValue>
            <StatFooter>
              por completar
            </StatFooter>
          </StatCard>
          
          <StatCard>
            <StatTitle>Tiempo Promedio</StatTitle>
            <StatValue>
              {datos.tiempoPromedioCompletado.toFixed(1)}
            </StatValue>
            <StatFooter>
              <TrendIndicator $trend={datos.tendenciaTiempo === 'down' ? 'up' : datos.tendenciaTiempo === 'up' ? 'down' : 'neutral'}>
                {datos.tendenciaTiempo === 'down' && <FiTrendingUp size={12} />}
                {datos.tendenciaTiempo === 'up' && <FiTrendingDown size={12} />}
                {datos.tendenciaTiempo === 'down' ? '-' : datos.tendenciaTiempo === 'up' ? '+' : ''}
                {datos.tendenciaTiempo !== 'neutral' && '0.3'}
                {datos.tendenciaTiempo === 'neutral' && 'Sin cambios'}
              </TrendIndicator>
              días por tarea
            </StatFooter>
          </StatCard>
        </StatsGrid>
        
        <ProgressContainer>
          <ProgressHeader>
            <ProgressLabel>Tasa de Completado</ProgressLabel>
            <ProgressValue>{datos.tasaCompletado.toFixed(1)}%</ProgressValue>
          </ProgressHeader>
          <ProgressBar>
            <ProgressFill $percentage={datos.tasaCompletado} />
          </ProgressBar>
        </ProgressContainer>
      </Content>
    </Container>
  );
};

export default ResumenTareas;
