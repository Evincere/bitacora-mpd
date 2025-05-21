import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiList, 
  FiRefreshCw, 
  FiXCircle, 
  FiAlertTriangle, 
  FiInfo,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiClock
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSystemLogs } from '../hooks/useDiagnosticTools';
import { LogFilters, LogEntry } from '../types/diagnosticTypes';

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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.cardBackground};
  color: ${({ theme, $primary }) => 
    $primary ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.border};

  &:hover {
    background-color: ${({ theme, $primary }) => 
      $primary ? theme.primaryDark : theme.hoverBackground};
  }
`;

const FiltersContainer = styled.div<{ $visible: boolean }>`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: ${({ $visible }) => ($visible ? '16px' : '0')};
  margin-bottom: 16px;
  overflow: hidden;
  max-height: ${({ $visible }) => ($visible ? '1000px' : '0')};
  transition: all 0.3s ease;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const FiltersActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 8px;
`;

const LogsTable = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  overflow: hidden;
`;

const LogsHeader = styled.div`
  display: grid;
  grid-template-columns: 180px 100px 1fr;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  padding: 12px 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const LogsList = styled.div`
  max-height: 500px;
  overflow-y: auto;
`;

const LogItem = styled.div<{ $expanded: boolean; $level: string }>`
  display: grid;
  grid-template-columns: 180px 100px 1fr;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ $level, theme }) => 
    $level === 'ERROR' ? theme.error + '05' : 
    $level === 'WARN' ? theme.warning + '05' : 
    theme.cardBackground};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ $level, theme }) => 
      $level === 'ERROR' ? theme.error + '10' : 
      $level === 'WARN' ? theme.warning + '10' : 
      theme.hoverBackground};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const LogTimestamp = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const LogLevel = styled.div<{ $level: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ $level, theme }) => 
    $level === 'ERROR' ? theme.error + '20' : 
    $level === 'WARN' ? theme.warning + '20' : 
    $level === 'INFO' ? theme.info + '20' : 
    $level === 'DEBUG' ? theme.primary + '20' : 
    theme.textTertiary + '20'};
  color: ${({ $level, theme }) => 
    $level === 'ERROR' ? theme.error : 
    $level === 'WARN' ? theme.warning : 
    $level === 'INFO' ? theme.info : 
    $level === 'DEBUG' ? theme.primary : 
    theme.textTertiary};
`;

const LogMessage = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LogDetails = styled.div<{ $expanded: boolean }>`
  grid-column: 1 / -1;
  padding: ${({ $expanded }) => ($expanded ? '12px 16px' : '0')};
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-top: ${({ $expanded, theme }) => ($expanded ? `1px solid ${theme.border}` : 'none')};
  max-height: ${({ $expanded }) => ($expanded ? '500px' : '0')};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const LogDetailItem = styled.div`
  margin-bottom: 8px;
`;

const LogDetailLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 4px;
`;

const LogDetailValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  word-break: break-word;
`;

