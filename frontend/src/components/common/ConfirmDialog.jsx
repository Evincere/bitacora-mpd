import { useEffect } from 'react'
import styled from 'styled-components'
import { FiAlertTriangle, FiX } from 'react-icons/fi'

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
  padding: 20px;
`

const DialogContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  width: 100%;
  max-width: 400px;
  overflow: hidden;
`

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    color: ${({ theme, danger }) => danger ? theme.error : theme.primary};
  }
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textSecondary};
  
  &:hover {
    color: ${({ theme }) => theme.text};
  }
`

const DialogContent = styled.div`
  padding: 20px;
`

const Message = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.textSecondary};
`

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
`

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &.cancel {
    background-color: ${({ theme }) => theme.backgroundSecondary};
    color: ${({ theme }) => theme.text};
    
    &:hover {
      background-color: ${({ theme }) => theme.inputBackground};
    }
  }
  
  &.confirm {
    background-color: ${({ theme, danger }) => danger ? theme.error : theme.primary};
    color: white;
    
    &:hover {
      background-color: ${({ theme, danger }) => danger ? '#ff4d4d' : theme.buttonHover};
    }
  }
`

const ConfirmDialog = ({ 
  title, 
  message, 
  confirmLabel = 'Confirmar', 
  cancelLabel = 'Cancelar', 
  danger = false,
  onConfirm, 
  onCancel 
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onCancel])
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }
  
  return (
    <Overlay onClick={handleOverlayClick}>
      <DialogContainer>
        <DialogHeader>
          <Title danger={danger}>
            {danger && <FiAlertTriangle size={20} />}
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
          <Button className="cancel" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button className="confirm" danger={danger} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContainer>
    </Overlay>
  )
}

export default ConfirmDialog
