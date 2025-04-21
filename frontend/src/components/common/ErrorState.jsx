import React from 'react';
import styled from 'styled-components';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  color: ${({ theme }) => theme.danger};
  margin-bottom: 16px;
`;

const ErrorTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 8px;
`;

const ErrorMessage = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  max-width: 400px;
  margin: 0 auto 24px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
  border: none;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

/**
 * Componente para mostrar un estado de error con opción de acción
 * 
 * @param {string} title - Título del error
 * @param {string} message - Mensaje de error
 * @param {string} actionText - Texto del botón de acción
 * @param {Function} onAction - Función a ejecutar al hacer clic en el botón
 */
const ErrorState = ({ 
  title = 'Ha ocurrido un error', 
  message = 'No se pudieron cargar los datos. Por favor, intenta de nuevo.', 
  actionText = 'Reintentar', 
  onAction 
}) => {
  return (
    <ErrorContainer>
      <ErrorIcon>
        <FiAlertCircle />
      </ErrorIcon>
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorMessage>{message}</ErrorMessage>
      {onAction && (
        <ActionButton onClick={onAction}>
          <FiRefreshCw size={16} />
          {actionText}
        </ActionButton>
      )}
    </ErrorContainer>
  );
};

export default ErrorState;
