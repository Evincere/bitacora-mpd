import React from 'react';
import styled from 'styled-components';
import { priorityColors, normalizePriority } from '@/shared/styles/priorityColors';

interface BadgeProps {
  $normalizedPriority: string;
}

const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  text-transform: uppercase;
  letter-spacing: 0.7px;

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  background-color: ${({ $normalizedPriority, theme }) => {
    // Usar un fondo oscuro basado en el tema, pero manteniendo la identidad del color de prioridad
    if (priorityColors[$normalizedPriority]) {
      const baseColor = priorityColors[$normalizedPriority].text;
      // Crear un fondo oscuro con una ligera transparencia del color de la prioridad
      return `${baseColor}20`; // 20 es la opacidad en hexadecimal (equivalente a 0.125)
    }
    return theme.backgroundSecondary;
  }};

  color: ${({ $normalizedPriority, theme }) => {
    if (priorityColors[$normalizedPriority]) {
      // Aumentar el brillo del color del texto para mejorar el contraste con el fondo oscuro
      const baseColor = priorityColors[$normalizedPriority].text;
      // Usar un color más brillante para mejorar la legibilidad
      return baseColor;
    }
    return theme.text;
  }};

  border: 1.5px solid ${({ $normalizedPriority }) => {
    if (priorityColors[$normalizedPriority]) {
      return priorityColors[$normalizedPriority].border;
    }
    return priorityColors.default.border;
  }};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 10px ${({ $normalizedPriority }) => {
      if (priorityColors[$normalizedPriority]) {
        return priorityColors[$normalizedPriority].shadow;
      }
      return priorityColors.default.shadow;
    }};
    background-color: ${({ $normalizedPriority, theme }) => {
      if (priorityColors[$normalizedPriority]) {
        const baseColor = priorityColors[$normalizedPriority].text;
        // Crear un fondo oscuro con una mayor opacidad para el hover
        return `${baseColor}30`; // 30 es la opacidad en hexadecimal (equivalente a 0.188)
      }
      return theme.backgroundHover;
    }};
  }
`;

interface PriorityBadgeProps {
  priority?: string;
  children?: React.ReactNode;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, children }) => {
  const normalizedPriority = normalizePriority(priority);

  // Determinar el texto a mostrar (mantener el original si es posible)
  const displayText = React.Children.map(children, child => {
    if (typeof child === 'string') {
      // Si el hijo es un string, podríamos reemplazarlo, pero lo mantenemos
      return child;
    }
    return child;
  });

  return (
    <Badge $normalizedPriority={normalizedPriority}>
      {displayText}
    </Badge>
  );
};

export default PriorityBadge;
