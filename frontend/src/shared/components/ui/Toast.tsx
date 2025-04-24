import React, { createContext, useContext, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { ToastType } from '@/core/types/models';

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  defaultDuration?: number;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(20px);
  }
`;

interface ToastContainerProps {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const ToastContainer = styled.div<ToastContainerProps>`
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  max-width: 350px;
  width: 100%;
  
  ${({ position }) => {
    switch (position) {
      case 'top-right':
        return `
          top: 0;
          right: 0;
        `;
      case 'top-left':
        return `
          top: 0;
          left: 0;
        `;
      case 'bottom-right':
        return `
          bottom: 0;
          right: 0;
        `;
      case 'bottom-left':
        return `
          bottom: 0;
          left: 0;
        `;
      default:
        return `
          top: 0;
          right: 0;
        `;
    }
  }}
`;

interface ToastItemProps {
  type: ToastType;
  isExiting: boolean;
}

const ToastItem = styled.div<ToastItemProps>`
  display: flex;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${({ isExiting }) => isExiting ? fadeOut : fadeIn} 0.3s ease-in-out;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid;
  
  ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return `
          background-color: rgba(76, 217, 100, 0.15);
          border-color: ${theme.success};
          color: ${theme.success};
        `;
      case 'error':
        return `
          background-color: rgba(255, 59, 48, 0.15);
          border-color: ${theme.error};
          color: ${theme.error};
        `;
      case 'warning':
        return `
          background-color: rgba(255, 204, 0, 0.15);
          border-color: ${theme.warning};
          color: ${theme.warning};
        `;
      case 'info':
      default:
        return `
          background-color: rgba(0, 122, 255, 0.15);
          border-color: ${theme.info || theme.primary};
          color: ${theme.info || theme.primary};
        `;
    }
  }}
`;

const IconContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-right: 12px;
  font-size: 20px;
`;

const ContentContainer = styled.div`
  flex: 1;
`;

const ToastTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
`;

const ToastMessage = styled.div`
  font-size: 13px;
  opacity: 0.9;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  margin-left: 8px;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  position = 'top-right',
  defaultDuration = 5000
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [exitingToasts, setExitingToasts] = useState<string[]>([]);
  
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
  };
  
  const removeToast = (id: string) => {
    setExitingToasts(prev => [...prev, id]);
    
    // Remove after animation completes
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
      setExitingToasts(prev => prev.filter(toastId => toastId !== id));
    }, 300);
  };
  
  // Auto-remove toasts after duration
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    toasts.forEach(toast => {
      if (!exitingToasts.includes(toast.id)) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration || defaultDuration);
        
        timers.push(timer);
      }
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [toasts, defaultDuration, exitingToasts]);
  
  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle />;
      case 'error':
        return <FiAlertCircle />;
      case 'warning':
        return <FiAlertTriangle />;
      case 'info':
      default:
        return <FiInfo />;
    }
  };
  
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer position={position}>
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            type={toast.type}
            isExiting={exitingToasts.includes(toast.id)}
          >
            <IconContainer>
              {getToastIcon(toast.type)}
            </IconContainer>
            <ContentContainer>
              {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
              <ToastMessage>{toast.message}</ToastMessage>
            </ContentContainer>
            <CloseButton onClick={() => removeToast(toast.id)}>
              <FiX size={16} />
            </CloseButton>
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
