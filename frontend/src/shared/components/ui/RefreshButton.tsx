import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiRefreshCw } from 'react-icons/fi';

interface RefreshButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  disabled?: boolean;
  title?: string;
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledButton = styled.button<{ $size: string; $isLoading: boolean; disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${({ $size }) => 
    $size === 'small' ? '6px 12px' : 
    $size === 'large' ? '12px 20px' : 
    '10px 16px'};
  border-radius: 6px;
  font-weight: 600;
  font-size: ${({ $size }) => 
    $size === 'small' ? '12px' : 
    $size === 'large' ? '16px' : 
    '14px'};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  border: 1.5px solid ${({ theme }) => `${theme.primary}70`};
  box-shadow: 0 3px 6px ${({ theme }) => `${theme.primary}30`};
  letter-spacing: 0.3px;
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  
  /* Usar un fondo oscuro con una ligera transparencia del color primario */
  background-color: ${({ theme }) => `${theme.primary}20`};
  color: ${({ theme }) => theme.primary};
  
  &:hover {
    transform: ${({ disabled }) => disabled ? 'none' : 'translateY(-1px)'};
    box-shadow: ${({ disabled, theme }) => 
      disabled ? `0 3px 6px ${theme.primary}30` : `0 5px 10px ${theme.primary}40`};
    background-color: ${({ theme }) => `${theme.primary}30`};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 6px ${({ theme }) => `${theme.primary}30`};
  }
  
  svg {
    animation: ${({ $isLoading }) => $isLoading ? `${rotate} 1.5s linear infinite` : 'none'};
    width: ${({ $size }) => 
      $size === 'small' ? '14px' : 
      $size === 'large' ? '20px' : 
      '16px'};
    height: ${({ $size }) => 
      $size === 'small' ? '14px' : 
      $size === 'large' ? '20px' : 
      '16px'};
  }
`;

const RefreshButton: React.FC<RefreshButtonProps> = ({
  onClick,
  isLoading = false,
  label = 'Actualizar',
  size = 'medium',
  className,
  disabled = false,
  title = 'Actualizar datos'
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleClick = () => {
    if (disabled || isLoading) return;
    
    setIsAnimating(true);
    onClick();
    
    // Detener la animación después de 1.5 segundos si isLoading no se establece externamente
    if (!isLoading) {
      setTimeout(() => {
        setIsAnimating(false);
      }, 1500);
    }
  };
  
  return (
    <StyledButton
      onClick={handleClick}
      $size={size}
      $isLoading={isLoading || isAnimating}
      className={className}
      disabled={disabled}
      title={title}
      aria-label={label}
    >
      <FiRefreshCw />
      {label}
    </StyledButton>
  );
};

export default RefreshButton;
