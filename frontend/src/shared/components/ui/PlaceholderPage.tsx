import React from 'react';
import styled from 'styled-components';
import { FiAlertCircle } from 'react-icons/fi';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.primary};
`;

const Description = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.textSecondary};
  max-width: 600px;
`;

const IconContainer = styled.div`
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.primary};
  font-size: 3rem;
`;

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description = 'Esta página está en desarrollo y estará disponible próximamente.',
  icon = <FiAlertCircle size={48} />
}) => {
  return (
    <Container>
      <IconContainer>{icon}</IconContainer>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Container>
  );
};

export default PlaceholderPage;
