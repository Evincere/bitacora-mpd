import React from 'react';
import styled from 'styled-components';
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertTriangle, 
  FiDatabase, 
  FiHardDrive,
  FiCpu,
  FiMail,
  FiServer,
  FiRefreshCw,
  FiInfo
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSystemHealth } from '../hooks/useDiagnosticTools';
import { ComponentHealth } from '../types/diagnosticTypes';

// Estilos
const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
    color: ${({ theme }) => theme.text};
  }
`;

const StatusBadge = styled.div<{ $status: 'UP' | 'DOWN' | 'UNKNOWN' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${({ $status, theme }) => 
    $status === 'UP' ? theme.success + '20' : 
    $status === 'DOWN' ? theme.error + '20' : 
    theme.warning + '20'};
  color: ${({ $status, theme }) => 
    $status === 'UP' ? theme.success : 
    $status === 'DOWN' ? theme.error : 
    theme.warning};
  border: 1px solid ${({ $status, theme }) => 
    $status === 'UP' ? theme.success + '30' : 
    $status === 'DOWN' ? theme.error + '30' : 
    theme.warning + '30'};
`;

const ComponentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const ComponentCard = styled.div<{ $status: 'UP' | 'DOWN' | 'UNKNOWN' }>`
  background-color: ${({ $status, theme }) => 
    $status === 'UP' ? theme.success + '05' : 
    $status === 'DOWN' ? theme.error + '05' : 
    theme.warning + '05'};
  border: 1px solid ${({ $status, theme }) => 
    $status === 'UP' ? theme.success + '20' : 
    $status === 'DOWN' ? theme.error + '20' : 
    theme.warning + '20'};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ComponentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ComponentName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ComponentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`;

const DetailLabel = styled.span`
  color: ${({ theme }) => theme.textSecondary};
`;

const DetailValue = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const LastUpdated = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 16px;
  text-align: right;
`;

const LoadingSpinner = styled(FiRefreshCw)`
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.textTertiary};
`;

const EmptyStateText = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
`;

/**
 * Componente para mostrar el estado de salud del sistema
 */
const SystemHealthCard: React.FC = () => {
  const { data: health, isLoading, isError, refetch } = useSystemHealth();
  
  // Función para obtener el icono de un componente
  const getComponentIcon = (componentName: string) => {
    switch (componentName.toLowerCase()) {
      case 'database':
        return <FiDatabase size={18} />;
      case 'diskspace':
        return <FiHardDrive size={18} />;
      case 'jvm':
        return <FiCpu size={18} />;
      case 'mail':
        return <FiMail size={18} />;
      case 'redis':
        return <FiServer size={18} />;
      default:
        return <FiInfo size={18} />;
    }
  };
  
  // Función para obtener el icono de estado
  const getStatusIcon = (status: 'UP' | 'DOWN' | 'UNKNOWN') => {
    switch (status) {
      case 'UP':
        return <FiCheckCircle size={16} />;
      case 'DOWN':
        return <FiXCircle size={16} />;
      case 'UNKNOWN':
        return <FiAlertTriangle size={16} />;
    }
  };
  
  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm:ss', { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };
  
  // Función para renderizar detalles de un componente
  const renderComponentDetails = (component: ComponentHealth) => {
    if (!component.details) return null;
    
    return (
      <ComponentDetails>
        {Object.entries(component.details).map(([key, value]) => (
          <DetailItem key={key}>
            <DetailLabel>{key}</DetailLabel>
            <DetailValue>{typeof value === 'object' ? JSON.stringify(value) : value}</DetailValue>
          </DetailItem>
        ))}
      </ComponentDetails>
    );
  };
  
  // Renderizar estado de carga
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <FiServer size={20} />
            Estado de Salud del Sistema
          </CardTitle>
        </CardHeader>
        <EmptyState>
          <LoadingSpinner size={48} />
          <EmptyStateText>Cargando estado del sistema...</EmptyStateText>
        </EmptyState>
      </Card>
    );
  }
  
  // Renderizar estado de error
  if (isError || !health) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <FiServer size={20} />
            Estado de Salud del Sistema
          </CardTitle>
          <RefreshButton onClick={() => refetch()}>
            <FiRefreshCw size={18} />
          </RefreshButton>
        </CardHeader>
        <EmptyState>
          <EmptyStateIcon>
            <FiXCircle />
          </EmptyStateIcon>
          <EmptyStateText>Error al cargar el estado del sistema</EmptyStateText>
        </EmptyState>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FiServer size={20} />
          Estado de Salud del Sistema
          <StatusBadge $status={health.status}>
            {getStatusIcon(health.status)}
            {health.status === 'UP' ? 'Operativo' : health.status === 'DOWN' ? 'Caído' : 'Desconocido'}
          </StatusBadge>
        </CardTitle>
        <RefreshButton onClick={() => refetch()}>
          <FiRefreshCw size={18} />
        </RefreshButton>
      </CardHeader>
      
      <ComponentsGrid>
        {Object.entries(health.components).map(([name, component]) => (
          <ComponentCard key={name} $status={component.status}>
            <ComponentHeader>
              <ComponentName>
                {getComponentIcon(name)}
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </ComponentName>
              <StatusBadge $status={component.status}>
                {getStatusIcon(component.status)}
                {component.status}
              </StatusBadge>
            </ComponentHeader>
            
            {renderComponentDetails(component)}
          </ComponentCard>
        ))}
      </ComponentsGrid>
      
      <LastUpdated>
        Última actualización: {formatDate(health.lastUpdated)}
      </LastUpdated>
    </Card>
  );
};

export default SystemHealthCard;
