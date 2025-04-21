import React from 'react';
import styled from 'styled-components';
import Skeleton from './Skeleton';

// Propiedades para el componente SkeletonTable
export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  headerHeight?: string | number;
  rowHeight?: string | number;
  animation?: 'shimmer' | 'pulse';
  columnWidths?: Array<string | number>;
  className?: string;
  style?: React.CSSProperties;
}

const TableContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.cardBackground || '#ffffff'};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow || '0 2px 8px rgba(0, 0, 0, 0.1)'};
`;

const TableHeader = styled.div<{ $height?: string | number }>`
  display: flex;
  height: ${({ $height }) => (typeof $height === 'number' ? `${$height}px` : $height || '56px')};
  padding: 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border || '#e0e0e0'};
  align-items: center;
`;

const TableRow = styled.div<{ $height?: string | number }>`
  display: flex;
  height: ${({ $height }) => (typeof $height === 'number' ? `${$height}px` : $height || '48px')};
  padding: 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border || '#e0e0e0'};
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div<{ $width?: string | number }>`
  flex: ${({ $width }) => ($width ? 'none' : 1)};
  width: ${({ $width }) => (typeof $width === 'number' ? `${$width}px` : $width || 'auto')};
  padding: 0 8px;
`;

/**
 * Componente SkeletonTable para mostrar una tabla en estado de carga
 */
const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 5,
  headerHeight = 56,
  rowHeight = 48,
  animation = 'shimmer',
  columnWidths,
  className,
  style,
}) => {
  // Normalizar columnWidths para asegurar que tenga la longitud correcta
  const normalizedColumnWidths = columnWidths
    ? columnWidths.length >= columns
      ? columnWidths.slice(0, columns)
      : [...columnWidths, ...Array(columns - columnWidths.length).fill(null)]
    : Array(columns).fill(null);

  return (
    <TableContainer className={className} style={style} role="table" aria-label="Tabla cargando">
      <TableHeader $height={headerHeight} role="row">
        {normalizedColumnWidths.map((width, index) => (
          <TableCell key={`header-${index}`} $width={width} role="columnheader">
            <Skeleton
              width="100%"
              height="24px"
              animation={animation}
              aria-label={`Encabezado de columna ${index + 1} cargando`}
            />
          </TableCell>
        ))}
      </TableHeader>

      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={`row-${rowIndex}`} $height={rowHeight} role="row">
          {normalizedColumnWidths.map((width, colIndex) => (
            <TableCell key={`cell-${rowIndex}-${colIndex}`} $width={width} role="cell">
              <Skeleton
                width="100%"
                height={colIndex === 0 ? '20px' : '16px'}
                animation={animation}
                aria-label={`Celda ${rowIndex + 1}-${colIndex + 1} cargando`}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableContainer>
  );
};

export default SkeletonTable;
