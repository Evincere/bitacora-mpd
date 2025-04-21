import React from 'react';
import styled from 'styled-components';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
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
  z-index: 1000;
`;

const DialogContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadowHover};
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    color: ${({ theme }) => theme.warning};
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: ${({ theme }) => theme.textSecondary};
  
  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.text};
  }
`;

const DialogContent = styled.div`
  padding: 20px;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.text};
`;

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundSecondary};
`;

const Button = styled.button<{ primary?: boolean; danger?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
  
  background-color: ${({ primary, danger, theme }) => 
    danger ? theme.error : 
    primary ? theme.primary : 
    theme.backgroundSecondary
  };
  
  color: ${({ primary, danger, theme }) => 
    (primary || danger) ? 'white' : theme.text
  };
  
  &:hover {
    background-color: ${({ primary, danger, theme }) => 
      danger ? theme.errorHover : 
      primary ? theme.buttonHover : 
      theme.inputBackground
    };
  }
`;

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  onConfirm,
  onCancel
}) => {
  // Cerrar el diálogo al presionar Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onCancel]);
  
  // Prevenir que el clic en el diálogo cierre el modal
  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <Overlay onClick={onCancel}>
      <DialogContainer onClick={handleDialogClick}>
        <DialogHeader>
          <Title>
            <FiAlertTriangle size={20} />
            {title}
          </Title>
          <CloseButton onClick={onCancel}>
            <FiX size={20} />
          </CloseButton>
        </DialogHeader>
        
        <DialogContent>
          {message}
        </DialogContent>
        
        <DialogFooter>
          <Button onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button primary danger={danger} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContainer>
    </Overlay>
  );
};

export default ConfirmDialog;
