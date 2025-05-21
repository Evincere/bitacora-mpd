/**
 * @file DoughnutChart component
 * @description A reusable doughnut chart component using Chart.js
 */

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

// Styled components
const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChartContainer = styled.div<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  position: relative;
`;

// Types
export interface DoughnutChartProps {
  data: ChartData<'doughnut'>;
  options?: ChartOptions<'doughnut'>;
  size?: number;
  centerText?: string;
  centerValue?: string | number;
}

/**
 * Default chart options
 */
const defaultOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom' as const,
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
  }
};

/**
 * DoughnutChart component
 * @param props Component props
 * @returns {JSX.Element} The DoughnutChart component
 */
const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  options = {},
  size = 200,
  centerText,
  centerValue
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
    <ChartWrapper>
      <ChartContainer $size={size}>
        <Doughnut data={data} options={chartOptions} />
        
        {/* Center text overlay */}
        {(centerText || centerValue) && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}
          >
            {centerText && (
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                {centerText}
              </div>
            )}
            {centerValue && (
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {centerValue}
              </div>
            )}
          </div>
        )}
      </ChartContainer>
    </ChartWrapper>
  );
};

export default DoughnutChart;
