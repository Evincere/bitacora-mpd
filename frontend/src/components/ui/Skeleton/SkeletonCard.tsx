import React from 'react';
import styled from 'styled-components';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';

// Propiedades para el componente SkeletonCard
export interface SkeletonCardProps {
  width?: string | number;
  height?: string | number;
  headerHeight?: string | number;
  footerHeight?: string | number;
  contentPadding?: string;
  rounded?: boolean;
  withImage?: boolean;
  imageHeight?: string | number;
  withHeader?: boolean;
  withFooter?: boolean;
  animation?: 'shimmer' | 'pulse';
  className?: string;
  style?: React.CSSProperties;
}

const CardContainer = styled.div<{ $rounded?: boolean; width?: string | number; height?: string | number }>`
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width || '100%')};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height || 'auto')};
  background-color: ${({ theme }) => theme.cardBackground || '#ffffff'};
  border-radius: ${({ $rounded }) => ($rounded ? '8px' : '4px')};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow || '0 2px 8px rgba(0, 0, 0, 0.1)'};
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div<{ $height?: string | number }>`
  height: ${({ $height }) => (typeof $height === 'number' ? `${$height}px` : $height || '60px')};
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border || '#e0e0e0'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardContent = styled.div<{ $padding?: string }>`
  padding: ${({ $padding }) => $padding || '16px'};
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CardFooter = styled.div<{ $height?: string | number }>`
  height: ${({ $height }) => (typeof $height === 'number' ? `${$height}px` : $height || '50px')};
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.border || '#e0e0e0'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * Componente SkeletonCard para mostrar una tarjeta en estado de carga
 */
const SkeletonCard: React.FC<SkeletonCardProps> = ({
  width,
  height,
  headerHeight,
  footerHeight,
  contentPadding,
  rounded = true,
  withImage = false,
  imageHeight = 200,
  withHeader = true,
  withFooter = true,
  animation = 'shimmer',
  className,
  style,
}) => {
  return (
    <CardContainer
      width={width}
      height={height}
      $rounded={rounded}
      className={className}
      style={style}
    >
      {withHeader && (
        <CardHeader $height={headerHeight}>
          <Skeleton width="60%" height="24px" animation={animation} />
          <Skeleton width="32px" height="32px" variant="circular" animation={animation} />
        </CardHeader>
      )}

      <CardContent $padding={contentPadding}>
        {withImage && (
          <Skeleton
            width="100%"
            height={imageHeight}
            variant="rectangular"
            animation={animation}
            margin="0 0 16px 0"
            aria-label="Imagen cargando"
          />
        )}

        <SkeletonText
          lines={3}
          animation={animation}
          height="16px"
          spacing="12px"
          aria-label="Contenido cargando"
        />

        <SkeletonText
          lines={2}
          animation={animation}
          height="14px"
          spacing="8px"
          lastLineWidth="40%"
          aria-label="Detalles adicionales cargando"
        />
      </CardContent>

      {withFooter && (
        <CardFooter $height={footerHeight}>
          <Skeleton width="80px" height="24px" animation={animation} />
          <Skeleton width="120px" height="16px" animation={animation} />
        </CardFooter>
      )}
    </CardContainer>
  );
};

export default SkeletonCard;
