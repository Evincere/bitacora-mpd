import React from 'react';
import styled from 'styled-components';
import { FiSettings } from 'react-icons/fi';
import { 
  PerformanceConfig, 
  SecurityConfig, 
  EmailConfig, 
  MaintenanceConfig, 
  FeaturesConfig 
} from '../components';
import { PageTransition } from '@/components/ui';

// Estilos
const PageContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
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
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  overflow-x: auto;
  padding-bottom: 1px;

  @media (max-width: 768px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 8px;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 16px;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid ${({ theme, $active }) => 
    $active ? theme.primary : 'transparent'};
  color: ${({ theme, $active }) => 
    $active ? theme.primary : theme.textSecondary};
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${({ theme, $active }) => 
      $active ? theme.primary : theme.text};
    border-bottom-color: ${({ theme, $active }) => 
      $active ? theme.primary : theme.border};
  }
`;

const ConfiguracionGeneral: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('performance');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'performance':
        return <PerformanceConfig />;
      case 'security':
        return <SecurityConfig />;
      case 'email':
        return <EmailConfig />;
      case 'maintenance':
        return <MaintenanceConfig />;
      case 'features':
        return <FeaturesConfig />;
      default:
        return <PerformanceConfig />;
    }
  };

  return (
    <PageTransition>
      <PageContainer>
        <PageHeader>
          <PageTitle>
            <FiSettings size={24} />
            Configuración General
          </PageTitle>
        </PageHeader>

        <TabsContainer>
          <Tab 
            $active={activeTab === 'performance'} 
            onClick={() => setActiveTab('performance')}
          >
            Rendimiento
          </Tab>
          <Tab 
            $active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
          >
            Seguridad
          </Tab>
          <Tab 
            $active={activeTab === 'email'} 
            onClick={() => setActiveTab('email')}
          >
            Correo Electrónico
          </Tab>
          <Tab 
            $active={activeTab === 'maintenance'} 
            onClick={() => setActiveTab('maintenance')}
          >
            Mantenimiento
          </Tab>
          <Tab 
            $active={activeTab === 'features'} 
            onClick={() => setActiveTab('features')}
          >
            Características
          </Tab>
        </TabsContainer>

        {renderTabContent()}
      </PageContainer>
    </PageTransition>
  );
};

export default ConfiguracionGeneral;
