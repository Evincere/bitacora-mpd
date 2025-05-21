import React, { useState } from 'react';
import styled from 'styled-components';
import { PageTransition } from '@/components/ui';
import { 
  FiAlertTriangle, 
  FiBarChart2, 
  FiShield, 
  FiChevronRight,
  FiArrowLeft
} from 'react-icons/fi';
import SecurityAlertsList from '../components/SecurityAlertsList';
import SecurityAlertStatistics from '../components/SecurityAlertStatistics';
import SecurityAlertRules from '../components/SecurityAlertRules';
import { SecurityAlertRule } from '../types/securityAlertTypes';

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundSecondary};
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background-color: ${({ theme, $active }) => 
    $active ? theme.cardBackground : 'transparent'};
  color: ${({ theme, $active }) => 
    $active ? theme.primary : theme.text};
  border: none;
  border-bottom: 2px solid ${({ theme, $active }) => 
    $active ? theme.primary : 'transparent'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    background-color: ${({ theme, $active }) => 
      $active ? theme.cardBackground : theme.hoverBackground};
  }
`;

const Content = styled.div`
  flex: 1;
  overflow: auto;
  padding: 20px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const BreadcrumbItem = styled.span<{ $active?: boolean }>`
  color: ${({ theme, $active }) => 
    $active ? theme.primary : theme.textSecondary};
  font-weight: ${({ $active }) => 
    $active ? '500' : '400'};
`;

const BreadcrumbSeparator = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textTertiary};
`;

type TabType = 'alerts' | 'statistics' | 'rules' | 'rule-editor';

/**
 * Página principal para el sistema de alertas de seguridad
 */
const SecurityAlertsPage: React.FC = () => {
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState<TabType>('alerts');
  
  // Estado para la regla en edición
  const [editingRule, setEditingRule] = useState<SecurityAlertRule | null>(null);
  
  // Función para ver un registro de auditoría
  const handleViewAuditLog = (logId: string) => {
    // Aquí iría la lógica para ver un registro de auditoría
    console.log('Ver registro de auditoría:', logId);
  };
  
  // Función para crear una nueva regla
  const handleCreateRule = () => {
    setEditingRule(null);
    setActiveTab('rule-editor');
  };
  
  // Función para editar una regla
  const handleEditRule = (rule: SecurityAlertRule) => {
    setEditingRule(rule);
    setActiveTab('rule-editor');
  };
  
  // Función para volver a la lista de reglas
  const handleBackToRules = () => {
    setEditingRule(null);
    setActiveTab('rules');
  };
  
  // Renderizar contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case 'alerts':
        return (
          <SecurityAlertsList 
            onViewAuditLog={handleViewAuditLog}
          />
        );
      case 'statistics':
        return (
          <SecurityAlertStatistics />
        );
      case 'rules':
        return (
          <SecurityAlertRules 
            onCreateRule={handleCreateRule}
            onEditRule={handleEditRule}
          />
        );
      case 'rule-editor':
        return (
          <>
            <BreadcrumbContainer>
              <BackButton onClick={handleBackToRules}>
                <FiArrowLeft size={16} />
                Volver a las reglas
              </BackButton>
              <Breadcrumb>
                <BreadcrumbItem onClick={() => setActiveTab('rules')} style={{ cursor: 'pointer' }}>
                  Reglas de Alertas
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <FiChevronRight size={14} />
                </BreadcrumbSeparator>
                <BreadcrumbItem $active>
                  {editingRule ? `Editar: ${editingRule.name}` : 'Nueva Regla'}
                </BreadcrumbItem>
              </Breadcrumb>
            </BreadcrumbContainer>
            <div style={{ padding: '20px' }}>
              {/* Aquí iría el componente de edición de reglas */}
              <p>Componente de edición de reglas (pendiente de implementación)</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <PageTransition>
      <Container>
        {activeTab !== 'rule-editor' && (
          <TabsContainer>
            <Tab 
              $active={activeTab === 'alerts'} 
              onClick={() => setActiveTab('alerts')}
            >
              <FiAlertTriangle size={16} />
              Alertas
            </Tab>
            <Tab 
              $active={activeTab === 'statistics'} 
              onClick={() => setActiveTab('statistics')}
            >
              <FiBarChart2 size={16} />
              Estadísticas
            </Tab>
            <Tab 
              $active={activeTab === 'rules'} 
              onClick={() => setActiveTab('rules')}
            >
              <FiShield size={16} />
              Reglas
            </Tab>
          </TabsContainer>
        )}
        
        {activeTab === 'rule-editor' ? (
          renderContent()
        ) : (
          <Content>
            {renderContent()}
          </Content>
        )}
      </Container>
    </PageTransition>
  );
};

export default SecurityAlertsPage;
