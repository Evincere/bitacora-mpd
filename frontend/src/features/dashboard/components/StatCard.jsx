import styled from 'styled-components'
import { FiArrowUp, FiArrowDown, FiLoader } from 'react-icons/fi'

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${({ color }) => `${color}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
`

const Title = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0;
`

const Value = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  height: 38px; /* Altura fija para evitar saltos durante la carga */
  display: flex;
  align-items: center;
`

const TrendWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: ${({ theme, $positive }) => $positive ? theme.success : theme.error};
`

const TrendIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 4px;
`

const TrendValue = styled.span`
  font-weight: 500;
`

const TrendLabel = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  margin-left: 4px;
`

const LoadingSpinner = styled(FiLoader)`
  animation: spin 1s linear infinite;
  color: ${({ theme }) => theme.textSecondary};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StatCard = ({ title, value, icon, color, trend, isLoading = false }) => {
  const isPositive = trend >= 0

  return (
    <Card>
      <CardHeader>
        <Title>{title}</Title>
        <IconWrapper color={color}>
          {icon}
        </IconWrapper>
      </CardHeader>

      <Value>
        {isLoading ? <LoadingSpinner size={24} /> : value}
      </Value>

      <TrendWrapper $positive={isPositive}>
        {!isLoading && (
          <>
            <TrendIcon>
              {isPositive ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
            </TrendIcon>
            <TrendValue>{Math.abs(trend)}%</TrendValue>
            <TrendLabel>vs. semana anterior</TrendLabel>
          </>
        )}
      </TrendWrapper>
    </Card>
  )
}

export default StatCard
