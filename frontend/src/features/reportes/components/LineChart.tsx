import React from 'react';
import styled from 'styled-components';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
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

interface LineChartProps {
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
  height?: number;
  showLegend?: boolean;
  maxValue?: number;
}

/**
 * Componente para mostrar un gráfico de líneas
 */
const LineChart: React.FC<LineChartProps> = ({
  title,
  labels,
  datasets,
  height = 300,
  showLegend = true,
  maxValue
}) => {
  // Configuración del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#888'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#888'
        },
        max: maxValue
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
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 6
      }
    }
  };
  
  // Datos para el gráfico
  const data = {
    labels,
    datasets: datasets.map(dataset => ({
      ...dataset,
      borderWidth: 2,
      pointBackgroundColor: dataset.borderColor,
      backgroundColor: dataset.backgroundColor || dataset.borderColor.replace('1)', '0.1)'),
      fill: dataset.fill !== undefined ? dataset.fill : false
    }))
  };
  
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>{title}</ChartTitle>
      </ChartHeader>
      <div style={{ height }}>
        <Line options={options} data={data} />
      </div>
    </ChartContainer>
  );
};

export default LineChart;
