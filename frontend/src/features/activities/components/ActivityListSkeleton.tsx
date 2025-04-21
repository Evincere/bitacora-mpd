import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animación de shimmer
const shimmerAnimation = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const Container = styled.div`
  padding: 0;
`;

const TableContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.cardBackground || '#ffffff'};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow || '0 2px 8px rgba(0, 0, 0, 0.1)'};
`;

const TableHeader = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const TableRow = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  &:last-child {
    border-bottom: none;
  }
`;

const SkeletonCell = styled.div<{ width?: string | number }>`
  flex: ${({ width }) => (width ? 'none' : '1')};
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width || 'auto')};
  padding: 12px 16px;
  display: flex;
  align-items: center;
`;

const SkeletonItem = styled.div<{ width?: string, height?: string }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '16px'};
  border-radius: 4px;
  background: ${({ theme }) => theme.skeletonBackground || '#f0f0f0'};
  background-image: linear-gradient(
    90deg,
    ${({ theme }) => theme.skeletonBackground || '#f0f0f0'} 25%,
    ${({ theme }) => theme.skeletonHighlight || '#e0e0e0'} 50%,
    ${({ theme }) => theme.skeletonBackground || '#f0f0f0'} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmerAnimation} 1.5s infinite linear;
`;

// Componente personalizado de tabla de esqueleto
const CustomSkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  headerHeight?: number;
  rowHeight?: number;
  columnWidths?: Array<string | number>;
  'aria-label'?: string;
}> = ({
  rows = 5,
  columns = 4,
  headerHeight = 56,
  rowHeight = 48,
  columnWidths = [],
  'aria-label': ariaLabel,
}) => {
  return (
    <TableContainer role="table" aria-label={ariaLabel || 'Tabla cargando'}>
      <TableHeader style={{ height: `${headerHeight}px` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonCell
            key={`header-${index}`}
            width={columnWidths[index] || undefined}
          >
            <SkeletonItem height="24px" />
          </SkeletonCell>
        ))}
      </TableHeader>

      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={`row-${rowIndex}`} style={{ height: `${rowHeight}px` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <SkeletonCell
                key={`cell-${rowIndex}-${colIndex}`}
                width={columnWidths[colIndex] || undefined}
              >
                <SkeletonItem height="16px" />
              </SkeletonCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </TableContainer>
  );
};

const ActivityListSkeleton: React.FC = () => {
  return (
    <Container>
      <CustomSkeletonTable
        rows={5}
        columns={6}
        headerHeight={56}
        rowHeight={48}
        columnWidths={['10%', '10%', '20%', '40%', '10%', '40px']}
        aria-label="Tabla de actividades cargando"
      />
    </Container>
  );
};

export default ActivityListSkeleton;
