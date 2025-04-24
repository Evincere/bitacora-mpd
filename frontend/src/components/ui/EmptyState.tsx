import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import { FaInbox } from 'react-icons/fa';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  background: ${({ theme }) => theme.backgroundAlt};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const Title = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
`;

const Description = styled.p`
  margin: 0 0 1.5rem;
  color: ${({ theme }) => theme.textSecondary};
  max-width: 500px;
`;

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <FaInbox />,
  actionText,
  onAction
}) => {
  return (
    <Container>
      <IconWrapper>{icon}</IconWrapper>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {actionText && onAction && (
        <Button color="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Container>
  );
};

export default EmptyState;
