import React, { useState } from 'react';
import styled from 'styled-components';
import { FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

const BannerContainer = styled.div<{ $type: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background-color: ${({ theme, $type }) => {
    switch ($type) {
      case 'error':
        return theme.error || '#f44336';
      case 'warning':
        return theme.warning || '#ff9800';
      case 'info':
        return theme.info || '#2196f3';
      default:
        return theme.info || '#2196f3';
    }
  }};
  color: white;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const IconContainer = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Message = styled.div`
  font-size: 14px;

  strong {
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  opacity: 0.7;
  cursor: pointer;
  padding: 0;
  margin-left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }
`;

interface ErrorBannerProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onClose?: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  type = 'error',
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <FiAlertCircle size={20} />;
      case 'warning':
        return <FiAlertTriangle size={20} />;
      case 'info':
        return <FiInfo size={20} />;
      default:
        return <FiInfo size={20} />;
    }
  };

  return (
    <BannerContainer $type={type}>
      <Content>
        <IconContainer>
          {getIcon()}
        </IconContainer>
        <Message>
          {message}
        </Message>
      </Content>
      <CloseButton onClick={handleClose}>
        <FiX size={18} />
      </CloseButton>
    </BannerContainer>
  );
};

export default ErrorBanner;
