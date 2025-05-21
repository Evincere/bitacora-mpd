import React from 'react';
import styled from 'styled-components';
import { FiTag } from 'react-icons/fi';
import { categoryColors, normalizeCategory } from '@/shared/styles';

interface CategoryBadgeProps {
  category: string;
  children?: React.ReactNode;
}

interface BadgeProps {
  $normalizedCategory: string;
}

const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.7px;

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  background-color: ${({ $normalizedCategory, theme }) => {
    // Usar un fondo oscuro basado en el tema, pero manteniendo la identidad del color de categoría
    if (categoryColors[$normalizedCategory]) {
      const baseColor = categoryColors[$normalizedCategory].text;
      // Crear un fondo oscuro con una ligera transparencia del color de la categoría
      return `${baseColor}20`; // 20 es la opacidad en hexadecimal (equivalente a 0.125)
    }
    return theme.backgroundSecondary;
  }};

  color: ${({ $normalizedCategory }) => {
    if (categoryColors[$normalizedCategory]) {
      return categoryColors[$normalizedCategory].text;
    }
    return categoryColors.default.text;
  }};

  border: 1.5px solid ${({ $normalizedCategory }) => {
    if (categoryColors[$normalizedCategory]) {
      return categoryColors[$normalizedCategory].border;
    }
    return categoryColors.default.border;
  }};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 10px ${({ $normalizedCategory }) => {
      if (categoryColors[$normalizedCategory]) {
        return categoryColors[$normalizedCategory].shadow;
      }
      return categoryColors.default.shadow;
    }};
    background-color: ${({ $normalizedCategory, theme }) => {
      if (categoryColors[$normalizedCategory]) {
        const baseColor = categoryColors[$normalizedCategory].text;
        // Crear un fondo oscuro con una mayor opacidad para el hover
        return `${baseColor}30`; // 30 es la opacidad en hexadecimal (equivalente a 0.188)
      }
      return theme.backgroundHover;
    }};
  }
`;

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, children }) => {
  const normalizedCategory = normalizeCategory(category);

  return (
    <Badge $normalizedCategory={normalizedCategory}>
      <FiTag size={14} />
      {children || category}
    </Badge>
  );
};

export default CategoryBadge;
