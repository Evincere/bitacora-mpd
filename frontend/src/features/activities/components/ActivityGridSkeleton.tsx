import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmerAnimation = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 250px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const CardContent = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
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

const SkeletonCard: React.FC<{ 'aria-label'?: string }> = ({ 'aria-label': ariaLabel }) => {
  return (
    <Card role="status" aria-label={ariaLabel || 'Cargando tarjeta'}>
      <CardHeader>
        <SkeletonItem width="60%" height="24px" />
        <SkeletonItem width="32px" height="32px" style={{ borderRadius: '50%' }} />
      </CardHeader>
      <CardContent>
        <SkeletonItem height="16px" />
        <SkeletonItem height="16px" />
        <SkeletonItem height="16px" width="80%" />
      </CardContent>
      <CardFooter>
        <SkeletonItem width="80px" height="24px" />
        <SkeletonItem width="120px" height="16px" />
      </CardFooter>
    </Card>
  );
};

const ActivityGridSkeleton: React.FC = () => {
  return (
    <GridContainer>
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard
          key={index}
          aria-label={`Tarjeta de actividad ${index + 1} cargando`}
        />
      ))}
    </GridContainer>
  );
};

export default ActivityGridSkeleton;
