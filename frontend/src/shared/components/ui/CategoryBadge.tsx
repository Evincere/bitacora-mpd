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

  background-color: ${({ $normalizedCategory }) => {
    if (categoryColors[$normalizedCategory]) {
      return categoryColors[$normalizedCategory].background;
    }
    return categoryColors.default.background;
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
    background-color: ${({ $normalizedCategory }) => {
      if (categoryColors[$normalizedCategory]) {
        return categoryColors[$normalizedCategory].hover;
      }
      return categoryColors.default.hover;
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
