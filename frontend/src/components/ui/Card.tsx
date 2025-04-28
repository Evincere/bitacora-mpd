import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: string;
}

const CardContainer = styled.div<{ $hoverable?: boolean; $padding?: string }>`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: ${({ $padding }) => $padding || '16px'};
  transition: all 0.2s ease;
  
  ${({ $hoverable, theme }) => $hoverable && `
    cursor: pointer;
    &:hover {
      box-shadow: ${theme.shadowHover};
      transform: translateY(-2px);
    }
  `}
`;

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  onClick, 
  hoverable = false,
  padding
}) => {
  return (
    <CardContainer 
      className={className} 
      onClick={onClick} 
      $hoverable={hoverable}
      $padding={padding}
    >
      {children}
    </CardContainer>
  );
};

export default Card;
