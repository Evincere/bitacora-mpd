import React from 'react';
import styled from 'styled-components';
import Skeleton, { SkeletonBaseProps } from './Skeleton';

// Propiedades para el componente SkeletonText
export interface SkeletonTextProps extends SkeletonBaseProps {
  lines?: number;
  animation?: 'shimmer' | 'pulse';
  lineHeight?: string | number;
  lastLineWidth?: string | number;
  spacing?: string | number;
}

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

/**
 * Componente SkeletonText para mostrar múltiples líneas de texto en carga
 */
const SkeletonText: React.FC<SkeletonTextProps> = ({
  width = '100%',
  height = '16px',
  margin = '0',
  lines = 3,
  animation = 'shimmer',
  lineHeight,
  lastLineWidth = '80%',
  spacing = '8px',
  className,
  style,
}) => {
  return (
    <TextContainer className={className} style={style}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 && lastLineWidth ? lastLineWidth : width}
          height={lineHeight || height}
          margin={index < lines - 1 ? (typeof spacing === 'number' ? `0 0 ${spacing}px 0` : `0 0 ${spacing} 0`) : margin}
          animation={animation}
          aria-label={`Línea de texto ${index + 1} de ${lines} cargando`}
        />
      ))}
    </TextContainer>
  );
};

export default SkeletonText;
