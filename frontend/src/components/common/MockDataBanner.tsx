import React, { useState } from 'react';
import styled from 'styled-components';
import { FiInfo, FiX } from 'react-icons/fi';

const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background-color: ${({ theme }) => theme.info || '#2196f3'};
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

interface MockDataBannerProps {
  message?: string;
}

const MockDataBanner: React.FC<MockDataBannerProps> = ({ 
  message = 'Estás viendo datos simulados porque el backend no está disponible o no tiene implementado este endpoint.'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;
  
  return (
    <BannerContainer>
      <Content>
        <IconContainer>
          <FiInfo size={20} />
        </IconContainer>
        <Message>
          <strong>Modo de desarrollo:</strong> {message}
        </Message>
      </Content>
      <CloseButton onClick={() => setIsVisible(false)}>
        <FiX size={18} />
      </CloseButton>
    </BannerContainer>
  );
};

export default MockDataBanner;
