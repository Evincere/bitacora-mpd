import React from 'react';
import styled from 'styled-components';

type BadgeColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

const StyledBadge = styled.span<{ $color: BadgeColor }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
  
  /* Color variants */
  background-color: ${({ theme, $color }) => {
    switch ($color) {
      case 'primary':
        return theme.primaryLight;
      case 'secondary':
        return theme.backgroundAlt;
      case 'success':
        return theme.successLight;
      case 'danger':
        return theme.dangerLight;
      case 'warning':
        return theme.warningLight;
      case 'info':
        return theme.infoLight;
      default:
        return theme.primaryLight;
    }
  }};
  
  color: ${({ theme, $color }) => {
    switch ($color) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.textSecondary;
      case 'success':
        return theme.success;
      case 'danger':
        return theme.danger;
      case 'warning':
        return theme.warning;
      case 'info':
        return theme.info;
      default:
        return theme.primary;
    }
  }};
`;

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  color = 'primary',
  className
}) => {
  return (
    <StyledBadge $color={color} className={className}>
      {children}
    </StyledBadge>
  );
};

export default Badge;
