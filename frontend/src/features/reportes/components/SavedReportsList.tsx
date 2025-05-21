import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiFileText, 
  FiEdit, 
  FiTrash2, 
  FiPlay,
  FiClock,
  FiSearch,
  FiPlus,
  FiX,
  FiAlertTriangle,
  FiInfo
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  useSavedReports, 
  useDeleteSavedReport, 
  useExecuteReport 
} from '../hooks/useCustomReports';
import { SavedReport } from '../types/customReportTypes';

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.cardBackground};
  color: ${({ theme, $primary }) => 
    $primary ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.border};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme, $primary }) => 
      $primary ? theme.primaryDark : theme.hoverBackground};
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundInput};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 0 12px;
  width: 300px;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  padding: 10px 0;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  width: 100%;
  
  &:focus {
    outline: none;
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ReportCard = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ReportHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ReportTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ReportDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReportContent = styled.div`
  padding: 16px;
`;

const ReportInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
`;

const InfoLabel = styled.span`
  color: ${({ theme }) => theme.textSecondary};
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const ReportFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const FooterInfo = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover {
    background-color: ${({ theme }) => theme.error + '20'};
    color: ${({ theme }) => theme.error};
    border-color: ${({ theme }) => theme.error};
  }
`;

const ConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: 24px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const DialogTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const DialogMessage = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0 0 24px 0;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.border};
  grid-column: 1 / -1;
`;

const LoadingSpinner = styled(FiClock)`
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

interface SavedReportsListProps {
  onCreateReport: () => void;
  onEditReport: (report: SavedReport) => void;
  onViewResults: (report: SavedReport) => void;
}

/**
 * Componente para mostrar la lista de reportes guardados
 */
const SavedReportsList: React.FC<SavedReportsListProps> = ({
  onCreateReport,
  onEditReport,
  onViewResults
}) => {
  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para el diálogo de confirmación
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    reportId: string;
    reportName: string;
  }>({
    show: false,
    reportId: '',
    reportName: ''
  });
  
  // Consultas
  const { data: reports, isLoading, isError } = useSavedReports();
  const deleteReport = useDeleteSavedReport();
  const executeReport = useExecuteReport();
  
  // Función para ejecutar un reporte
  const handleExecuteReport = (report: SavedReport) => {
    executeReport.mutate(report.definition, {
      onSuccess: () => {
        onViewResults(report);
      }
    });
  };
  
  // Función para eliminar un reporte
  const handleDeleteReport = () => {
    if (confirmDialog.reportId) {
      deleteReport.mutate(confirmDialog.reportId);
      setConfirmDialog({
        show: false,
        reportId: '',
        reportName: ''
      });
    }
  };
  
  // Función para mostrar el diálogo de confirmación
  const showDeleteConfirm = (report: SavedReport) => {
    setConfirmDialog({
      show: true,
      reportId: report.id,
      reportName: report.name
    });
  };
  
  // Filtrar reportes por término de búsqueda
  const filteredReports = reports
    ? reports.filter(report => 
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];
  
  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };
  
  return (
    <Container>
      <Header>
        <Title>
          <FiFileText size={24} />
          Reportes Guardados
        </Title>
        
        <ActionButtons>
          <SearchContainer>
            <FiSearch size={16} style={{ color: '#888', marginRight: '8px' }} />
            <SearchInput 
              placeholder="Buscar reportes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          
          <Button $primary onClick={onCreateReport}>
            <FiPlus size={16} />
            Nuevo Reporte
          </Button>
        </ActionButtons>
      </Header>
      
      <ReportsGrid>
        {isLoading ? (
          <EmptyState>
            <LoadingSpinner size={48} style={{ marginBottom: '16px' }} />
            <div>Cargando reportes guardados...</div>
          </EmptyState>
        ) : isError ? (
          <EmptyState>
            <FiAlertTriangle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <div>Error al cargar los reportes guardados.</div>
            <div style={{ marginTop: '8px', fontSize: '13px' }}>
              Por favor, intenta recargar la página.
            </div>
          </EmptyState>
        ) : filteredReports.length === 0 ? (
          <EmptyState>
            <FiInfo size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <div>No hay reportes guardados.</div>
            <div style={{ marginTop: '8px', fontSize: '13px' }}>
              Haz clic en "Nuevo Reporte" para crear uno.
            </div>
          </EmptyState>
        ) : (
          filteredReports.map(report => (
            <ReportCard key={report.id}>
              <ReportHeader>
                <ReportTitle>
                  <FiFileText size={16} />
                  {report.name}
                </ReportTitle>
                {report.description && (
                  <ReportDescription>{report.description}</ReportDescription>
                )}
              </ReportHeader>
              
              <ReportContent>
                <ReportInfo>
                  <InfoItem>
                    <InfoLabel>Campos</InfoLabel>
                    <InfoValue>{report.definition.fields.length}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Filtros</InfoLabel>
                    <InfoValue>{report.definition.filters.length}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Agrupación</InfoLabel>
                    <InfoValue>
                      {report.definition.groupBy && report.definition.groupBy.length > 0
                        ? 'Sí'
                        : 'No'}
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Creado</InfoLabel>
                    <InfoValue>{formatDate(report.createdAt)}</InfoValue>
                  </InfoItem>
                </ReportInfo>
              </ReportContent>
              
              <ReportFooter>
                <FooterInfo>
                  Actualizado: {formatDate(report.updatedAt)}
                </FooterInfo>
                
                <CardActions>
                  <ActionButton 
                    onClick={() => handleExecuteReport(report)}
                    title="Ejecutar reporte"
                  >
                    <FiPlay size={16} />
                  </ActionButton>
                  <ActionButton 
                    onClick={() => onEditReport(report)}
                    title="Editar reporte"
                  >
                    <FiEdit size={16} />
                  </ActionButton>
                  <DeleteButton 
                    onClick={() => showDeleteConfirm(report)}
                    title="Eliminar reporte"
                  >
                    <FiTrash2 size={16} />
                  </DeleteButton>
                </CardActions>
              </ReportFooter>
            </ReportCard>
          ))
        )}
      </ReportsGrid>
      
      {/* Diálogo de confirmación para eliminar */}
      {confirmDialog.show && (
        <ConfirmDialog onClick={() => setConfirmDialog({ ...confirmDialog, show: false })}>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <FiAlertTriangle size={24} color="#f59e0b" />
              <DialogTitle>Eliminar Reporte</DialogTitle>
            </DialogHeader>
            
            <DialogMessage>
              ¿Estás seguro de que deseas eliminar el reporte "{confirmDialog.reportName}"? Esta acción no se puede deshacer.
            </DialogMessage>
            
            <DialogActions>
              <Button onClick={() => setConfirmDialog({ ...confirmDialog, show: false })}>
                Cancelar
              </Button>
              <Button 
                onClick={handleDeleteReport}
                style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', color: '#fff' }}
              >
                <FiTrash2 size={16} />
                Eliminar
              </Button>
            </DialogActions>
          </DialogContent>
        </ConfirmDialog>
      )}
    </Container>
  );
};

export default SavedReportsList;
