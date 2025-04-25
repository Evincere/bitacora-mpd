import React from 'react';
import styled from 'styled-components';
import { FiAlertTriangle, FiX, FiCheck, FiInfo, FiAlertCircle } from 'react-icons/fi';

export type ConfirmDialogType = 'info' | 'warning' | 'danger' | 'success';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: ConfirmDialogType;
  isLoading?: boolean;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const DialogContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DialogHeader = styled.div<{ type: ConfirmDialogType }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'warning':
        return theme.warningLight || '#fff8e6';
      case 'danger':
        return theme.errorLight || '#ffe6e6';
      case 'success':
        return theme.successLight || '#e6f7e6';
      case 'info':
      default:
        return theme.infoLight || '#e6f0ff';
    }
  }};
  border-bottom: 1px solid ${({ type, theme }) => {
    switch (type) {
      case 'warning':
        return theme.warning;
      case 'danger':
        return theme.error;
      case 'success':
        return theme.success;
      case 'info':
      default:
        return theme.info || theme.primary;
    }
  }}30;
`;

const Title = styled.h3<{ type: ConfirmDialogType }>`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ type, theme }) => {
    switch (type) {
      case 'warning':
        return theme.warning;
      case 'danger':
        return theme.error;
      case 'success':
        return theme.success;
      case 'info':
      default:
        return theme.info || theme.primary;
    }
  }};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: ${({ theme }) => theme.textSecondary};
  background: none;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.text};
  }
`;

const DialogContent = styled.div`
  padding: 20px;
`;

const Message = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
  gap: 12px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.inputBackground};
  }
`;

const ConfirmButton = styled(Button)<{ type: ConfirmDialogType }>`
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'warning':
        return theme.warning;
      case 'danger':
        return theme.error;
      case 'success':
        return theme.success;
      case 'info':
      default:
        return theme.primary;
    }
  }};
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: ${({ type, theme }) => {
      switch (type) {
        case 'warning':
          return theme.warningHover || theme.warning;
        case 'danger':
          return theme.errorHover || theme.error;
        case 'success':
          return theme.successHover || theme.success;
        case 'info':
        default:
          return theme.primaryHover || theme.primary;
      }
    }};
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'info',
  isLoading = false
}) => {
  if (!isOpen) return null;
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <FiAlertTriangle size={20} />;
      case 'danger':
        return <FiAlertCircle size={20} />;
      case 'success':
        return <FiCheck size={20} />;
      case 'info':
      default:
        return <FiInfo size={20} />;
    }
  };
  
  return (
    <Overlay onClick={handleOverlayClick}>
      <DialogContainer>
        <DialogHeader type={type}>
          <Title type={type}>
            {getIcon()}
            {title}
          </Title>
          <CloseButton onClick={onCancel}>
            <FiX size={20} />
          </CloseButton>
        </DialogHeader>
        
        <DialogContent>
          <Message>{message}</Message>
        </DialogContent>
        
        <DialogFooter>
          <CancelButton onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </CancelButton>
          <ConfirmButton 
            type={type} 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : getIcon()}
            {confirmText}
          </ConfirmButton>
        </DialogFooter>
      </DialogContainer>
    </Overlay>
  );
};

export default ConfirmDialog;
