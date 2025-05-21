import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiActivity, 
  FiServer, 
  FiDatabase, 
  FiList,
  FiTool,
  FiHardDrive,
  FiCpu,
  FiRefreshCw
} from 'react-icons/fi';

import SystemHealthCard from './SystemHealthCard';
import SystemResourcesCard from './SystemResourcesCard';
import DatabaseStatsCard from './DatabaseStatsCard';
import SystemLogsCard from './SystemLogsCard';
import MaintenanceTasksCard from './MaintenanceTasksCard';

// Estilos
const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 8px;
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $active }) => 
    $active ? theme.primary : 'transparent'};
  color: ${({ theme, $active }) => 
    $active ? '#fff' : theme.text};
  border: none;
  
  &:hover {
    background-color: ${({ theme, $active }) => 
      $active ? theme.primary : theme.hoverBackground};
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
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

// Tipos de pestañas
type TabType = 'overview' | 'health' | 'resources' | 'database' | 'logs' | 'maintenance';

/**
 * Componente principal para las herramientas de diagnóstico y mantenimiento
 */
const SystemMonitor: React.FC = () => {
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Función para refrescar todos los datos
  const handleRefreshAll = () => {
    setIsRefreshing(true);
    
    // Simular refresco (en una implementación real, se refrescarían todos los datos)
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };
  
  // Renderizar contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <SystemHealthCard />
            <SystemResourcesCard />
          </>
        );
      case 'health':
        return <SystemHealthCard />;
      case 'resources':
        return <SystemResourcesCard />;
      case 'database':
        return <DatabaseStatsCard />;
      case 'logs':
        return <SystemLogsCard />;
      case 'maintenance':
        return <MaintenanceTasksCard />;
      default:
        return null;
    }
  };
  
  return (
    <Container>
      <Header>
        <Title>
          <FiActivity size={24} />
          Monitor del Sistema
        </Title>
        <RefreshButton onClick={handleRefreshAll} disabled={isRefreshing}>
          {isRefreshing ? (
            <>
              <LoadingSpinner size={16} />
              Actualizando...
            </>
          ) : (
            <>
              <FiRefreshCw size={16} />
              Actualizar Todo
            </>
          )}
        </RefreshButton>
      </Header>
      
      <TabsContainer>
        <Tab 
          $active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          <FiActivity size={16} />
          Resumen
        </Tab>
        <Tab 
          $active={activeTab === 'health'} 
          onClick={() => setActiveTab('health')}
        >
          <FiServer size={16} />
          Salud del Sistema
        </Tab>
        <Tab 
          $active={activeTab === 'resources'} 
          onClick={() => setActiveTab('resources')}
        >
          <FiCpu size={16} />
          Recursos
        </Tab>
        <Tab 
          $active={activeTab === 'database'} 
          onClick={() => setActiveTab('database')}
        >
          <FiDatabase size={16} />
          Base de Datos
        </Tab>
        <Tab 
          $active={activeTab === 'logs'} 
          onClick={() => setActiveTab('logs')}
        >
          <FiList size={16} />
          Logs
        </Tab>
        <Tab 
          $active={activeTab === 'maintenance'} 
          onClick={() => setActiveTab('maintenance')}
        >
          <FiTool size={16} />
          Mantenimiento
        </Tab>
      </TabsContainer>
      
      <Content>
        {renderContent()}
      </Content>
    </Container>
  );
};

export default SystemMonitor;
