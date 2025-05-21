import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiAlertTriangle, 
  FiInfo,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiUser,
  FiActivity,
  FiDatabase,
  FiTag,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuditLogs, useExportAuditLogs } from '../hooks/useAuditLogs';
import { AuditActionType, AuditLogFilters, AuditResult, UserAuditLog } from '../types';
import AuditLogFiltersComponent from './AuditLogFilters';
import AuditLogDetail from './AuditLogDetail';

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

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ $primary?: boolean; $warning?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary, $warning }) => 
    $primary ? theme.primary : 
    $warning ? theme.warning + '20' : 
    theme.cardBackground};
  color: ${({ theme, $primary, $warning }) => 
    $primary ? '#fff' : 
    $warning ? theme.warning : 
    theme.text};
  border: 1px solid ${({ theme, $primary, $warning }) => 
    $primary ? theme.primary : 
    $warning ? theme.warning : 
    theme.border};

  &:hover {
    background-color: ${({ theme, $primary, $warning }) => 
      $primary ? theme.primaryDark : 
      $warning ? theme.warning + '30' : 
      theme.hoverBackground};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FiltersContainer = styled.div<{ $visible: boolean }>`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: ${({ $visible }) => ($visible ? '16px' : '0')};
  margin-bottom: 20px;
  overflow: hidden;
  max-height: ${({ $visible }) => ($visible ? '1000px' : '0')};
  transition: all 0.3s ease;
  border: ${({ $visible, theme }) => ($visible ? `1px solid ${theme.border}` : 'none')};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.text};
  font-weight: 600;
`;

const TableRow = styled.tr<{ $suspicious?: boolean; $clickable?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme, $suspicious }) => 
    $suspicious ? theme.warning + '10' : 'transparent'};
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
    cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const PaginationInfo = styled.div`
  font-size: 14px;
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
  width: 36px;
  height: 36px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $active }) => 
    $active ? theme.primary : theme.cardBackground};
  color: ${({ theme, $active }) => 
    $active ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $active }) => 
    $active ? theme.primary : theme.border};

  &:hover {
    background-color: ${({ theme, $active }) => 
      $active ? theme.primaryDark : theme.hoverBackground};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusBadge = styled.span<{ $success?: boolean; $error?: boolean; $warning?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ theme, $success, $error, $warning }) => 
    $success ? theme.success + '20' : 
    $error ? theme.error + '20' : 
    $warning ? theme.warning + '20' : 
    theme.backgroundSecondary};
  color: ${({ theme, $success, $error, $warning }) => 
    $success ? theme.success : 
    $error ? theme.error : 
    $warning ? theme.warning : 
    theme.textSecondary};
  border: 1px solid ${({ theme, $success, $error, $warning }) => 
    $success ? theme.success + '30' : 
    $error ? theme.error + '30' : 
    $warning ? theme.warning + '30' : 
    theme.border};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

const EmptyStateSubtext = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textTertiary};
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

const UserAuditLogComponent: React.FC = () => {
  // Estado para los filtros
  const [filters, setFilters] = useState<AuditLogFilters>({
    page: 0,
    size: 10
  });
  
  // Estado para mostrar/ocultar filtros
  const [showFilters, setShowFilters] = useState(false);
  
  // Estado para el registro seleccionado
  const [selectedLog, setSelectedLog] = useState<UserAuditLog | null>(null);
  
  // Consultar registros de auditoría
  const { data, isLoading, isError } = useAuditLogs(filters);
  
  // Mutación para exportar registros
  const exportAuditLogs = useExportAuditLogs();
  
  // Función para cambiar de página
  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };
  
  // Función para aplicar filtros
  const handleApplyFilters = (newFilters: Omit<AuditLogFilters, 'page' | 'size'>) => {
    setFilters({ ...filters, ...newFilters, page: 0 });
    setShowFilters(false);
  };
  
  // Función para exportar registros
  const handleExport = () => {
    const { page, size, ...exportFilters } = filters;
    exportAuditLogs.mutate(exportFilters);
  };
  
  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm:ss', { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };
  
  // Función para obtener el color del resultado
  const getResultColor = (result: AuditResult) => {
    switch (result) {
      case AuditResult.SUCCESS:
        return { success: true };
      case AuditResult.ERROR:
      case AuditResult.DENIED:
      case AuditResult.TIMEOUT:
        return { error: true };
      case AuditResult.CANCELLED:
      case AuditResult.PARTIAL:
      case AuditResult.IN_PROGRESS:
        return { warning: true };
      default:
        return {};
    }
  };
  
  // Renderizar tabla de registros
  const renderTable = () => {
    if (isLoading) {
      return (
        <EmptyState>
          <LoadingSpinner size={48} />
          <EmptyStateText>Cargando registros de auditoría...</EmptyStateText>
        </EmptyState>
      );
    }
    
    if (isError) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <FiXCircle />
          </EmptyStateIcon>
          <EmptyStateText>Error al cargar los registros de auditoría</EmptyStateText>
          <EmptyStateSubtext>Por favor, intente nuevamente más tarde</EmptyStateSubtext>
        </EmptyState>
      );
    }
    
    if (!data || data.content.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <FiInfo />
          </EmptyStateIcon>
          <EmptyStateText>No se encontraron registros de auditoría</EmptyStateText>
          <EmptyStateSubtext>Intente con otros filtros de búsqueda</EmptyStateSubtext>
        </EmptyState>
      );
    }
    
    return (
      <>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Usuario</TableHeader>
              <TableHeader>Acción</TableHeader>
              <TableHeader>Entidad</TableHeader>
              <TableHeader>Fecha</TableHeader>
              <TableHeader>Resultado</TableHeader>
              <TableHeader>IP</TableHeader>
            </TableRow>
          </TableHead>
          <tbody>
            {data.content.map((log) => (
              <TableRow 
                key={log.id} 
                $suspicious={log.suspicious}
                $clickable
                onClick={() => setSelectedLog(log)}
              >
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiUser size={16} />
                    {log.username}
                    {log.suspicious && (
                      <FiAlertTriangle size={16} color="#f59e0b" title="Actividad sospechosa" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiActivity size={16} />
                    {log.actionTypeDisplay}
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiDatabase size={16} />
                    {log.entityType}
                    {log.entityId && (
                      <span style={{ fontSize: '12px', color: '#666' }}>({log.entityId})</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiCalendar size={16} />
                    {formatDate(log.timestamp)}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge {...getResultColor(log.result)}>
                    {log.result === AuditResult.SUCCESS ? (
                      <FiCheckCircle size={12} />
                    ) : log.result === AuditResult.ERROR || log.result === AuditResult.DENIED ? (
                      <FiXCircle size={12} />
                    ) : (
                      <FiInfo size={12} />
                    )}
                    {log.resultDisplay}
                  </StatusBadge>
                </TableCell>
                <TableCell>{log.ipAddress}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        
        <Pagination>
          <PaginationInfo>
            Mostrando {data.content.length} de {data.totalElements} registros
          </PaginationInfo>
          <PaginationButtons>
            <PaginationButton
              onClick={() => handlePageChange(0)}
              disabled={data.first}
            >
              &laquo;
            </PaginationButton>
            <PaginationButton
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={data.first}
            >
              &lsaquo;
            </PaginationButton>
            
            {/* Mostrar números de página */}
            {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
              // Calcular qué páginas mostrar
              let pageNum;
              if (data.totalPages <= 5) {
                pageNum = i;
              } else if (filters.page < 2) {
                pageNum = i;
              } else if (filters.page > data.totalPages - 3) {
                pageNum = data.totalPages - 5 + i;
              } else {
                pageNum = filters.page - 2 + i;
              }
              
              return (
                <PaginationButton
                  key={pageNum}
                  $active={pageNum === filters.page}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum + 1}
                </PaginationButton>
              );
            })}
            
            <PaginationButton
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={data.last}
            >
              &rsaquo;
            </PaginationButton>
            <PaginationButton
              onClick={() => handlePageChange(data.totalPages - 1)}
              disabled={data.last}
            >
              &raquo;
            </PaginationButton>
          </PaginationButtons>
        </Pagination>
      </>
    );
  };
  
  return (
    <Container>
      <Header>
        <Title>
          <FiActivity size={24} />
          Auditoría de Usuarios
        </Title>
        <ActionButtons>
          <Button onClick={() => setShowFilters(!showFilters)}>
            <FiFilter size={16} />
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            {showFilters ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </Button>
          <Button onClick={handleExport} disabled={exportAuditLogs.isPending}>
            {exportAuditLogs.isPending ? (
              <>
                <LoadingSpinner size={16} />
                Exportando...
              </>
            ) : (
              <>
                <FiDownload size={16} />
                Exportar CSV
              </>
            )}
          </Button>
        </ActionButtons>
      </Header>
      
      <FiltersContainer $visible={showFilters}>
        <AuditLogFiltersComponent 
          initialFilters={filters}
          onApplyFilters={handleApplyFilters}
        />
      </FiltersContainer>
      
      {renderTable()}
      
      {selectedLog && (
        <AuditLogDetail 
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </Container>
  );
};

export default UserAuditLogComponent;
