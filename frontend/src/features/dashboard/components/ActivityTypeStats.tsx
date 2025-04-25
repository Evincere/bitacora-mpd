import React from 'react';
import styled from 'styled-components';
import { FiPieChart, FiMoreVertical, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useActivityStatsByType } from '@/features/activities/hooks';
import { typeColors } from '@/shared/styles';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const ChartContainer = styled.div`
  height: 240px;
  position: relative;
  margin-bottom: 20px;
`;

const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${({ color }) => color};
`;

const LegendLabel = styled.span`
  flex: 1;
  font-size: 14px;
`;

const LegendValue = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 240px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 240px;
  color: ${({ theme }) => theme.error};
  gap: 8px;
  text-align: center;
  padding: 0 20px;
`;

const ActivityTypeStats: React.FC = () => {
  const { data, isLoading, isError, error } = useActivityStatsByType();

  // Preparar datos para el gráfico
  const chartData = React.useMemo(() => {
    if (!data) return null;

    const labels = data.map(item => item.type);
    const counts = data.map(item => item.count);
    const colors = data.map(item => {
      // Obtener color del tipo de actividad
      const activityType = item.type.toUpperCase();
      return typeColors[activityType]?.background || 'rgba(204, 204, 204, 0.15)';
    });

    return {
      labels,
      datasets: [
        {
          data: counts,
          backgroundColor: colors,
          borderWidth: 0,
          cutout: '70%'
        }
      ]
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#2A2A30',
        titleColor: '#FFFFFF',
        bodyColor: '#AAAAAA',
        borderColor: '#3A3A40',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw} (${Math.round(context.raw / context.dataset.data.reduce((a: number, b: number) => a + b, 0) * 100)}%)`;
          }
        }
      }
    }
  };

  return (
    <ChartCard>
      <CardHeader>
        <Title>Actividades por Tipo</Title>
        <MenuButton>
          <FiMoreVertical size={20} />
        </MenuButton>
      </CardHeader>

      {isLoading && (
        <LoadingContainer>
          <FiLoader size={24} />
        </LoadingContainer>
      )}

      {isError && (
        <ErrorContainer>
          <FiAlertCircle size={24} />
          <span>Error al cargar estadísticas: {(error as Error)?.message || 'Error desconocido'}</span>
        </ErrorContainer>
      )}

      {!isLoading && !isError && chartData && (
        <>
          <ChartContainer>
            <Doughnut data={chartData} options={options} />
          </ChartContainer>

          <LegendContainer>
            {data?.map((item, index) => {
              const activityType = item.type.toUpperCase();
              const color = typeColors[activityType]?.text || '#CCCCCC';
              const percentage = Math.round(item.count / data.reduce((sum, current) => sum + current.count, 0) * 100);

              return (
                <LegendItem key={item.type}>
                  <LegendColor color={color} />
                  <LegendLabel>{item.type}</LegendLabel>
                  <LegendValue>{percentage}%</LegendValue>
                </LegendItem>
              );
            })}
          </LegendContainer>
        </>
      )}
    </ChartCard>
  );
};

export default ActivityTypeStats;
