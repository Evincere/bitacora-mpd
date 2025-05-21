/**
 * @file StatisticsCard component
 * @description A reusable card component for displaying statistics
 */

import React from 'react';
import styled from 'styled-components';
import { FiArrowUp, FiArrowDown, FiLoader } from 'react-icons/fi';
import { glassCard } from '@/shared/styles';

// Styled components
const Card = styled.div`
  ${glassCard}
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
`;

const IconWrapper = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${({ $color }) => `${$color}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
`;

const Value = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
`;

const TrendWrapper = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ $positive, theme }) =>
    $positive ? theme.success : theme.error};
`;

const TrendIcon = styled.div`
  display: flex;
  align-items: center;
`;

const TrendValue = styled.span`
  font-weight: 600;
`;

const TrendLabel = styled.span`
  color: ${({ theme }) => theme.textTertiary};
  margin-left: 4px;
`;

const LoadingSpinner = styled(FiLoader)`
  animation: spin 1s linear infinite;
  color: ${({ theme }) => theme.primary};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface StatisticsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  trendLabel?: string;
  isLoading?: boolean;
  footer?: string;
  noDataMessage?: boolean;
}

/**
 * StatisticsCard component
 * @param props Component props
 * @returns {JSX.Element} The StatisticsCard component
 */
const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  icon,
  color,
  trend = 0,
  trendLabel = 'vs. semana anterior',
  isLoading = false,
  footer,
  noDataMessage = false
}) => {
  const isPositive = trend >= 0;

  return (
    <Card>
      <CardHeader>
        <Title>{title}</Title>
        <IconWrapper $color={color}>
          {icon}
        </IconWrapper>
      </CardHeader>

      <Value>
        {isLoading ? (
          <LoadingSpinner size={24} />
        ) : noDataMessage ? (
          "N/A"
        ) : (
          value
        )}
      </Value>

      {footer ? (
        <TrendWrapper $positive={true}>
          <TrendLabel>{footer}</TrendLabel>
        </TrendWrapper>
      ) : (
        <TrendWrapper $positive={isPositive}>
          {!isLoading && trend !== undefined && (
            <>
              <TrendIcon>
                {isPositive ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
              </TrendIcon>
              <TrendValue>{Math.abs(trend)}%</TrendValue>
              <TrendLabel>{trendLabel}</TrendLabel>
            </>
          )}
        </TrendWrapper>
      )}
    </Card>
  );
};

export default StatisticsCard;
