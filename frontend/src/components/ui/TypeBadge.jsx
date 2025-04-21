import React from 'react';
import styled from 'styled-components';
import { typeColors } from '../../styles/statusColors';
import { getTypeDisplay } from '../../utils/enumTranslations';

// Función para normalizar el tipo y hacerlo compatible con ambos formatos
const normalizeType = (type) => {
  if (!type) return 'OTRO';

  // Obtener el texto de visualización en español
  const displayText = getTypeDisplay(type);

  // Verificar si ya existe en typeColors
  if (typeColors[displayText]) {
    return displayText;
  }

  // Si no se encuentra, intentar buscar por clave en minúsculas
  const lowerKey = displayText.toLowerCase();
  for (const key in typeColors) {
    if (key.toLowerCase() === lowerKey) {
      return key;
    }
  }

  return 'OTRO';
};

const Badge = styled.span`
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

  background-color: ${({ $normalizedType }) => {
    if (typeColors[$normalizedType]) {
      return typeColors[$normalizedType].background;
    }
    return typeColors.OTRO.background;
  }};

  color: ${({ $normalizedType }) => {
    if (typeColors[$normalizedType]) {
      return typeColors[$normalizedType].text;
    }
    return typeColors.OTRO.text;
  }};

  border: 1px solid ${({ $normalizedType }) => {
    if (typeColors[$normalizedType]) {
      return typeColors[$normalizedType].border;
    }
    return typeColors.OTRO.border;
  }};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px ${({ $normalizedType }) => {
      if (typeColors[$normalizedType]) {
        return typeColors[$normalizedType].shadow;
      }
      return typeColors.OTRO.shadow;
    }};
    background-color: ${({ $normalizedType }) => {
      if (typeColors[$normalizedType]) {
        return typeColors[$normalizedType].hover;
      }
      return typeColors.OTRO.hover;
    }};
  }

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ $normalizedType }) => {
      if (typeColors[$normalizedType]) {
        return typeColors[$normalizedType].text;
      }
      return typeColors.OTRO.text;
    }};
  }
`;

const TypeBadge = ({ type, children }) => {
  const normalizedType = normalizeType(type);

  // Determinar el texto a mostrar (mantener el original si es posible)
  const displayText = React.Children.map(children, child => {
    if (typeof child === 'string') {
      // Si el hijo es un string, podríamos reemplazarlo, pero lo mantenemos
      return child;
    }
    return child;
  });

  return (
    <Badge $normalizedType={normalizedType}>
      {displayText}
    </Badge>
  );
};

export default TypeBadge;
