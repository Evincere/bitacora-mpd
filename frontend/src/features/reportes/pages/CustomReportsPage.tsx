import React, { useState } from 'react';
import styled from 'styled-components';
import { PageTransition } from '@/components/ui';
import { 
  FiFileText, 
  FiClock, 
  FiList, 
  FiChevronRight,
  FiArrowLeft
} from 'react-icons/fi';
import ReportBuilder from '../components/ReportBuilder';
import SavedReportsList from '../components/SavedReportsList';
import ScheduledReportsList from '../components/ScheduledReportsList';
import { SavedReport, ReportSchedule } from '../types/customReportTypes';

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

type TabType = 'saved' | 'scheduled' | 'builder';

/**
 * Página principal para el sistema de reportes personalizables
 */
const CustomReportsPage: React.FC = () => {
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState<TabType>('saved');
  
  // Estado para el reporte en edición
  const [editingReport, setEditingReport] = useState<SavedReport | null>(null);
  
  // Estado para el reporte con resultados
  const [resultReport, setResultReport] = useState<SavedReport | null>(null);
  
  // Función para crear un nuevo reporte
  const handleCreateReport = () => {
    setEditingReport(null);
    setResultReport(null);
    setActiveTab('builder');
  };
  
  // Función para editar un reporte
  const handleEditReport = (report: SavedReport) => {
    setEditingReport(report);
    setResultReport(null);
    setActiveTab('builder');
  };
  
  // Función para ver resultados de un reporte
  const handleViewResults = (report: SavedReport) => {
    setEditingReport(null);
    setResultReport(report);
    setActiveTab('builder');
  };
  
  // Función para editar una programación
  const handleEditSchedule = (schedule: ReportSchedule) => {
    // Aquí iría la lógica para editar una programación
    console.log('Editar programación:', schedule);
  };
  
  // Función para volver a la lista de reportes
  const handleBackToList = () => {
    setEditingReport(null);
    setResultReport(null);
    setActiveTab('saved');
  };
  
  // Renderizar contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case 'saved':
        return (
          <SavedReportsList 
            onCreateReport={handleCreateReport}
            onEditReport={handleEditReport}
            onViewResults={handleViewResults}
          />
        );
      case 'scheduled':
        return (
          <ScheduledReportsList 
            onEditSchedule={handleEditSchedule}
          />
        );
      case 'builder':
        return (
          <>
            <BreadcrumbContainer>
              <BackButton onClick={handleBackToList}>
                <FiArrowLeft size={16} />
                Volver a la lista
              </BackButton>
              <Breadcrumb>
                <BreadcrumbItem onClick={handleBackToList} style={{ cursor: 'pointer' }}>
                  Reportes
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <FiChevronRight size={14} />
                </BreadcrumbSeparator>
                <BreadcrumbItem $active>
                  {editingReport ? `Editar: ${editingReport.name}` : 
                   resultReport ? `Resultados: ${resultReport.name}` : 
                   'Nuevo Reporte'}
                </BreadcrumbItem>
              </Breadcrumb>
            </BreadcrumbContainer>
            <ReportBuilder initialReport={editingReport || resultReport} />
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <PageTransition>
      <Container>
        {activeTab !== 'builder' && (
          <TabsContainer>
            <Tab 
              $active={activeTab === 'saved'} 
              onClick={() => setActiveTab('saved')}
            >
              <FiFileText size={16} />
              Reportes Guardados
            </Tab>
            <Tab 
              $active={activeTab === 'scheduled'} 
              onClick={() => setActiveTab('scheduled')}
            >
              <FiClock size={16} />
              Reportes Programados
            </Tab>
          </TabsContainer>
        )}
        
        <Content>
          {renderContent()}
        </Content>
      </Container>
    </PageTransition>
  );
};

export default CustomReportsPage;
