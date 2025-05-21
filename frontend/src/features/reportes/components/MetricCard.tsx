import React from 'react';
import styled from 'styled-components';
import { IconType } from 'react-icons';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

// Estilos
const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0;
`;

const IconContainer = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: ${({ $color }) => $color + '20'};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const Value = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
`;

const ChangeIndicator = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ $positive, theme }) => $positive ? theme.success : theme.error};
  font-weight: 500;
`;

const FooterText = styled.span`
  color: ${({ theme }) => theme.textSecondary};
`;

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: IconType;
  color: string;
  change?: number;
  footerText?: string;
  format?: 'number' | 'percentage' | 'time' | 'currency';
}

/**
 * Componente para mostrar una tarjeta de métrica
 */
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  change,
  footerText,
  format = 'number'
}) => {
  // Formatear el valor según el formato especificado
  const formattedValue = () => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'time':
        const days = Math.floor(value);
        const hours = Math.round((value - days) * 24);
        return hours > 0 ? `${days}d ${hours}h` : `${days} días`;
      case 'currency':
        return `$${value.toLocaleString('es-AR')}`;
      default:
        return value.toLocaleString('es-AR');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <Title>{title}</Title>
        <IconContainer $color={color}>
          <Icon />
        </IconContainer>
      </CardHeader>
      
      <Value>{formattedValue()}</Value>
      
      {(change !== undefined || footerText) && (
        <Footer>
          {change !== undefined && (
            <ChangeIndicator $positive={change >= 0}>
              {change >= 0 ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
              {Math.abs(change).toFixed(1)}%
            </ChangeIndicator>
          )}
          {footerText && <FooterText>{footerText}</FooterText>}
        </Footer>
      )}
    </Card>
  );
};

export default MetricCard;
