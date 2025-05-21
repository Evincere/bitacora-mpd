import React from 'react';
import styled from 'styled-components';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { glassCard } from '@/shared/styles';

interface ErrorSolicitudProps {
  onRetry?: () => void;
}

/**
 * Componente especializado para mostrar errores al cargar solicitudes
 * con un diseño consistente con la aplicación.
 */
const ErrorSolicitud: React.FC<ErrorSolicitudProps> = ({ onRetry }) => {
  return (
    <ErrorContainer>
      <ErrorContent>
        <IconWrapper>
          <FiAlertCircle size={32} />
        </IconWrapper>
        <TextContent>
          <ErrorTitle>Error al cargar la solicitud</ErrorTitle>
          <ErrorMessage>No se pudo cargar la solicitud. Por favor, inténtelo de nuevo.</ErrorMessage>
        </TextContent>
      </ErrorContent>
      <RetryButton onClick={onRetry}>
        <FiRefreshCw size={18} />
        <span>Reintentar</span>
      </RetryButton>
    </ErrorContainer>
  );
};

const ErrorContainer = styled.div`
  ${glassCard}
  display: flex;
  flex-direction: column;
  padding: 24px;
  margin: 20px auto;
  max-width: 800px;
  background-color: ${({ theme }) => `rgba(${parseInt(theme.error.slice(1, 3), 16)}, ${parseInt(theme.error.slice(3, 5), 16)}, ${parseInt(theme.error.slice(5, 7), 16)}, 0.08)`};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => `rgba(${parseInt(theme.error.slice(1, 3), 16)}, ${parseInt(theme.error.slice(3, 5), 16)}, ${parseInt(theme.error.slice(5, 7), 16)}, 0.2)`};
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ErrorContent = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme }) => `rgba(${parseInt(theme.error.slice(1, 3), 16)}, ${parseInt(theme.error.slice(3, 5), 16)}, ${parseInt(theme.error.slice(5, 7), 16)}, 0.15)`};
  color: ${({ theme }) => theme.error};
  margin-right: 20px;
  flex-shrink: 0;
`;

const TextContent = styled.div`
  flex: 1;
`;

const ErrorTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.error};
  margin: 0 0 8px 0;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  margin: 0;
  line-height: 1.5;
`;

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: ${({ theme }) => theme.error};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: center;
  
  &:hover {
    background-color: ${({ theme }) => theme.errorHover};
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 59, 48, 0.25);
  }
  
  &:active {
    transform: translateY(0);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: rotate(180deg);
  }
`;

export default ErrorSolicitud;
