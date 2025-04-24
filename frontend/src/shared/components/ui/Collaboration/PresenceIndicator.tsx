import React from 'react';
import styled from 'styled-components';
import { FiUsers } from 'react-icons/fi';

interface PresenceIndicatorProps {
  activityId: number;
  userNames: string[];
  size?: 'small' | 'medium' | 'large';
  position?: 'inline' | 'floating';
}

const Container = styled.div<{ position: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  position: ${({ position }) => position === 'floating' ? 'absolute' : 'relative'};
  top: ${({ position }) => position === 'floating' ? '8px' : 'auto'};
  right: ${({ position }) => position === 'floating' ? '8px' : 'auto'};
  z-index: 5;
`;

const IconWrapper = styled.div<{ size: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size === 'small' ? '24px' : size === 'medium' ? '32px' : '40px'};
  height: ${({ size }) => size === 'small' ? '24px' : size === 'medium' ? '32px' : '40px'};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-size: ${({ size }) => size === 'small' ? '12px' : size === 'medium' ? '14px' : '16px'};
`;

const UserCount = styled.span<{ size: string }>`
  font-size: ${({ size }) => size === 'small' ? '12px' : size === 'medium' ? '14px' : '16px'};
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
`;

const Tooltip = styled.div`
  position: relative;
  display: inline-block;
  
  &:hover .tooltip-content {
    visibility: visible;
    opacity: 1;
  }
`;

const TooltipContent = styled.div`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.text};
  padding: 8px 12px;
  border-radius: 4px;
  box-shadow: ${({ theme }) => theme.shadow};
  min-width: 150px;
  z-index: 10;
  transition: opacity 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${({ theme }) => theme.backgroundSecondary} transparent transparent transparent;
  }
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const UserItem = styled.li`
  padding: 4px 0;
  font-size: 12px;
`;

const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  activityId,
  userNames,
  size = 'medium',
  position = 'floating'
}) => {
  if (!userNames || userNames.length === 0) {
    return null;
  }
  
  return (
    <Container position={position}>
      <Tooltip>
        <IconWrapper size={size}>
          <FiUsers size={size === 'small' ? 14 : size === 'medium' ? 18 : 22} />
        </IconWrapper>
        <TooltipContent className="tooltip-content">
          <UserList>
            {userNames.map((name, index) => (
              <UserItem key={index}>{name}</UserItem>
            ))}
          </UserList>
        </TooltipContent>
      </Tooltip>
      {userNames.length > 1 && (
        <UserCount size={size}>{userNames.length}</UserCount>
      )}
    </Container>
  );
};

export default PresenceIndicator;
