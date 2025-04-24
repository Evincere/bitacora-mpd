import React from 'react';
import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  children,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $iconPosition={iconPosition}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="loading-spinner" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="icon left">{icon}</span>}
          <span className="content">{children}</span>
          {icon && iconPosition === 'right' && <span className="icon right">{icon}</span>}
        </>
      )}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $iconPosition: 'left' | 'right';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.left {
      margin-right: 4px;
    }
    
    &.right {
      margin-left: 4px;
    }
  }
  
  .loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  }
  
  /* Size variants */
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return css`
          padding: 6px 12px;
          font-size: 12px;
          height: 30px;
        `;
      case 'large':
        return css`
          padding: 12px 24px;
          font-size: 16px;
          height: 48px;
        `;
      case 'medium':
      default:
        return css`
          padding: 8px 16px;
          font-size: 14px;
          height: 36px;
        `;
    }
  }}
  
  /* Color variants */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'secondary':
        return css`
          background-color: transparent;
          border: 1px solid ${theme.border};
          color: ${theme.text};
          
          &:hover:not(:disabled) {
            background-color: ${theme.inputBackground};
            border-color: ${theme.primary};
            color: ${theme.primary};
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.error};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.errorHover};
          }
        `;
      case 'success':
        return css`
          background-color: ${theme.success};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.successHover};
          }
        `;
      case 'warning':
        return css`
          background-color: ${theme.warning};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.warningHover};
          }
        `;
      case 'info':
        return css`
          background-color: ${theme.info};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.infoHover};
          }
        `;
      case 'primary':
      default:
        return css`
          background-color: ${theme.primary};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.buttonHover};
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.textSecondary};
    border-color: ${({ theme }) => theme.border};
  }
`;

export default Button;
