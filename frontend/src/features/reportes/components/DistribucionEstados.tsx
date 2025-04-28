import React from 'react';
import styled from 'styled-components';
import { FiPieChart } from 'react-icons/fi';

// Datos de ejemplo para mostrar en la interfaz
const MOCK_DISTRIBUCION_ESTADOS = {
  '7': {
    REQUESTED: { cantidad: 10, porcentaje: 22.2 },
    ASSIGNED: { cantidad: 7, porcentaje: 15.6 },
    IN_PROGRESS: { cantidad: 10, porcentaje: 22.2 },
    COMPLETED: { cantidad: 8, porcentaje: 17.8 },
    APPROVED: { cantidad: 6, porcentaje: 13.3 },
    REJECTED: { cantidad: 4, porcentaje: 8.9 }
  },
  '30': {
    REQUESTED: { cantidad: 25, porcentaje: 20.8 },
    ASSIGNED: { cantidad: 20, porcentaje: 16.7 },
    IN_PROGRESS: { cantidad: 25, porcentaje: 20.8 },
    COMPLETED: { cantidad: 20, porcentaje: 16.7 },
    APPROVED: { cantidad: 20, porcentaje: 16.7 },
    REJECTED: { cantidad: 10, porcentaje: 8.3 }
  },
  '90': {
    REQUESTED: { cantidad: 40, porcentaje: 12.5 },
    ASSIGNED: { cantidad: 60, porcentaje: 18.8 },
    IN_PROGRESS: { cantidad: 80, porcentaje: 25.0 },
    COMPLETED: { cantidad: 60, porcentaje: 18.8 },
    APPROVED: { cantidad: 50, porcentaje: 15.6 },
    REJECTED: { cantidad: 30, porcentaje: 9.4 }
  },
  '365': {
    REQUESTED: { cantidad: 100, porcentaje: 10.5 },
    ASSIGNED: { cantidad: 150, porcentaje: 15.8 },
    IN_PROGRESS: { cantidad: 200, porcentaje: 21.1 },
    COMPLETED: { cantidad: 200, porcentaje: 21.1 },
    APPROVED: { cantidad: 200, porcentaje: 21.1 },
    REJECTED: { cantidad: 100, porcentaje: 10.5 }
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
`;

const ChartContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const PieChart = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(
    #3b82f6 0% 20.8%,
    #f59e0b 20.8% 37.5%,
    #8b5cf6 37.5% 58.3%,
    #10b981 58.3% 75%,
    #059669 75% 91.7%,
    #ef4444 91.7% 100%
  );
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background-color: ${({ theme }) => theme.backgroundSecondary};
    border-radius: 50%;
  }
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LegendColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${({ $color }) => $color};
`;

const LegendLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  flex: 1;
`;

const LegendValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  display: flex;
  gap: 4px;
`;

const LegendPercentage = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-weight: normal;
`;

// Función para obtener el color según el estado
const getStatusColor = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return '#3b82f6'; // blue
    case 'ASSIGNED':
      return '#f59e0b'; // amber
    case 'IN_PROGRESS':
      return '#8b5cf6'; // purple
    case 'COMPLETED':
      return '#10b981'; // green
    case 'APPROVED':
      return '#059669'; // dark green
    case 'REJECTED':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
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

interface DistribucionEstadosProps {
  periodo: string;
  categoria?: string;
}

const DistribucionEstados: React.FC<DistribucionEstadosProps> = ({ periodo, categoria }) => {
  // Obtener datos según el periodo seleccionado
  const datos = MOCK_DISTRIBUCION_ESTADOS[periodo as keyof typeof MOCK_DISTRIBUCION_ESTADOS] || MOCK_DISTRIBUCION_ESTADOS['30'];
  
  // Generar el gradiente para el gráfico de pastel
  const generateConicGradient = () => {
    let gradient = '';
    let startPercentage = 0;
    
    Object.entries(datos).forEach(([estado, { porcentaje }]) => {
      const color = getStatusColor(estado);
      const endPercentage = startPercentage + porcentaje;
      
      gradient += `${color} ${startPercentage}% ${endPercentage}%, `;
      startPercentage = endPercentage;
    });
    
    return gradient.slice(0, -2); // Eliminar la última coma y espacio
  };
  
  return (
    <Container>
      <Header>
        <Title>Distribución por Estados</Title>
      </Header>
      <Content>
        <ChartContainer>
          <PieChart style={{ background: `conic-gradient(${generateConicGradient()})` }} />
        </ChartContainer>
        
        <Legend>
          {Object.entries(datos).map(([estado, { cantidad, porcentaje }]) => (
            <LegendItem key={estado}>
              <LegendColor $color={getStatusColor(estado)} />
              <LegendLabel>{getStatusText(estado)}</LegendLabel>
              <LegendValue>
                {cantidad}
                <LegendPercentage>({porcentaje.toFixed(1)}%)</LegendPercentage>
              </LegendValue>
            </LegendItem>
          ))}
        </Legend>
      </Content>
    </Container>
  );
};

export default DistribucionEstados;
