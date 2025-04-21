import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

// Tipos de notificaciones
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Propiedades del componente Toast
export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

// Animaciones
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

// Estilos
const ToastItem = styled.div<{ type: ToastType; isClosing: boolean }>`
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  background-color: ${({ theme, type }) => {
    switch (type) {
      case 'success': return theme.success || '#4caf50';
      case 'error': return theme.error || '#f44336';
      case 'warning': return theme.warning || '#ff9800';
      case 'info': return theme.info || '#2196f3';
      default: return theme.backgroundSecondary;
    }
  }};
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${({ isClosing }) => isClosing ? slideOut : slideIn} 0.3s ease-in-out;
  overflow: hidden;
  width: 100%;
  max-width: 350px;
  margin-bottom: 8px;
  position: relative;
  
  /* Mejora de accesibilidad: enfoque visible */
  &:focus {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`;

const IconContainer = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const Content = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  opacity: 0.7;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover, &:focus {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  /* Mejora de accesibilidad: enfoque visible */
  &:focus {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`;

// Componente Toast
const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isClosing, setIsClosing] = useState(false);
  
  // Cerrar automáticamente después de la duración especificada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      
      // Dar tiempo para la animación de salida
      setTimeout(() => {
        onClose(id);
      }, 300);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);
  
  // Manejar cierre manual
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };
  
  // Obtener el icono según el tipo
  const getIcon = () => {
    switch (type) {
      case 'success': return <FiCheckCircle aria-hidden="true" />;
      case 'error': return <FiAlertCircle aria-hidden="true" />;
      case 'warning': return <FiAlertTriangle aria-hidden="true" />;
      case 'info': return <FiInfo aria-hidden="true" />;
      default: return <FiInfo aria-hidden="true" />;
    }
  };
  
  // Obtener el texto de anuncio para lectores de pantalla
  const getAriaLabel = () => {
    switch (type) {
      case 'success': return 'Notificación de éxito';
      case 'error': return 'Notificación de error';
      case 'warning': return 'Notificación de advertencia';
      case 'info': return 'Notificación informativa';
      default: return 'Notificación';
    }
  };
  
  return (
    <ToastItem 
      type={type} 
      isClosing={isClosing}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      tabIndex={0}
    >
      <IconContainer>{getIcon()}</IconContainer>
      <Content>
        {title && <h4>{title}</h4>}
        <p>{message}</p>
      </Content>
      <CloseButton 
        onClick={handleClose}
        aria-label="Cerrar notificación"
      >
        <FiX size={18} aria-hidden="true" />
      </CloseButton>
    </ToastItem>
  );
};

export default Toast;