const StackTrace = styled.pre`
  font-family: monospace;
  font-size: 12px;
  background-color: ${({ theme }) => theme.backgroundInput};
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const ExpandButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
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
 * Componente para mostrar los logs del sistema
 */
const SystemLogsCard: React.FC = () => {
  // Estado para los filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<LogFilters>({
    level: 'ERROR',
    limit: 100
  });
  
  // Estado para el log expandido
  const [expandedLogIndex, setExpandedLogIndex] = useState<number | null>(null);
  
  // Consultar logs
  const { data: logs, isLoading, isError, refetch } = useSystemLogs(filters);
  
  // Función para aplicar filtros
  const applyFilters = () => {
    refetch();
  };
  
  // Función para resetear filtros
  const resetFilters = () => {
    setFilters({
      level: 'ERROR',
      limit: 100
    });
  };
  
  // Función para obtener el icono de nivel de log
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR':
        return <FiXCircle size={12} />;
      case 'WARN':
        return <FiAlertTriangle size={12} />;
      case 'INFO':
        return <FiInfo size={12} />;
      case 'DEBUG':
        return <FiAlertCircle size={12} />;
      default:
        return <FiInfo size={12} />;
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
  
  // Función para exportar logs
  const exportLogs = () => {
    if (!logs) return;
    
    // Crear contenido CSV
    let csv = 'Timestamp,Level,Logger,Message,Thread\n';
    
    logs.forEach(log => {
      const timestamp = log.timestamp;
      const level = log.level;
      const logger = log.logger;
      const message = log.message.replace(/"/g, '""'); // Escapar comillas
      const thread = log.thread;
      
      csv += `"${timestamp}","${level}","${logger}","${message}","${thread}"\n`;
    });
    
    // Crear blob y descargar
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `system-logs-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  // Renderizar estado de carga
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <FiList size={20} />
            Logs del Sistema
          </CardTitle>
        </CardHeader>
        <EmptyState>
          <LoadingSpinner size={48} />
          <EmptyStateText>Cargando logs del sistema...</EmptyStateText>
        </EmptyState>
      </Card>
    );
  }
  
  // Renderizar estado de error
  if (isError || !logs) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <FiList size={20} />
            Logs del Sistema
          </CardTitle>
          <ActionButtons>
            <Button onClick={() => refetch()}>
              <FiRefreshCw size={16} />
              Actualizar
            </Button>
          </ActionButtons>
        </CardHeader>
        <EmptyState>
          <EmptyStateIcon>
            <FiXCircle />
          </EmptyStateIcon>
          <EmptyStateText>Error al cargar los logs del sistema</EmptyStateText>
        </EmptyState>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FiList size={20} />
          Logs del Sistema
        </CardTitle>
        <ActionButtons>
          <Button onClick={() => setShowFilters(!showFilters)}>
            <FiFilter size={16} />
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          </Button>
          <Button onClick={() => refetch()}>
            <FiRefreshCw size={16} />
            Actualizar
          </Button>
          <Button onClick={exportLogs}>
            <FiDownload size={16} />
            Exportar
          </Button>
        </ActionButtons>
      </CardHeader>
      
      <FiltersContainer $visible={showFilters}>
        <FiltersGrid>
          <FormGroup>
            <Label>Nivel</Label>
            <Select 
              value={filters.level || 'ERROR'} 
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            >
              <option value="ERROR">ERROR</option>
              <option value="WARN">WARN</option>
              <option value="INFO">INFO</option>
              <option value="DEBUG">DEBUG</option>
              <option value="TRACE">TRACE</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Límite</Label>
            <Input 
              type="number" 
              value={filters.limit || 100} 
              onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value) })}
              min={1}
              max={1000}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Buscar</Label>
            <Input 
              type="text" 
              value={filters.search || ''} 
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Buscar en mensajes..."
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Logger</Label>
            <Input 
              type="text" 
              value={filters.logger || ''} 
              onChange={(e) => setFilters({ ...filters, logger: e.target.value })}
              placeholder="Nombre del logger..."
            />
          </FormGroup>
        </FiltersGrid>
        
        <FiltersActions>
          <Button onClick={resetFilters}>
            Resetear
          </Button>
          <Button $primary onClick={applyFilters}>
            <FiSearch size={16} />
            Aplicar
          </Button>
        </FiltersActions>
      </FiltersContainer>
      
      {logs.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>
            <FiInfo />
          </EmptyStateIcon>
          <EmptyStateText>No se encontraron logs con los filtros actuales</EmptyStateText>
        </EmptyState>
      ) : (
        <LogsTable>
          <LogsHeader>
            <div>Timestamp</div>
            <div>Nivel</div>
            <div>Mensaje</div>
          </LogsHeader>
          
          <LogsList>
            {logs.map((log, index) => {
              const isExpanded = expandedLogIndex === index;
              
              return (
                <React.Fragment key={index}>
                  <LogItem 
                    $expanded={isExpanded} 
                    $level={log.level}
                    onClick={() => setExpandedLogIndex(isExpanded ? null : index)}
                  >
                    <LogTimestamp>
                      <FiClock size={12} style={{ marginRight: '4px' }} />
                      {formatDate(log.timestamp)}
                    </LogTimestamp>
                    <LogLevel $level={log.level}>
                      {getLevelIcon(log.level)}
                      {log.level}
                    </LogLevel>
                    <LogMessage>
                      {log.message}
                      <ExpandButton>
                        {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      </ExpandButton>
                    </LogMessage>
                    
                    <LogDetails $expanded={isExpanded}>
                      <LogDetailItem>
                        <LogDetailLabel>Logger</LogDetailLabel>
                        <LogDetailValue>{log.logger}</LogDetailValue>
                      </LogDetailItem>
                      
                      <LogDetailItem>
                        <LogDetailLabel>Thread</LogDetailLabel>
                        <LogDetailValue>{log.thread}</LogDetailValue>
                      </LogDetailItem>
                      
                      <LogDetailItem>
                        <LogDetailLabel>Mensaje completo</LogDetailLabel>
                        <LogDetailValue>{log.message}</LogDetailValue>
                      </LogDetailItem>
                      
                      {log.stackTrace && (
                        <LogDetailItem>
                          <LogDetailLabel>Stack Trace</LogDetailLabel>
                          <StackTrace>{log.stackTrace}</StackTrace>
                        </LogDetailItem>
                      )}
                    </LogDetails>
                  </LogItem>
                </React.Fragment>
              );
            })}
          </LogsList>
        </LogsTable>
      )}
    </Card>
  );
};

export default SystemLogsCard;
