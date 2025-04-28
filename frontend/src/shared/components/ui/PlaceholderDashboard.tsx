import React from 'react';
import styled from 'styled-components';
import { FiAlertCircle, FiInfo } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

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

const InfoBox = styled.div`
  background-color: ${({ theme }) => `${theme.primary}10`};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  max-width: 600px;
  display: flex;
  align-items: flex-start;
  
  .icon {
    margin-right: 0.5rem;
    color: ${({ theme }) => theme.primary};
    flex-shrink: 0;
  }
  
  .text {
    text-align: left;
    font-size: 0.9rem;
  }
`;

const PlaceholderDashboard: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Determinar el título y la descripción según la ruta
  let title = 'Página en Desarrollo';
  let description = 'Esta página está en desarrollo y estará disponible próximamente.';
  
  if (path.includes('/solicitudes')) {
    title = 'Dashboard de Solicitudes';
    description = 'Aquí podrás gestionar tus solicitudes, ver su estado y crear nuevas.';
  } else if (path.includes('/asignacion')) {
    title = 'Dashboard de Asignación';
    description = 'Aquí podrás asignar tareas, gestionar la distribución de carga y ver métricas de asignación.';
  } else if (path.includes('/tareas')) {
    title = 'Dashboard de Tareas';
    description = 'Aquí podrás ver tus tareas asignadas, actualizar su progreso y consultar el historial.';
  } else if (path.includes('/configuracion')) {
    title = 'Configuración del Sistema';
    description = 'Aquí podrás configurar aspectos del sistema como tareas, notificaciones e integraciones.';
  } else if (path.includes('/reportes')) {
    title = 'Reportes y Métricas';
    description = 'Aquí podrás generar reportes y visualizar métricas del sistema.';
  }
  
  return (
    <Container>
      <IconContainer><FiAlertCircle size={48} /></IconContainer>
      <Title>{title}</Title>
      <Description>{description}</Description>
      
      <InfoBox>
        <div className="icon">
          <FiInfo size={20} />
        </div>
        <div className="text">
          <strong>Información:</strong> Esta página está actualmente en desarrollo. 
          Como usuario con rol ADMIN, tienes acceso a todas las secciones del sistema, 
          pero algunas funcionalidades aún no están implementadas.
        </div>
      </InfoBox>
      
      <InfoBox style={{ marginTop: '1rem' }}>
        <div className="icon">
          <FiInfo size={20} />
        </div>
        <div className="text">
          <strong>Ruta actual:</strong> {path}
        </div>
      </InfoBox>
    </Container>
  );
};

export default PlaceholderDashboard;
