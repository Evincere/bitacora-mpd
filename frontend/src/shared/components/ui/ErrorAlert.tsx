import React from 'react';
import styled from 'styled-components';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { glassCard } from '@/shared/styles';

interface ErrorAlertProps {
  title?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Componente para mostrar alertas de error con estilo glassmorphism
 * y consistente con el diseño de la aplicación.
 */
const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Error',
  message,
  actionText = 'Reintentar',
  onAction,
  className
}) => {
  return (
    <AlertContainer className={className}>
      <AlertContent>
        <IconContainer>
          <FiAlertCircle size={28} />
        </IconContainer>
        <TextContainer>
          <AlertTitle>{title}</AlertTitle>
          <AlertMessage>{message}</AlertMessage>
        </TextContainer>
      </AlertContent>
      {onAction && (
        <ActionButton onClick={onAction}>
          <FiRefreshCw size={16} />
          <span>{actionText}</span>
        </ActionButton>
      )}
    </AlertContainer>
  );
};

const AlertContainer = styled.div`
  ${glassCard}
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 16px 0;
  background-color: ${({ theme }) => `rgba(${parseInt(theme.error.slice(1, 3), 16)}, ${parseInt(theme.error.slice(3, 5), 16)}, ${parseInt(theme.error.slice(5, 7), 16)}, 0.1)`};
  border-left: 4px solid ${({ theme }) => theme.error};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const AlertContent = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${({ children }) => children ? '16px' : '0'};
`;

const IconContainer = styled.div`
  color: ${({ theme }) => theme.error};
  margin-right: 16px;
  flex-shrink: 0;
`;

const TextContainer = styled.div`
  flex: 1;
`;

const AlertTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.error};
  margin: 0 0 8px 0;
`;

const AlertMessage = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  margin: 0;
  line-height: 1.5;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: ${({ theme }) => theme.error};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
  margin-left: 44px;
  
  &:hover {
    background-color: ${({ theme }) => theme.errorHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 59, 48, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export default ErrorAlert;
