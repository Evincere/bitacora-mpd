import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

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

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
`;

const NotificationItem = styled.div`
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
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: ${({ $isClosing }) => $isClosing ? slideOut : slideIn} 0.3s ease-in-out;
  overflow: hidden;
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
  padding: 0;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }
`;

const Notification = ({ id, type, title, message, duration = 5000, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <FiCheckCircle />;
      case 'error': return <FiAlertCircle />;
      case 'warning': return <FiAlertTriangle />;
      case 'info': return <FiInfo />;
      default: return <FiInfo />;
    }
  };

  return (
    <NotificationItem type={type} $isClosing={isClosing}>
      <IconContainer>{getIcon()}</IconContainer>
      <Content>
        {title && <h4>{title}</h4>}
        <p>{message}</p>
      </Content>
      <CloseButton onClick={handleClose}>
        <FiX size={18} />
      </CloseButton>
    </NotificationItem>
  );
};

export default Notification;
