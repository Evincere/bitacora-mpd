import React from 'react';
import styled from 'styled-components';
import { 
  FiCpu, 
  FiHardDrive, 
  FiDatabase, 
  FiServer,
  FiRefreshCw,
  FiXCircle
} from 'react-icons/fi';
import { useSystemResources } from '../hooks/useDiagnosticTools';

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

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

const ResourceCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ResourceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResourceName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ResourceValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.border};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background-color: ${({ $percentage, theme }) => 
    $percentage < 70 ? theme.success : 
    $percentage < 90 ? theme.warning : 
    theme.error};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const ResourceDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 4px;
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
 * Componente para mostrar los recursos del sistema
 */
const SystemResourcesCard: React.FC = () => {
  const { data: resources, isLoading, isError, refetch } = useSystemResources();
  
  // Función para obtener el icono de un recurso
  const getResourceIcon = (resourceName: string) => {
    const name = resourceName.toLowerCase();
    
    if (name.includes('cpu')) {
      return <FiCpu size={18} />;
    } else if (name.includes('memoria') || name.includes('memory') || name.includes('heap')) {
      return <FiServer size={18} />;
    } else if (name.includes('disco') || name.includes('disk')) {
      return <FiHardDrive size={18} />;
    } else if (name.includes('db') || name.includes('database') || name.includes('conexiones')) {
      return <FiDatabase size={18} />;
    } else {
      return <FiServer size={18} />;
    }
  };
  
  // Renderizar estado de carga
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <FiCpu size={20} />
            Recursos del Sistema
          </CardTitle>
        </CardHeader>
        <EmptyState>
          <LoadingSpinner size={48} />
          <EmptyStateText>Cargando recursos del sistema...</EmptyStateText>
        </EmptyState>
      </Card>
    );
  }
  
  // Renderizar estado de error
  if (isError || !resources) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <FiCpu size={20} />
            Recursos del Sistema
          </CardTitle>
          <RefreshButton onClick={() => refetch()}>
            <FiRefreshCw size={18} />
          </RefreshButton>
        </CardHeader>
        <EmptyState>
          <EmptyStateIcon>
            <FiXCircle />
          </EmptyStateIcon>
          <EmptyStateText>Error al cargar los recursos del sistema</EmptyStateText>
        </EmptyState>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FiCpu size={20} />
          Recursos del Sistema
        </CardTitle>
        <RefreshButton onClick={() => refetch()}>
          <FiRefreshCw size={18} />
        </RefreshButton>
      </CardHeader>
      
      <ResourcesGrid>
        {resources.map((resource, index) => {
          const percentage = (resource.usage / resource.total) * 100;
          
          return (
            <ResourceCard key={index}>
              <ResourceHeader>
                <ResourceName>
                  {getResourceIcon(resource.name)}
                  {resource.name}
                </ResourceName>
                <ResourceValue>
                  {resource.usage} / {resource.total} {resource.unit}
                </ResourceValue>
              </ResourceHeader>
              
              <ProgressBarContainer>
                <ProgressBar $percentage={percentage} />
              </ProgressBarContainer>
              
              <ResourceDetails>
                <span>0 {resource.unit}</span>
                <span>{Math.round(percentage)}%</span>
                <span>{resource.total} {resource.unit}</span>
              </ResourceDetails>
            </ResourceCard>
          );
        })}
      </ResourcesGrid>
    </Card>
  );
};

export default SystemResourcesCard;
