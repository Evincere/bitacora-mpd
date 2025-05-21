import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiDownload, 
  FiRefreshCw, 
  FiBarChart2, 
  FiPieChart,
  FiTrendingUp,
  FiGrid,
  FiClock,
  FiInfo,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ReportResult, ReportExportFormat } from '../types/customReportTypes';

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ExecutionInfo = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.cardBackground};
  color: ${({ theme, $primary }) => 
    $primary ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.border};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme, $primary }) => 
      $primary ? theme.primaryDark : theme.hoverBackground};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const VisualizationTabs = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 8px;
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: ${({ theme, $active }) => 
    $active ? theme.primary : 'transparent'};
  color: ${({ theme, $active }) => 
    $active ? '#fff' : theme.text};
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme, $active }) => 
      $active ? theme.primary : theme.hoverBackground};
  }
`;

const TableContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.backgroundSecondary};
`;

const TableHeadCell = styled.th<{ $sortable?: boolean }>`
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  
  &:hover {
    color: ${({ theme, $sortable }) => ($sortable ? theme.primary : theme.text)};
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.backgroundSecondary + '30'};
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const GroupRow = styled.tr`
  background-color: ${({ theme }) => theme.backgroundSecondary};
`;

const GroupCell = styled.td`
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const PaginationInfo = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${({ theme, $active }) => 
    $active ? theme.primary : theme.cardBackground};
  color: ${({ theme, $active }) => 
    $active ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $active }) => 
    $active ? theme.primary : theme.border};
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme, $active }) => 
      $active ? theme.primaryDark : theme.hoverBackground};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

const ChartContainer = styled.div`
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 20px;
`;

type VisualizationType = 'table' | 'bar' | 'line' | 'pie';

interface ReportResultsProps {
  result?: ReportResult;
  isLoading: boolean;
  onRefresh: () => void;
  onExport: (format: ReportExportFormat) => void;
}

/**
 * Componente para mostrar los resultados de un reporte
 */
