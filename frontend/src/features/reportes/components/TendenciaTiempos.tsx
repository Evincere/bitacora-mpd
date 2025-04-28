import React from 'react';
import styled from 'styled-components';
import { FiTrendingUp } from 'react-icons/fi';

// Datos de ejemplo para mostrar en la interfaz
const MOCK_TENDENCIA_TIEMPOS = {
  '7': {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    tiempoAsignacion: [1.2, 1.5, 1.0, 1.3, 1.1, 0.8, 0.9],
    tiempoCompletado: [3.5, 4.0, 3.8, 3.2, 3.6, 3.0, 3.3]
  },
  '30': {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'],
    tiempoAsignacion: [1.3, 1.2, 1.1, 1.0, 0.9],
    tiempoCompletado: [3.8, 3.6, 3.5, 3.3, 3.2]
  },
  '90': {
    labels: ['Ene', 'Feb', 'Mar'],
    tiempoAsignacion: [1.5, 1.3, 1.1],
    tiempoCompletado: [4.2, 3.9, 3.5]
  },
  '365': {
    labels: ['T1', 'T2', 'T3', 'T4'],
    tiempoAsignacion: [1.8, 1.5, 1.3, 1.1],
    tiempoCompletado: [5.0, 4.5, 4.0, 3.5]
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
  flex-direction: column;
  position: relative;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ChartTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChartLegend = styled.div`
  display: flex;
  gap: 16px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const LegendColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${({ $color }) => $color};
`;

const LineChart = styled.div`
  flex: 1;
  position: relative;
  padding-bottom: 24px;
`;

const ChartGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const GridLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.borderLight};
`;

const GridLabel = styled.div`
  position: absolute;
  left: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  transform: translateY(-50%);
`;

const ChartLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 24px;
  display: flex;
`;

const LineContainer = styled.div`
  position: relative;
  flex: 1;
`;

const Line = styled.div<{ $color: string; $points: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: none;
    border: 2px solid ${({ $color }) => $color};
    border-width: 0 0 2px 0;
    clip-path: ${({ $points }) => `polygon(${$points})`};
  }
`;

const DataPoints = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
`;

const DataPoint = styled.div<{ $color: string; $top: number }>`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  border: 2px solid ${({ theme }) => theme.backgroundSecondary};
  transform: translate(-50%, -50%);
  top: ${({ $top }) => `${$top}%`};
`;

const XAxis = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 24px;
  display: flex;
  justify-content: space-between;
`;

const XLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
  width: 100%;
`;

interface TendenciaTiemposProps {
  periodo: string;
  categoria?: string;
}

const TendenciaTiempos: React.FC<TendenciaTiemposProps> = ({ periodo, categoria }) => {
  // Obtener datos según el periodo seleccionado
  const datos = MOCK_TENDENCIA_TIEMPOS[periodo as keyof typeof MOCK_TENDENCIA_TIEMPOS] || MOCK_TENDENCIA_TIEMPOS['30'];
  
  // Calcular el máximo valor para escalar el gráfico
  const maxTiempoAsignacion = Math.max(...datos.tiempoAsignacion);
  const maxTiempoCompletado = Math.max(...datos.tiempoCompletado);
  const maxValue = Math.max(maxTiempoAsignacion, maxTiempoCompletado);
  const roundedMaxValue = Math.ceil(maxValue);
  
  // Generar puntos para el polígono del gráfico de línea
  const generateLinePoints = (values: number[]) => {
    const totalPoints = values.length;
    
    return values.map((value, index) => {
      const x = (index / (totalPoints - 1)) * 100;
      const y = 100 - ((value / roundedMaxValue) * 100);
      return `${x}% ${y}%`;
    }).join(', ');
  };
  
  // Generar etiquetas para el eje Y
  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const value = (roundedMaxValue / 4) * i;
    return value.toFixed(1);
  });
  
  return (
    <Container>
      <Header>
        <Title>Tendencia de Tiempos</Title>
      </Header>
      <Content>
        <ChartContainer>
          <ChartHeader>
            <ChartTitle>Tiempo promedio (días)</ChartTitle>
            <ChartLegend>
              <LegendItem>
                <LegendColor $color="#3b82f6" />
                Tiempo de asignación
              </LegendItem>
              <LegendItem>
                <LegendColor $color="#10b981" />
                Tiempo de completado
              </LegendItem>
            </ChartLegend>
          </ChartHeader>
          
          <LineChart>
            {/* Grid de fondo */}
            <ChartGrid>
              {yLabels.map((label, index) => (
                <GridLine key={index}>
                  <GridLabel>{label}</GridLabel>
                </GridLine>
              ))}
            </ChartGrid>
            
            {/* Líneas de datos */}
            <ChartLines>
              <LineContainer>
                <Line 
                  $color="#3b82f6" 
                  $points={generateLinePoints(datos.tiempoAsignacion)} 
                />
                <Line 
                  $color="#10b981" 
                  $points={generateLinePoints(datos.tiempoCompletado)} 
                />
                
                {/* Puntos de datos - Tiempo de asignación */}
                <DataPoints>
                  {datos.tiempoAsignacion.map((value, index) => {
                    const totalPoints = datos.tiempoAsignacion.length;
                    const left = (index / (totalPoints - 1)) * 100;
                    const top = 100 - ((value / roundedMaxValue) * 100);
                    
                    return (
                      <DataPoint 
                        key={`asignacion-${index}`} 
                        $color="#3b82f6" 
                        $top={top}
                        style={{ left: `${left}%` }}
                      />
                    );
                  })}
                </DataPoints>
                
                {/* Puntos de datos - Tiempo de completado */}
                <DataPoints>
                  {datos.tiempoCompletado.map((value, index) => {
                    const totalPoints = datos.tiempoCompletado.length;
                    const left = (index / (totalPoints - 1)) * 100;
                    const top = 100 - ((value / roundedMaxValue) * 100);
                    
                    return (
                      <DataPoint 
                        key={`completado-${index}`} 
                        $color="#10b981" 
                        $top={top}
                        style={{ left: `${left}%` }}
                      />
                    );
                  })}
                </DataPoints>
              </LineContainer>
            </ChartLines>
            
            {/* Eje X */}
            <XAxis>
              {datos.labels.map((label, index) => (
                <XLabel key={index}>{label}</XLabel>
              ))}
            </XAxis>
          </LineChart>
        </ChartContainer>
      </Content>
    </Container>
  );
};

export default TendenciaTiempos;
