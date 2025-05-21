/**
 * @file DashboardHeader component
 * @description Header component for the SmartDashboard with role-based welcome message
 */

import React from 'react';
import styled from 'styled-components';
import { User, UserRole } from '@/core/types/models';

// Styled components
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const WelcomeSection = styled.div`
  h1 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  p {
    color: ${({ theme }) => theme.textSecondary};
  }
`;



interface DashboardHeaderProps {
  user: User;
}

/**
 * Get a personalized welcome message based on user role
 * @param user The current user
 * @returns A personalized welcome message
 */
const getWelcomeMessage = (user: User): string => {
  const firstName = user.firstName || user.username;

  switch (user.role) {
    case UserRole.SOLICITANTE:
      return `Bienvenido, ${firstName}. Aquí puedes gestionar tus solicitudes.`;
    case UserRole.ASIGNADOR:
      return `Bienvenido, ${firstName}. Aquí puedes gestionar la asignación de tareas.`;
    case UserRole.EJECUTOR:
      return `Bienvenido, ${firstName}. Aquí puedes gestionar tus tareas asignadas.`;
    case UserRole.ADMIN:
      return `Bienvenido, ${firstName}. Aquí tienes una visión general del sistema.`;
    case UserRole.SUPERVISOR:
      return `Bienvenido, ${firstName}. Aquí puedes supervisar las actividades.`;
    default:
      return `Bienvenido, ${firstName}. Aquí tienes un resumen de las actividades.`;
  }
};

/**
 * DashboardHeader component
 * @param props Component props
 * @returns {JSX.Element} The DashboardHeader component
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const welcomeMessage = getWelcomeMessage(user);

  return (
    <HeaderContainer>
      <WelcomeSection>
        <h1>Dashboard</h1>
        <p>{welcomeMessage}</p>
      </WelcomeSection>
    </HeaderContainer>
  );
};

export default DashboardHeader;
