import React from 'react';
import styled from 'styled-components';
import { statusColors } from '@/shared/styles/statusColors';
import { getStatusDisplay, getActivityStatusTranslation } from '@/core/utils/enumTranslations';
import { ActivityStatus } from '@/core/types/models';

// Función para normalizar el estado y hacerlo compatible con ambos formatos
const normalizeStatus = (status: string | ActivityStatus | undefined): string => {
  if (!status) return 'default';

  // Obtener el texto de visualización en español
  const displayText = typeof status === 'string' ? getStatusDisplay(status) : getActivityStatusTranslation(status as ActivityStatus);

  // Verificar si ya existe en statusColors
  if (statusColors[displayText]) {
    return displayText;
  }

  // Si no se encuentra, intentar buscar por clave en minúsculas
  const lowerKey = displayText.toLowerCase();
  for (const key in statusColors) {
    if (key.toLowerCase() === lowerKey) {
      return key;
    }
  }

  return 'default';
};

interface BadgeProps {
  $normalizedStatus: string;
}

const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  background-color: ${({ $normalizedStatus }) => {
    if (statusColors[$normalizedStatus]) {
      return statusColors[$normalizedStatus].background;
    }
    return statusColors.default.background;
  }};

  color: ${({ $normalizedStatus }) => {
    if (statusColors[$normalizedStatus]) {
      return statusColors[$normalizedStatus].text;
    }
    return statusColors.default.text;
  }};

  border: 1px solid ${({ $normalizedStatus }) => {
    if (statusColors[$normalizedStatus]) {
      return statusColors[$normalizedStatus].border;
    }
    return statusColors.default.border;
  }};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px ${({ $normalizedStatus }) => {
      if (statusColors[$normalizedStatus]) {
        return statusColors[$normalizedStatus].shadow;
      }
      return statusColors.default.shadow;
    }};
    background-color: ${({ $normalizedStatus }) => {
      if (statusColors[$normalizedStatus]) {
        return statusColors[$normalizedStatus].hover;
      }
      return statusColors.default.hover;
    }};
  }
`;

interface StatusBadgeProps {
  status?: string | ActivityStatus;
  children?: React.ReactNode;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
  const normalizedStatus = normalizeStatus(status);

  // Determinar el texto a mostrar (mantener el original si es posible)
  const displayText = React.Children.map(children, child => {
    if (typeof child === 'string') {
      // Si el hijo es un string, podríamos reemplazarlo, pero lo mantenemos
      return child;
    }
    return child;
  });

  return (
    <Badge $normalizedStatus={normalizedStatus}>
      {displayText}
    </Badge>
  );
};

export default StatusBadge;
