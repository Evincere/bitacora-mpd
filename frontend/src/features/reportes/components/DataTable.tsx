import React from 'react';
import styled from 'styled-components';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

// Estilos
const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const TableTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const TableHeadCell = styled.th<{ $sortable?: boolean }>`
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  
  &:hover {
    color: ${({ theme, $sortable }) => ($sortable ? theme.primary : theme.textSecondary)};
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const SortIcon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
`;

const EmptyState = styled.div`
  padding: 32px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const Badge = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ $color }) => $color + '20'};
  color: ${({ $color }) => $color};
`;

interface Column {
  id: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  emptyMessage?: string;
}

/**
 * Componente para mostrar una tabla de datos
 */
const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  data,
  sortColumn,
  sortDirection,
  onSort,
  emptyMessage = 'No hay datos disponibles'
}) => {
  // Renderizar celda con valor personalizado si se proporciona una función de renderizado
  const renderCell = (row: any, column: Column) => {
    const value = row[column.id];
    return column.render ? column.render(value, row) : value;
  };
  
  // Renderizar icono de ordenamiento
  const renderSortIcon = (column: Column) => {
    if (!column.sortable || column.id !== sortColumn) return null;
    
    return (
      <SortIcon>
        {sortDirection === 'asc' ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
      </SortIcon>
    );
  };
  
  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>{title}</TableTitle>
      </TableHeader>
      
      {data.length > 0 ? (
        <Table>
          <TableHead>
            <tr>
              {columns.map((column) => (
                <TableHeadCell
                  key={column.id}
                  $sortable={column.sortable}
                  onClick={() => column.sortable && onSort && onSort(column.id)}
                >
                  {column.label}
                  {renderSortIcon(column)}
                </TableHeadCell>
              ))}
            </tr>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {renderCell(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState>{emptyMessage}</EmptyState>
      )}
    </TableContainer>
  );
};

export { Badge };
export default DataTable;
