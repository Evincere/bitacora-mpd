import { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import styled, { ThemeProvider, useTheme } from 'styled-components';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

// Componentes estilizados para el diálogo de confirmación
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
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const DialogContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 450px;
  padding: 0;
  animation: slideIn 0.2s ease-out;
  overflow: hidden;

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const DialogContent = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  line-height: 1.5;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.warningLight};
  color: ${({ theme }) => theme.warning};
  margin: 0 auto 16px;
`;

const Message = styled.p`
  margin: 0 0 16px;
  text-align: center;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.textSecondary};
  border-color: ${({ theme }) => theme.borderColor};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const ConfirmButton = styled(Button)`
  background-color: ${({ theme, variant }) => 
    variant === 'danger' ? theme.danger : 
    variant === 'warning' ? theme.warning : theme.primary};
  color: ${({ theme }) => theme.buttonText};

  &:hover:not(:disabled) {
    background-color: ${({ theme, variant }) => 
      variant === 'danger' ? theme.dangerHover : 
      variant === 'warning' ? theme.warningHover : theme.primaryHover};
  }
`;

/**
 * Componente de diálogo de confirmación
 */
const ConfirmDialog = ({ 
  title = 'Confirmar', 
  message = '¿Estás seguro?', 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar',
  confirmVariant = 'primary',
  onConfirm, 
  onCancel 
}) => {
  const theme = useTheme();

  return (
    <Overlay onClick={onCancel}>
      <DialogContainer onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <Title>{title}</Title>
          <CloseButton onClick={onCancel}>
            <FiX size={20} />
          </CloseButton>
        </DialogHeader>
        <DialogContent>
          <IconContainer>
            <FiAlertTriangle size={24} />
          </IconContainer>
          <Message>{message}</Message>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={onCancel}>
            {cancelText}
          </CancelButton>
          <ConfirmButton variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </ConfirmButton>
        </DialogActions>
      </DialogContainer>
    </Overlay>
  );
};

/**
 * Hook personalizado para mostrar diálogos de confirmación
 */
export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [resolveRef, setResolveRef] = useState(null);
  const [options, setOptions] = useState({});
  const theme = useTheme();

  const confirm = useCallback((options = {}) => {
    setOptions(options);
    setIsOpen(true);
    
    return new Promise((resolve) => {
      setResolveRef(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolveRef(true);
  }, [resolveRef]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolveRef(false);
  }, [resolveRef]);

  const renderConfirmDialog = useCallback(() => {
    if (!isOpen) return null;

    const container = document.createElement('div');
    document.body.appendChild(container);
    
    const root = createRoot(container);
    
    const cleanup = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    root.render(
      <ThemeProvider theme={theme}>
        <ConfirmDialog
          title={options.title}
          message={options.message}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          confirmVariant={options.confirmVariant}
          onConfirm={() => {
            handleConfirm();
            cleanup();
          }}
          onCancel={() => {
            handleCancel();
            cleanup();
          }}
        />
      </ThemeProvider>
    );

    return cleanup;
  }, [isOpen, options, handleConfirm, handleCancel, theme]);

  // Renderizar el diálogo cuando isOpen cambia
  if (isOpen) {
    renderConfirmDialog();
  }

  return { confirm };
};

export default useConfirm;
