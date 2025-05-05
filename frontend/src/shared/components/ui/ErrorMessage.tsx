import React from 'react';
import styled from 'styled-components';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

interface ErrorMessageProps {
  message: string;
  details?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Componente para mostrar mensajes de error amigables con opción de reintento.
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  details,
  onRetry,
  className
}) => {
  return (
    <ErrorContainer className={className}>
      <ErrorIcon>
        <FiAlertCircle size={32} />
      </ErrorIcon>
      <ErrorContent>
        <ErrorTitle>{message}</ErrorTitle>
        {details && <ErrorDetails>{details}</ErrorDetails>}
        {onRetry && (
          <RetryButton onClick={onRetry}>
            <FiRefreshCw size={16} />
            Reintentar
          </RetryButton>
        )}
      </ErrorContent>
    </ErrorContainer>
  );
};

const ErrorContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background-color: ${({ theme }) => theme.errorLight || '#FEE2E2'};
  border-left: 4px solid ${({ theme }) => theme.error || '#DC2626'};
  border-radius: 4px;
  margin: 16px 0;
`;

const ErrorIcon = styled.div`
  color: ${({ theme }) => theme.error || '#DC2626'};
  margin-right: 16px;
  flex-shrink: 0;
`;

const ErrorContent = styled.div`
  flex: 1;
`;

const ErrorTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.error || '#DC2626'};
  margin-bottom: 8px;
`;

const ErrorDetails = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary || '#6B7280'};
  margin-bottom: 12px;
  white-space: pre-wrap;
`;

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.error || '#DC2626'};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.errorDark || '#B91C1C'};
  }
`;

export default ErrorMessage;
