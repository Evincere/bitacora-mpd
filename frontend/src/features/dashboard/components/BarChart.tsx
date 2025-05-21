/**
 * @file BarChart component
 * @description A reusable bar chart component using Chart.js
 */

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Styled components
const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 200px;
`;

// Types
export interface BarChartProps {
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
  height?: number;
}

/**
 * Default chart options
 */
const defaultOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        boxWidth: 12,
        padding: 15,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 10,
      cornerRadius: 4,
      titleFont: {
        size: 14
      },
      bodyFont: {
        size: 13
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 12
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        font: {
          size: 12
        }
      }
    }
  }
};

/**
 * BarChart component
 * @param props Component props
 * @returns {JSX.Element} The BarChart component
 */
const BarChart: React.FC<BarChartProps> = ({
  data,
  options = {},
  height = 300
}) => {
  // Merge default options with provided options
  const chartOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options.plugins
    }
  };

  return (
    <ChartWrapper style={{ height: `${height}px` }}>
      <Bar data={data} options={chartOptions} />
    </ChartWrapper>
  );
};

export default BarChart;
