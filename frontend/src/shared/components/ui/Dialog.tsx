import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';
import { glassModal } from '@/shared/styles';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  className?: string;
}

export interface DialogTitleProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

export interface DialogActionsProps {
  children: ReactNode;
  className?: string;
}

// Componente principal Dialog
const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  children,
  maxWidth = 'sm',
  fullWidth = false,
  className
}) => {
  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <DialogOverlay onClick={handleOverlayClick}>
      <DialogContainer 
        $maxWidth={maxWidth} 
        $fullWidth={fullWidth}
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </DialogContainer>
    </DialogOverlay>
  );
};

// Componente DialogTitle
export const DialogTitle: React.FC<DialogTitleProps> = ({ 
  children, 
  onClose,
  className
}) => {
  return (
    <StyledDialogTitle className={className}>
      <div>{children}</div>
      {onClose && (
        <CloseButton onClick={onClose}>
          <FiX size={20} />
        </CloseButton>
      )}
    </StyledDialogTitle>
  );
};

// Componente DialogContent
export const DialogContent: React.FC<DialogContentProps> = ({ 
  children,
  className
}) => {
  return (
    <StyledDialogContent className={className}>
      {children}
    </StyledDialogContent>
  );
};

// Componente DialogActions
export const DialogActions: React.FC<DialogActionsProps> = ({ 
  children,
  className
}) => {
  return (
    <StyledDialogActions className={className}>
      {children}
    </StyledDialogActions>
  );
};

// Estilos
const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
`;

const getMaxWidthValue = (maxWidth: string): string => {
  switch (maxWidth) {
    case 'xs':
      return '444px';
    case 'sm':
      return '600px';
    case 'md':
      return '900px';
    case 'lg':
      return '1200px';
    case 'xl':
      return '1536px';
    default:
      return '600px';
  }
};

const DialogContainer = styled.div<{ $maxWidth: string; $fullWidth: boolean }>`
  ${glassModal}
  width: ${({ $fullWidth, $maxWidth }) => 
    $fullWidth ? '100%' : 'auto'};
  max-width: ${({ $maxWidth }) => getMaxWidthValue($maxWidth)};
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 40px);
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const StyledDialogTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.textPrimary};
  }
`;

const StyledDialogContent = styled.div`
  padding: 24px;
  overflow-y: auto;
  color: ${({ theme }) => theme.text};
`;

const StyledDialogActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  gap: 8px;
`;

export default Dialog;
