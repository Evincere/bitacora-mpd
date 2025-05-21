import React from 'react';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Estilos
const ChartContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

interface PieChartProps {
  title: string;
  labels: string[];
  data: number[];
  backgroundColor: string[];
  height?: number;
  showLegend?: boolean;
  doughnut?: boolean;
  cutout?: string;
}

/**
 * Componente para mostrar un gráfico de pastel o dona
 */
const PieChart: React.FC<PieChartProps> = ({
  title,
  labels,
  data,
  backgroundColor,
  height = 300,
  showLegend = true,
  doughnut = false,
  cutout = '50%'
}) => {
  // Configuración del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#888'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        bodySpacing: 6,
        cornerRadius: 8,
        boxPadding: 6,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  // Datos para el gráfico
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderWidth: 0,
        hoverOffset: 10
      }
    ]
  };
  
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>{title}</ChartTitle>
      </ChartHeader>
      <div style={{ height }}>
        {doughnut ? (
          <Doughnut 
            options={{ ...options, cutout }} 
            data={chartData} 
          />
        ) : (
          <Pie options={options} data={chartData} />
        )}
      </div>
    </ChartContainer>
  );
};

export default PieChart;
