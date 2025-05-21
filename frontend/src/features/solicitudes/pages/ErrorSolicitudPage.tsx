import React from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorSolicitud from '../components/ErrorSolicitud';
import { FiArrowLeft } from 'react-icons/fi';

/**
 * Página que muestra un error al cargar una solicitud
 * con opción de reintentar o volver atrás.
 */
const ErrorSolicitudPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const handleRetry = () => {
    // Recargar la página actual
    window.location.reload();
  };
  
  const handleBack = () => {
    // Volver a la página anterior
    navigate(-1);
  };
  
  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <FiArrowLeft size={20} />
          <span>Volver</span>
        </BackButton>
        <Title>Error al cargar la solicitud</Title>
      </Header>
      
      <Content>
        <ErrorSolicitud onRetry={handleRetry} />
        
        <AdditionalInfo>
          <InfoTitle>¿Qué puede estar causando este problema?</InfoTitle>
          <InfoList>
            <InfoItem>La solicitud puede no existir o haber sido eliminada</InfoItem>
            <InfoItem>Puede haber un problema de conexión con el servidor</InfoItem>
            <InfoItem>Es posible que no tengas permisos para ver esta solicitud</InfoItem>
          </InfoList>
          
          <InfoTitle>¿Qué puedes hacer?</InfoTitle>
          <InfoList>
            <InfoItem>Haz clic en "Reintentar" para intentar cargar la solicitud nuevamente</InfoItem>
            <InfoItem>Verifica tu conexión a internet</InfoItem>
            <InfoItem>Contacta al administrador del sistema si el problema persiste</InfoItem>
          </InfoList>
        </AdditionalInfo>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => `${theme.primary}10`};
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0 0 0 24px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const AdditionalInfo = styled.div`
  ${({ theme }) => theme.glassCard}
  padding: 24px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  margin-top: 16px;
`;

const InfoTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0 0 16px 0;
  
  &:not(:first-child) {
    margin-top: 24px;
  }
`;

const InfoList = styled.ul`
  margin: 0;
  padding: 0 0 0 20px;
`;

const InfoItem = styled.li`
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
  line-height: 1.5;
`;

export default ErrorSolicitudPage;
