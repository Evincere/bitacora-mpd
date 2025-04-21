import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  count?: number;
  className?: string;
}

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonItem = styled.div<{
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}>`
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width || '100%')};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height || '16px')};
  border-radius: ${({ borderRadius }) => borderRadius || '4px'};
  margin-bottom: 8px;
  background: ${({ theme }) => theme.skeletonBackground || '#f0f0f0'};
  background-image: linear-gradient(
    90deg,
    ${({ theme }) => theme.skeletonBackground || '#f0f0f0'} 25%,
    ${({ theme }) => theme.skeletonHighlight || '#e0e0e0'} 50%,
    ${({ theme }) => theme.skeletonBackground || '#f0f0f0'} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width,
  height,
  borderRadius,
  count = 1,
  className,
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonItem
          key={index}
          width={width}
          height={height}
          borderRadius={borderRadius}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
