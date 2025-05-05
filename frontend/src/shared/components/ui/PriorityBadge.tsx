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

  background-color: ${({ $normalizedPriority }) => {
    if (priorityColors[$normalizedPriority]) {
      return priorityColors[$normalizedPriority].background;
    }
    return priorityColors.default.background;
  }};

  color: ${({ $normalizedPriority }) => {
    if (priorityColors[$normalizedPriority]) {
      return priorityColors[$normalizedPriority].text;
    }
    return priorityColors.default.text;
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
    background-color: ${({ $normalizedPriority }) => {
      if (priorityColors[$normalizedPriority]) {
        return priorityColors[$normalizedPriority].hover;
      }
      return priorityColors.default.hover;
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
