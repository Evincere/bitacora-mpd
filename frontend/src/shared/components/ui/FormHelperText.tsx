import React from 'react';
import styled from 'styled-components';

export interface FormHelperTextProps {
  children: React.ReactNode;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

const FormHelperText: React.FC<FormHelperTextProps> = ({
  children,
  error = false,
  disabled = false,
  className
}) => {
  return (
    <StyledHelperText 
      $error={error} 
      $disabled={disabled}
      className={className}
    >
      {children}
    </StyledHelperText>
  );
};

export default FormHelperText;

const StyledHelperText = styled.p<{ $error: boolean; $disabled: boolean }>`
  font-size: 12px;
  margin: 4px 0 0;
  color: ${({ theme, $error, $disabled }) => 
    $disabled 
      ? theme.textTertiary 
      : $error 
        ? theme.error 
        : theme.textSecondary};
  line-height: 1.4;
`;
