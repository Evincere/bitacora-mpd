import React from 'react';
import styled from 'styled-components';
import { FiPieChart } from 'react-icons/fi';

// Datos de ejemplo para mostrar en la interfaz
const MOCK_DISTRIBUCION_CATEGORIAS = {
  '7': {
    ADMINISTRATIVA: { cantidad: 15, porcentaje: 33.3 },
    LEGAL: { cantidad: 12, porcentaje: 26.7 },
    TECNICA: { cantidad: 8, porcentaje: 17.8 },
    FINANCIERA: { cantidad: 6, porcentaje: 13.3 },
    RECURSOS_HUMANOS: { cantidad: 4, porcentaje: 8.9 }
  },
  '30': {
    ADMINISTRATIVA: { cantidad: 40, porcentaje: 33.3 },
    LEGAL: { cantidad: 30, porcentaje: 25.0 },
    TECNICA: { cantidad: 25, porcentaje: 20.8 },
    FINANCIERA: { cantidad: 15, porcentaje: 12.5 },
    RECURSOS_HUMANOS: { cantidad: 10, porcentaje: 8.3 }
  },
  '90': {
    ADMINISTRATIVA: { cantidad: 100, porcentaje: 31.3 },
    LEGAL: { cantidad: 80, porcentaje: 25.0 },
    TECNICA: { cantidad: 70, porcentaje: 21.9 },
    FINANCIERA: { cantidad: 40, porcentaje: 12.5 },
    RECURSOS_HUMANOS: { cantidad: 30, porcentaje: 9.4 }
  },
  '365': {
    ADMINISTRATIVA: { cantidad: 300, porcentaje: 31.6 },
    LEGAL: { cantidad: 250, porcentaje: 26.3 },
    TECNICA: { cantidad: 200, porcentaje: 21.1 },
    FINANCIERA: { cantidad: 120, porcentaje: 12.6 },
    RECURSOS_HUMANOS: { cantidad: 80, porcentaje: 8.4 }
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
  gap: 12px;
`;

const BarChartContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BarLabel = styled.div`
  width: 120px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BarContainer = styled.div`
  flex: 1;
  height: 24px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 4px;
  overflow: hidden;
`;

const Bar = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${({ $width }) => `${$width}%`};
  background-color: ${({ $color }) => $color};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const BarValue = styled.div`
  width: 80px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  text-align: right;
`;

// Función para obtener el color según la categoría
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'ADMINISTRATIVA':
      return '#3b82f6'; // blue
    case 'LEGAL':
      return '#8b5cf6'; // purple
    case 'TECNICA':
      return '#10b981'; // green
    case 'FINANCIERA':
      return '#f59e0b'; // amber
    case 'RECURSOS_HUMANOS':
      return '#ec4899'; // pink
    default:
      return '#6b7280'; // gray
  }
};

// Función para obtener el texto de la categoría
const getCategoryText = (category: string) => {
  switch (category) {
    case 'ADMINISTRATIVA':
      return 'Administrativa';
    case 'LEGAL':
      return 'Legal';
    case 'TECNICA':
      return 'Técnica';
    case 'FINANCIERA':
      return 'Financiera';
    case 'RECURSOS_HUMANOS':
      return 'Recursos Humanos';
    default:
      return category;
  }
};

interface DistribucionCategoriasProps {
  periodo: string;
}

const DistribucionCategorias: React.FC<DistribucionCategoriasProps> = ({ periodo }) => {
  // Obtener datos según el periodo seleccionado
  const datos = MOCK_DISTRIBUCION_CATEGORIAS[periodo as keyof typeof MOCK_DISTRIBUCION_CATEGORIAS] || MOCK_DISTRIBUCION_CATEGORIAS['30'];
  
  // Ordenar categorías por cantidad (de mayor a menor)
  const sortedCategories = Object.entries(datos)
    .sort(([, a], [, b]) => b.cantidad - a.cantidad);
  
  return (
    <Container>
      <Header>
        <Title>Distribución por Categorías</Title>
      </Header>
      <Content>
        <ChartContainer>
          <BarChartContainer>
            {sortedCategories.map(([categoria, { cantidad, porcentaje }]) => (
              <BarGroup key={categoria}>
                <BarLabel>{getCategoryText(categoria)}</BarLabel>
                <BarContainer>
                  <Bar $width={porcentaje} $color={getCategoryColor(categoria)} />
                </BarContainer>
                <BarValue>{cantidad} ({porcentaje.toFixed(1)}%)</BarValue>
              </BarGroup>
            ))}
          </BarChartContainer>
        </ChartContainer>
      </Content>
    </Container>
  );
};

export default DistribucionCategorias;
