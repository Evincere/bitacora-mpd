import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiActivity, 
  FiCheck, 
  FiX, 
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi';
import { useTestConnection } from '../hooks/useIntegrations';

// Estilos
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${({ theme, $primary }) => 
    $primary ? theme.primary : 'transparent'};
  color: ${({ theme, $primary }) => 
    $primary ? '#fff' : theme.textSecondary};
  border: 1px solid ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.border};

  &:hover {
    background-color: ${({ theme, $primary }) => 
      $primary ? theme.primaryDark : theme.backgroundHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled.div<{ $success?: boolean }>`
  margin-top: 16px;
  padding: 12px;
  border-radius: 6px;
  background-color: ${({ theme, $success }) => 
    $success === undefined ? theme.backgroundAlt :
    $success ? theme.success + '10' : theme.error + '10'};
  border-left: 3px solid ${({ theme, $success }) => 
    $success === undefined ? theme.border :
    $success ? theme.success : theme.error};
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
`;

const ResultMessage = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ResultDetails = styled.div`
  margin-top: 8px;
  padding: 8px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  white-space: pre-wrap;
  max-height: 150px;
  overflow-y: auto;
`;

const LoadingSpinner = styled(FiLoader)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

interface ConnectionTestProps {
  integrationId: string;
  integrationName: string;
}

const ConnectionTest: React.FC<ConnectionTestProps> = ({ 
  integrationId, 
  integrationName 
}) => {
  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message: string;
    details?: string;
  } | null>(null);
  
  const testConnection = useTestConnection();

  const handleTestConnection = async () => {
    setTestResult({ message: 'Probando conexión...' });
    
    try {
      const result = await testConnection.mutateAsync(integrationId);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Error al probar la conexión',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          <FiActivity size={16} />
          Prueba de conexión
        </Title>
        <Button 
          $primary 
          onClick={handleTestConnection}
          disabled={testConnection.isPending}
        >
          {testConnection.isPending ? (
            <>
              <LoadingSpinner size={14} />
              Probando...
            </>
          ) : (
            <>
              <FiActivity size={14} />
              Probar conexión
            </>
          )}
        </Button>
      </Header>

      {testResult && (
        <ResultContainer $success={testResult.success}>
          <ResultHeader>
            {testResult.success === undefined ? (
              <FiActivity size={16} />
            ) : testResult.success ? (
              <FiCheck size={16} color="#4caf50" />
            ) : (
              <FiX size={16} color="#f44336" />
            )}
            {testResult.success === undefined
              ? 'Probando conexión con ' + integrationName
              : testResult.success
              ? 'Conexión exitosa con ' + integrationName
              : 'Error de conexión con ' + integrationName}
          </ResultHeader>
          <ResultMessage>{testResult.message}</ResultMessage>
          {testResult.details && (
            <ResultDetails>{testResult.details}</ResultDetails>
          )}
        </ResultContainer>
      )}

      {!testResult && (
        <ResultContainer>
          <ResultHeader>
            <FiAlertCircle size={16} />
            No se ha probado la conexión
          </ResultHeader>
          <ResultMessage>
            Haga clic en el botón "Probar conexión" para verificar la conectividad con {integrationName}.
          </ResultMessage>
        </ResultContainer>
      )}
    </Container>
  );
};

export default ConnectionTest;
