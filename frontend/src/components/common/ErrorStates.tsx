import React from 'react';
import styled from 'styled-components';
import {
  FiAlertTriangle,
  FiServer,
  FiWifiOff,
  FiDatabase,
  FiRefreshCw,
  FiLock
} from 'react-icons/fi';

interface ErrorStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  details?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  text-align: center;
  margin: 20px 0;
`;

const IconWrapper = styled.div`
  font-size: 48px;
  color: ${({ theme }) => theme.error};
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px;
  color: ${({ theme }) => theme.text};
`;

const Message = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0 0 24px;
  max-width: 500px;
`;

const Details = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0 0 24px;
  padding: 12px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 4px;
  max-width: 100%;
  overflow-x: auto;
  text-align: left;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  icon,
  actionLabel,
  onAction,
  details
}) => {
  return (
    <Container>
      <IconWrapper>
        {icon || <FiAlertTriangle />}
      </IconWrapper>
      <Title>{title}</Title>
      <Message>{message}</Message>
      {details && <Details>{details}</Details>}
      {actionLabel && onAction && (
        <ActionButton onClick={onAction}>
          <FiRefreshCw size={16} />
          {actionLabel}
        </ActionButton>
      )}
    </Container>
  );
};

export const ServerErrorState: React.FC<{
  error?: any;
  onRetry?: () => void;
}> = ({ error, onRetry }) => {
  return (
    <ErrorState
      title="Error en el servidor"
      message="Ha ocurrido un error en el servidor al procesar tu solicitud. Por favor, intenta nuevamente más tarde."
      icon={<FiServer />}
      actionLabel="Reintentar"
      onAction={onRetry}
      details={error?.message || 'Error interno del servidor (500)'}
    />
  );
};

export const ConnectionErrorState: React.FC<{
  onRetry?: () => void;
  error?: any;
}> = ({ onRetry, error }) => {
  // Detectar si es un error de ruta no encontrada (404)
  const isNotFoundError = error?.status === 404 || error?.message?.includes('not found');

  return (
    <ErrorState
      title={isNotFoundError ? "Recurso no encontrado" : "Error de conexión"}
      message={isNotFoundError
        ? "La ruta solicitada no existe en el servidor. Verifica la configuración de la API."
        : "No se pudo establecer conexión con el servidor. Verifica tu conexión a internet y que el servidor esté en funcionamiento."}
      icon={isNotFoundError ? <FiDatabase /> : <FiWifiOff />}
      actionLabel="Reintentar"
      onAction={onRetry}
      details={error?.message}
    />
  );
};

export const NoDataErrorState: React.FC<{
  onClearFilters?: () => void;
}> = ({ onClearFilters }) => {
  return (
    <ErrorState
      title="No hay datos disponibles"
      message="No se encontraron actividades que coincidan con los criterios de búsqueda."
      icon={<FiDatabase />}
      actionLabel={onClearFilters ? "Limpiar filtros" : undefined}
      onAction={onClearFilters}
    />
  );
};

export const AuthErrorState: React.FC<{
  onLogin?: () => void;
}> = ({ onLogin }) => {
  return (
    <ErrorState
      title="Acceso restringido"
      message="Debes iniciar sesión para acceder a esta funcionalidad."
      icon={<FiLock />}
      actionLabel="Iniciar sesión"
      onAction={onLogin}
    />
  );
};

export default {
  ErrorState,
  ServerErrorState,
  ConnectionErrorState,
  NoDataErrorState,
  AuthErrorState
};
