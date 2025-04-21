import React from 'react';
import styled from 'styled-components';
import { useToast } from './ToastProvider';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: ${({ theme }) => theme.cardBackground || '#2A2A30'};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow || '0 4px 6px rgba(0, 0, 0, 0.1)'};
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h2`
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Button = styled.button<{ $variant: 'success' | 'error' | 'warning' | 'info' }>`
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  color: white;
  
  background-color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'success': return theme.success || '#4caf50';
      case 'error': return theme.error || '#f44336';
      case 'warning': return theme.warning || '#ff9800';
      case 'info': return theme.info || '#2196f3';
      default: return theme.primary || '#6C5CE7';
    }
  }};
  
  &:hover {
    filter: brightness(1.1);
  }
  
  &:focus {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`;

/**
 * Componente de demostración para el sistema de notificaciones toast
 */
const ToastDemo: React.FC = () => {
  const toast = useToast();
  
  const showSuccessToast = () => {
    toast.success('La operación se completó exitosamente', 'Éxito');
  };
  
  const showErrorToast = () => {
    toast.error('Ha ocurrido un error al procesar la solicitud', 'Error');
  };
  
  const showWarningToast = () => {
    toast.warning('Esta acción podría tener consecuencias', 'Advertencia');
  };
  
  const showInfoToast = () => {
    toast.info('Hay actualizaciones disponibles', 'Información');
  };
  
  const showCustomDurationToast = () => {
    toast.info('Esta notificación durará 10 segundos', 'Notificación larga', 10000);
  };
  
  return (
    <DemoContainer>
      <Title>Demostración de Notificaciones Toast</Title>
      
      <ButtonGroup>
        <Button $variant="success" onClick={showSuccessToast}>
          Mostrar Éxito
        </Button>
        
        <Button $variant="error" onClick={showErrorToast}>
          Mostrar Error
        </Button>
        
        <Button $variant="warning" onClick={showWarningToast}>
          Mostrar Advertencia
        </Button>
        
        <Button $variant="info" onClick={showInfoToast}>
          Mostrar Información
        </Button>
        
        <Button $variant="info" onClick={showCustomDurationToast}>
          Duración Personalizada (10s)
        </Button>
      </ButtonGroup>
    </DemoContainer>
  );
};

export default ToastDemo;
