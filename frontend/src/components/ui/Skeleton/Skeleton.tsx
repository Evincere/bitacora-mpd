import React from 'react';
import styled, { keyframes } from 'styled-components';

// Tipos de propiedades para los skeleton loaders
export interface SkeletonBaseProps {
  width?: string | number;
  height?: string | number;
  margin?: string;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

// Animación de shimmer (efecto de brillo)
const shimmerAnimation = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Animación de pulso
const pulseAnimation = keyframes`
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
`;

// Componente base para todos los skeleton loaders
const SkeletonBase = styled.div<SkeletonBaseProps & { $animation?: 'shimmer' | 'pulse' }>`
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width || '100%')};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height || '16px')};
  margin: ${({ margin }) => margin || '0'};
  border-radius: 4px;

  /* Animación de shimmer (por defecto) */
  ${({ $animation, theme }) => $animation === 'shimmer' || !$animation ? `
    background: ${theme.skeletonBackground || '#f0f0f0'};
    background-image: linear-gradient(
      90deg,
      ${theme.skeletonBackground || '#f0f0f0'} 25%,
      ${theme.skeletonHighlight || '#e0e0e0'} 50%,
      ${theme.skeletonBackground || '#f0f0f0'} 75%
    );
    background-size: 200% 100%;
    animation: ${shimmerAnimation} 1.5s infinite linear;
  ` : ''}

  /* Animación de pulso */
  ${({ $animation, theme }) => $animation === 'pulse' ? `
    background-color: ${theme.skeletonBackground || '#f0f0f0'};
    animation: ${pulseAnimation} 1.5s ease-in-out infinite;
  ` : ''}
`;

// Propiedades para el componente Skeleton
export interface SkeletonProps extends SkeletonBaseProps {
  count?: number;
  animation?: 'shimmer' | 'pulse';
  variant?: 'text' | 'circular' | 'rectangular' | 'circle' | 'rect';
}

/**
 * Componente Skeleton para mostrar estados de carga
 */
const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  margin,
  count = 1,
  animation = 'shimmer',
  variant = 'text',
  className,
  style,
  'aria-label': ariaLabel,
}) => {
  // Ajustar propiedades según la variante
  const getVariantProps = () => {
    switch (variant) {
      case 'circular':
      case 'circle':
        return {
          style: { ...style, borderRadius: '50%' },
          height: height || width, // Circular skeletons should have equal width and height
        };
      case 'rectangular':
      case 'rect':
        return {
          style: { ...style, borderRadius: '4px' },
        };
      case 'text':
      default:
        return {
          style: { ...style, borderRadius: '4px' },
        };
    }
  };

  const variantProps = getVariantProps();

  return (
    <div className={className} role="status" aria-label={ariaLabel || 'Cargando...'}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonBase
          key={index}
          width={width}
          height={height}
          margin={margin}
          $animation={animation}
          {...variantProps}
        />
      ))}
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

export default Skeleton;

// Componentes específicos exportados para compatibilidad
export const TextSkeleton = styled(SkeletonBase)<{ width?: string; height?: string; margin?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '1rem'};
  margin: ${props => props.margin || '0.5rem 0'};
`;

export const CircleSkeleton = styled(SkeletonBase)<{ size?: string; margin?: string }>`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: 50%;
  margin: ${props => props.margin || '0'};
`;

export const RectSkeleton = styled(SkeletonBase)<{
  width?: string;
  height?: string;
  margin?: string;
  borderRadius?: string;
}>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '200px'};
  margin: ${props => props.margin || '0'};
  border-radius: ${props => props.borderRadius || '4px'};
`;
