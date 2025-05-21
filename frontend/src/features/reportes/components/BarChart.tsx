import React from 'react';
import styled from 'styled-components';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

interface BarChartProps {
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor?: string;
  }[];
  height?: number;
  horizontal?: boolean;
  stacked?: boolean;
  showLegend?: boolean;
  maxValue?: number;
}

/**
 * Componente para mostrar un gráfico de barras
 */
const BarChart: React.FC<BarChartProps> = ({
  title,
  labels,
  datasets,
  height = 300,
  horizontal = false,
  stacked = false,
  showLegend = true,
  maxValue
}) => {
  // Configuración del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' as const : 'x' as const,
    scales: {
      x: {
        stacked,
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#888'
        },
        max: horizontal ? maxValue : undefined
      },
      y: {
        stacked,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#888'
        },
        max: !horizontal ? maxValue : undefined
      }
    },
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
        boxPadding: 6
      }
    }
  };
  
  // Datos para el gráfico
  const data = {
    labels,
    datasets: datasets.map(dataset => ({
      ...dataset,
      borderWidth: 0,
      borderRadius: 6,
      borderColor: dataset.borderColor || dataset.backgroundColor,
      hoverBackgroundColor: dataset.backgroundColor.replace('1)', '0.8)')
    }))
  };
  
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>{title}</ChartTitle>
      </ChartHeader>
      <div style={{ height }}>
        <Bar options={options} data={data} />
      </div>
    </ChartContainer>
  );
};

export default BarChart;
