/**
 * @file MetricsChart component
 * @description A reusable component for displaying charts and metrics
 */

import React from 'react';
import styled from 'styled-components';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';
import { glassCard } from '@/shared/styles';

// Styled components
const ChartContainer = styled.div`
  ${glassCard}
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChartContent = styled.div`
  flex: 1;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;

  h4 {
    margin: 8px 0 4px;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 16px;
`;

const LoadingSpinner = styled(FiLoader)`
  animation: spin 1s linear infinite;
  color: ${({ theme }) => theme.primary};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Types
export type ChartType = 'pie' | 'bar' | 'line' | 'area' | 'donut';

interface MetricsChartProps {
  title: string;
  icon: React.ReactNode;
  type: ChartType;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

/**
 * MetricsChart component
 * @param props Component props
 * @returns {JSX.Element} The MetricsChart component
 */
const MetricsChart: React.FC<MetricsChartProps> = ({
  title,
  icon,
  type,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'No hay datos para mostrar',
  children
}) => {
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>
          {icon}
          {title}
        </ChartTitle>
      </ChartHeader>

      <ChartContent>
        {isLoading ? (
          <LoadingState>
            <LoadingSpinner size={24} />
          </LoadingState>
        ) : isEmpty ? (
          <EmptyState>
            <FiAlertCircle size={24} />
            <h4>No hay datos disponibles</h4>
            <p>{title === "Progreso de Tareas"
              ? "No tienes tareas en progreso para mostrar estadísticas."
              : emptyMessage}</p>
            {title === "Progreso de Tareas" && (
              <p style={{ marginTop: '8px', fontSize: '13px' }}>
                Cuando inicies tareas, podrás ver tu progreso aquí.
              </p>
            )}
          </EmptyState>
        ) : (
          children
        )}
      </ChartContent>
    </ChartContainer>
  );
};

export default MetricsChart;
