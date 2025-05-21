import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiDatabase, 
  FiRefreshCw, 
  FiXCircle, 
  FiSearch,
  FiDownload,
  FiClock,
  FiHardDrive,
  FiActivity
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDatabaseStats } from '../hooks/useDiagnosticTools';

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const StatDetail = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textTertiary};
`;

const TablesContainer = styled.div`
  margin-top: 20px;
`;

const TablesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const TablesTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundInput};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 0 12px;
  width: 250px;
`;

const Input = styled.input`
  background: none;
  border: none;
  padding: 8px 0;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  width: 100%;
  
  &:focus {
    outline: none;
  }
`;

const TablesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.backgroundSecondary};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const SizeCell = styled(TableCell)`
  text-align: right;
`;

const DateCell = styled(TableCell)`
  color: ${({ theme }) => theme.textSecondary};
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
 * Componente para mostrar las estadísticas de la base de datos
 */
const DatabaseStatsCard: React.FC = () => {
  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Consultar estadísticas
  const { data: stats, isLoading, isError, refetch } = useDatabaseStats();
  
  // Función para formatear tamaño
  const formatSize = (sizeKb: number) => {
    if (sizeKb < 1024) {
      return `${sizeKb} KB`;
    } else if (sizeKb < 1024 * 1024) {
      return `${(sizeKb / 1024).toFixed(2)} MB`;
    } else {
      return `${(sizeKb / (1024 * 1024)).toFixed(2)} GB`;
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
  
  // Filtrar tablas por término de búsqueda
  const filteredTables = stats?.tableStats.filter(table => 
    table.tableName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Función para exportar estadísticas
  const exportStats = () => {
    if (!stats) return;
    
    // Crear contenido CSV
    let csv = 'Table Name,Row Count,Size (KB),Last Updated\n';
    
    stats.tableStats.forEach(table => {
      csv += `"${table.tableName}",${table.rowCount},${table.sizeKb},"${table.lastUpdated}"\n`;
    });
    
    // Crear blob y descargar
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `database-stats-${new Date().toISOString().split('T')[0]}.csv`);
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
            <FiDatabase size={20} />
            Estadísticas de Base de Datos
          </CardTitle>
        </CardHeader>
        <EmptyState>
          <LoadingSpinner size={48} />
          <EmptyStateText>Cargando estadísticas de base de datos...</EmptyStateText>
        </EmptyState>
      </Card>
    );
  }
  
  // Renderizar estado de error
  if (isError || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <FiDatabase size={20} />
            Estadísticas de Base de Datos
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
          <EmptyStateText>Error al cargar las estadísticas de base de datos</EmptyStateText>
        </EmptyState>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FiDatabase size={20} />
          Estadísticas de Base de Datos
        </CardTitle>
        <ActionButtons>
          <Button onClick={() => refetch()}>
            <FiRefreshCw size={16} />
            Actualizar
          </Button>
          <Button onClick={exportStats}>
            <FiDownload size={16} />
            Exportar
          </Button>
        </ActionButtons>
      </CardHeader>
      
      <StatsGrid>
        <StatCard>
          <StatTitle>
            <FiHardDrive size={16} />
            Tamaño Total
          </StatTitle>
          <StatValue>{formatSize(stats.totalSize)}</StatValue>
          <StatDetail>{stats.tableStats.length} tablas</StatDetail>
        </StatCard>
        
        <StatCard>
          <StatTitle>
            <FiActivity size={16} />
            Consultas por Minuto
          </StatTitle>
          <StatValue>{stats.queryStats.queriesPerMinute}</StatValue>
          <StatDetail>{stats.queryStats.slowQueries} consultas lentas</StatDetail>
        </StatCard>
        
        <StatCard>
          <StatTitle>
            <FiClock size={16} />
            Tiempo Promedio de Consulta
          </StatTitle>
          <StatValue>{stats.queryStats.averageQueryTime} ms</StatValue>
        </StatCard>
        
        <StatCard>
          <StatTitle>
            <FiDatabase size={16} />
            Conexiones Activas
          </StatTitle>
          <StatValue>{stats.connectionPoolStats.active}</StatValue>
          <StatDetail>
            {stats.connectionPoolStats.idle} inactivas, {stats.connectionPoolStats.pending} pendientes
          </StatDetail>
        </StatCard>
      </StatsGrid>
      
      <TablesContainer>
        <TablesHeader>
          <TablesTitle>
            <FiDatabase size={16} />
            Tablas
          </TablesTitle>
          <SearchInput>
            <FiSearch size={16} style={{ color: '#888' }} />
            <Input 
              type="text" 
              placeholder="Buscar tabla..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>
        </TablesHeader>
        
        <TablesTable>
          <TableHead>
            <TableRow>
              <TableHeader>Nombre de Tabla</TableHeader>
              <TableHeader>Filas</TableHeader>
              <TableHeader>Tamaño</TableHeader>
              <TableHeader>Última Actualización</TableHeader>
            </TableRow>
          </TableHead>
          <tbody>
            {filteredTables.map((table, index) => (
              <TableRow key={index}>
                <TableCell>{table.tableName}</TableCell>
                <TableCell>{table.rowCount.toLocaleString()}</TableCell>
                <SizeCell>{formatSize(table.sizeKb)}</SizeCell>
                <DateCell>{formatDate(table.lastUpdated)}</DateCell>
              </TableRow>
            ))}
          </tbody>
        </TablesTable>
      </TablesContainer>
    </Card>
  );
};

export default DatabaseStatsCard;
