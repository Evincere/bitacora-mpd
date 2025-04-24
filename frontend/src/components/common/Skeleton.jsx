import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animación de pulso para el esqueleto
const pulse = keyframes`
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.6;
  }
`;

// Componente base de esqueleto
const SkeletonBase = styled.div`
  background-color: ${({ theme }) => theme.skeletonBackground};
  border-radius: ${({ $borderRadius }) => $borderRadius || '4px'};
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '16px'};
  margin-bottom: ${({ marginBottom }) => marginBottom || '0'};
  animation: ${pulse} 1.5s ease-in-out infinite;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.skeletonHighlight || 'rgba(255, 255, 255, 0.05)'},
      transparent
    );
    animation: shimmer 2s infinite;
    transform: translateX(-100%);
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
`;

/**
 * Componente de esqueleto para mostrar durante la carga
 *
 * @param {string} width - Ancho del esqueleto (por defecto: '100%')
 * @param {string} height - Altura del esqueleto (por defecto: '16px')
 * @param {string} marginBottom - Margen inferior (por defecto: '0')
 * @param {string} borderRadius - Radio de borde (por defecto: '4px')
 * @param {Object} style - Estilos adicionales
 */
const Skeleton = ({
  width,
  height,
  marginBottom,
  borderRadius,
  style,
  ...props
}) => {
  return (
    <SkeletonBase
      width={width}
      height={height}
      marginBottom={marginBottom}
      $borderRadius={borderRadius}
      style={style}
      {...props}
    />
  );
};

export default Skeleton;
