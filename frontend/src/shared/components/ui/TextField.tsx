import React, { forwardRef } from 'react';
import styled from 'styled-components';

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
  label?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
  size?: 'small' | 'medium';
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  (
    {
      label,
      variant = 'outlined',
      fullWidth = false,
      error = false,
      helperText,
      multiline = false,
      rows = 1,
      size = 'medium',
      disabled = false,
      required = false,
      placeholder,
      className,
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const inputProps = {
      ...props,
      onChange,
      value,
      disabled,
      placeholder,
      required,
      ref: ref as any,
      rows: multiline ? rows : undefined
    };

    return (
      <TextFieldContainer $fullWidth={fullWidth} className={className}>
        {label && (
          <Label $error={error} $disabled={disabled}>
            {label}
            {required && <RequiredIndicator>*</RequiredIndicator>}
          </Label>
        )}
        <InputWrapper $variant={variant} $error={error} $size={size} $disabled={disabled}>
          {multiline ? (
            <TextArea {...inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>} />
          ) : (
            <Input {...inputProps as React.InputHTMLAttributes<HTMLInputElement>} />
          )}
        </InputWrapper>
        {helperText && <HelperText $error={error}>{helperText}</HelperText>}
      </TextFieldContainer>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;

const TextFieldContainer = styled.div<{ $fullWidth: boolean }>`
  display: inline-flex;
  flex-direction: column;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  margin-bottom: 8px;
`;

const Label = styled.label<{ $error: boolean; $disabled: boolean }>`
  font-size: 14px;
  margin-bottom: 6px;
  color: ${({ theme, $error, $disabled }) => 
    $disabled 
      ? theme.textSecondary 
      : $error 
        ? theme.error 
        : theme.text};
  font-weight: 500;
`;

const RequiredIndicator = styled.span`
  color: ${({ theme }) => theme.error};
  margin-left: 2px;
`;

const InputWrapper = styled.div<{ 
  $variant: 'outlined' | 'filled' | 'standard'; 
  $error: boolean; 
  $size: 'small' | 'medium';
  $disabled: boolean;
}>`
  position: relative;
  width: 100%;
  
  ${({ $variant, $error, theme }) => {
    switch ($variant) {
      case 'filled':
        return `
          background-color: ${theme.backgroundTertiary};
          border-bottom: 2px solid ${$error ? theme.error : theme.borderColor};
          border-radius: 4px 4px 0 0;
        `;
      case 'standard':
        return `
          background-color: transparent;
          border-bottom: 1px solid ${$error ? theme.error : theme.borderColor};
          border-radius: 0;
        `;
      case 'outlined':
      default:
        return `
          background-color: transparent;
          border: 1px solid ${$error ? theme.error : theme.borderColor};
          border-radius: 4px;
        `;
    }
  }}
  
  ${({ $disabled, theme }) => $disabled && `
    opacity: 0.7;
    background-color: ${theme.backgroundDisabled};
  `}
  
  &:focus-within {
    border-color: ${({ theme, $error }) => ($error ? theme.error : theme.primary)};
    box-shadow: 0 0 0 2px ${({ theme, $error }) => 
      $error ? `${theme.error}30` : `${theme.primary}30`};
  }
`;

const baseInputStyles = `
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  ${baseInputStyles}
  padding: 10px 12px;
  color: ${({ theme }) => theme.text};
  
  &::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
`;

const TextArea = styled.textarea`
  ${baseInputStyles}
  padding: 10px 12px;
  color: ${({ theme }) => theme.text};
  resize: vertical;
  min-height: 80px;
  
  &::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
`;

const HelperText = styled.div<{ $error: boolean }>`
  font-size: 12px;
  margin-top: 4px;
  color: ${({ theme, $error }) => ($error ? theme.error : theme.textSecondary)};
`;
