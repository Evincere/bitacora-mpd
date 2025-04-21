import React from 'react';
import styled from 'styled-components';
import Toast, { ToastType } from './Toast';

// Interfaz para la notificación
export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

// Propiedades del contenedor
interface ToastContainerProps {
  notifications: ToastNotification[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onClose: (id: string) => void;
}

// Estilos del contenedor según la posición
const Container = styled.div<{ position: string }>`
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 350px;
  width: 100%;
  padding: 16px;
  pointer-events: none;
  
  /* Posicionamiento según la propiedad position */
  ${({ position }) => {
    switch (position) {
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
      case 'top-right':
      default:
        return `
          top: 0;
          right: 0;
        `;
    }
  }}
  
  /* Cada notificación debe tener pointer-events para ser interactiva */
  & > * {
    pointer-events: auto;
  }
`;

// Componente ToastContainer
const ToastContainer: React.FC<ToastContainerProps> = ({
  notifications,
  position = 'top-right',
  onClose
}) => {
  return (
    <Container position={position} aria-label="Notificaciones">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          id={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          onClose={onClose}
        />
      ))}
    </Container>
  );
};

export default ToastContainer;
