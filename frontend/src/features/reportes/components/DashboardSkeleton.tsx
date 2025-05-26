import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animación de skeleton
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

// Componente base de skeleton
const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: 8px;
`;

// Contenedor principal
const SkeletonContainer = styled.div`
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

// Grid de métricas
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

// Tarjeta de métrica skeleton
const MetricCardSkeleton = styled(SkeletonBase)`
  height: 120px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

// Grid de gráficos
const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

// Gráfico skeleton
const ChartSkeleton = styled(SkeletonBase)`
  height: 300px;
  padding: 20px;
`;

// Tabla skeleton
const TableSkeleton = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 32px;
`;

// Header de tabla skeleton
const TableHeaderSkeleton = styled(SkeletonBase)`
  height: 50px;
  margin-bottom: 1px;
  border-radius: 0;
`;

// Fila de tabla skeleton
const TableRowSkeleton = styled(SkeletonBase)`
  height: 60px;
  margin-bottom: 1px;
  border-radius: 0;
`;

// Título skeleton
const TitleSkeleton = styled(SkeletonBase)`
  height: 32px;
  width: 300px;
  margin-bottom: 24px;
`;

// Filtros skeleton
const FiltersSkeleton = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const FilterItemSkeleton = styled(SkeletonBase)`
  height: 40px;
  width: 150px;
`;

/**
 * Componente de skeleton para el dashboard
 */
const DashboardSkeleton: React.FC = () => {
  return (
    <SkeletonContainer>
      {/* Título */}
      <TitleSkeleton />
      
      {/* Filtros */}
      <FiltersSkeleton>
        <FilterItemSkeleton />
        <FilterItemSkeleton />
        <FilterItemSkeleton />
        <FilterItemSkeleton />
      </FiltersSkeleton>
      
      {/* Métricas principales */}
      <MetricsGrid>
        {Array.from({ length: 8 }).map((_, index) => (
          <MetricCardSkeleton key={`metric-${index}`} />
        ))}
      </MetricsGrid>
      
      {/* Gráficos de estado de tareas */}
      <ChartsGrid>
        <ChartSkeleton />
        <ChartSkeleton />
      </ChartsGrid>
      
      {/* Gráficos de actividad de usuarios */}
      <ChartsGrid>
        <ChartSkeleton />
        <ChartSkeleton />
      </ChartsGrid>
      
      {/* Tabla de usuarios más activos */}
      <TableSkeleton>
        <TableHeaderSkeleton />
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRowSkeleton key={`table-row-${index}`} />
        ))}
      </TableSkeleton>
      
      {/* Gráficos de distribución */}
      <ChartsGrid>
        <ChartSkeleton />
        <ChartSkeleton />
      </ChartsGrid>
      
      {/* Gráfico de timeline */}
      <ChartSkeleton style={{ marginBottom: 0 }} />
    </SkeletonContainer>
  );
};

/**
 * Skeleton para tarjeta de métrica individual
 */
export const MetricCardSkeletonComponent: React.FC = () => {
  return <MetricCardSkeleton />;
};

/**
 * Skeleton para gráfico individual
 */
export const ChartSkeletonComponent: React.FC = () => {
  return <ChartSkeleton />;
};

/**
 * Skeleton para tabla individual
 */
export const TableSkeletonComponent: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <TableSkeleton>
      <TableHeaderSkeleton />
      {Array.from({ length: rows }).map((_, index) => (
        <TableRowSkeleton key={`table-row-${index}`} />
      ))}
    </TableSkeleton>
  );
};

export default DashboardSkeleton;