const ReportResults: React.FC<ReportResultsProps> = ({
  result,
  isLoading,
  onRefresh,
  onExport
}) => {
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Estado para la visualización
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('table');
  
  // Estado para los grupos expandidos
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  // Función para formatear un valor según su tipo
  const formatValue = (value: any, columnId: string): string => {
    if (value === null || value === undefined) {
      return '-';
    }
    
    // Intentar determinar el tipo de valor
    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
    } else if (typeof value === 'number') {
      return value.toLocaleString('es-AR');
    } else if (typeof value === 'string') {
      // Verificar si es una fecha
      if (columnId.includes('date') || columnId.includes('_at')) {
        try {
          return format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: es });
        } catch (error) {
          return value;
        }
      }
      return value;
    } else {
      return JSON.stringify(value);
    }
  };
  
  // Función para alternar un grupo
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };
  
  // Calcular datos paginados
  const getPaginatedData = () => {
    if (!result) return [];
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return result.data.slice(startIndex, endIndex);
  };
  
  // Calcular total de páginas
  const totalPages = result ? Math.ceil(result.data.length / pageSize) : 0;
  
  // Renderizar tabla de resultados
  const renderTable = () => {
    if (!result) return null;
    
    // Si hay datos agrupados
    if (result.groupedData) {
      return (
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                {result.columns.map((column) => (
                  <TableHeadCell key={column.id}>
                    {column.name}
                  </TableHeadCell>
                ))}
              </tr>
            </TableHead>
            <TableBody>
              {result.groupedData.groups.map((group, groupIndex) => {
                const isExpanded = expandedGroups[group] || false;
                const groupData = result.groupedData?.data.filter(item => 
                  item[result.groupedData?.groups[0]] === group
                );
                
                return (
                  <React.Fragment key={groupIndex}>
                    <GroupRow>
                      <GroupCell 
                        colSpan={result.columns.length}
                        onClick={() => toggleGroup(group)}
                      >
                        {isExpanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                        {' '}
                        {result.columns[0].name}: {formatValue(group, result.columns[0].id)}
                        {' '}
                        ({groupData?.length} registros)
                      </GroupCell>
                    </GroupRow>
                    
                    {isExpanded && groupData?.map((row, rowIndex) => (
                      <TableRow key={`${groupIndex}-${rowIndex}`}>
                        {result.columns.map((column) => (
                          <TableCell key={column.id}>
                            {formatValue(row[column.id], column.id)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
    
    // Tabla normal sin agrupación
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              {result.columns.map((column) => (
                <TableHeadCell key={column.id}>
                  {column.name}
                </TableHeadCell>
              ))}
            </tr>
          </TableHead>
          <TableBody>
            {getPaginatedData().map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {result.columns.map((column) => (
                  <TableCell key={column.id}>
                    {formatValue(row[column.id], column.id)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <Pagination>
          <PaginationInfo>
            Mostrando {(currentPage - 1) * pageSize + 1} a {Math.min(currentPage * pageSize, result.data.length)} de {result.data.length} registros
          </PaginationInfo>
          
          <PaginationButtons>
            <PaginationButton
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              &laquo;
            </PaginationButton>
            <PaginationButton
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </PaginationButton>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3
                ? i + 1
                : currentPage >= totalPages - 2
                  ? totalPages - 4 + i
                  : currentPage - 2 + i;
              
              if (pageNum <= 0 || pageNum > totalPages) return null;
              
              return (
                <PaginationButton
                  key={pageNum}
                  $active={currentPage === pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </PaginationButton>
              );
            })}
            
            <PaginationButton
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </PaginationButton>
            <PaginationButton
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </PaginationButton>
          </PaginationButtons>
        </Pagination>
      </TableContainer>
    );
  };
  
  // Renderizar visualización de gráfico
  const renderChart = () => {
    return (
      <ChartContainer>
        <EmptyState>
          <FiInfo size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <div>La visualización de gráficos estará disponible próximamente.</div>
        </EmptyState>
      </ChartContainer>
    );
  };
  
  // Renderizar contenido según el tipo de visualización
  const renderContent = () => {
    if (isLoading) {
      return (
        <EmptyState>
          <LoadingSpinner size={48} style={{ marginBottom: '16px' }} />
          <div>Cargando resultados...</div>
        </EmptyState>
      );
    }
    
    if (!result || result.data.length === 0) {
      return (
        <EmptyState>
          <FiInfo size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <div>No hay resultados para mostrar.</div>
          <div style={{ marginTop: '8px', fontSize: '13px' }}>
            Intenta modificar los filtros o seleccionar otros campos.
          </div>
        </EmptyState>
      );
    }
    
    switch (visualizationType) {
      case 'table':
        return renderTable();
      case 'bar':
      case 'line':
      case 'pie':
        return renderChart();
      default:
        return renderTable();
    }
  };
  
  return (
    <Container>
      <Header>
        <div>
          <Title>
            Resultados
          </Title>
          {result && (
            <ExecutionInfo>
              <FiClock size={14} />
              Tiempo de ejecución: {result.executionTime.toFixed(2)} segundos
              {' | '}
              Total de registros: {result.totalRows}
            </ExecutionInfo>
          )}
        </div>
        
        <ActionButtons>
          <Button onClick={onRefresh} disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner size={14} />
                Cargando...
              </>
            ) : (
              <>
                <FiRefreshCw size={14} />
                Actualizar
              </>
            )}
          </Button>
          
          <Button 
            onClick={() => onExport('EXCEL')} 
            disabled={isLoading || !result || result.data.length === 0}
          >
            <FiDownload size={14} />
            Exportar
          </Button>
        </ActionButtons>
      </Header>
      
      <VisualizationTabs>
        <Tab 
          $active={visualizationType === 'table'} 
          onClick={() => setVisualizationType('table')}
        >
          <FiGrid size={14} />
          Tabla
        </Tab>
        <Tab 
          $active={visualizationType === 'bar'} 
          onClick={() => setVisualizationType('bar')}
        >
          <FiBarChart2 size={14} />
          Gráfico de Barras
        </Tab>
        <Tab 
          $active={visualizationType === 'line'} 
          onClick={() => setVisualizationType('line')}
        >
          <FiTrendingUp size={14} />
          Gráfico de Líneas
        </Tab>
        <Tab 
          $active={visualizationType === 'pie'} 
          onClick={() => setVisualizationType('pie')}
        >
          <FiPieChart size={14} />
          Gráfico Circular
        </Tab>
      </VisualizationTabs>
      
      {renderContent()}
    </Container>
  );
};

export default ReportResults;
