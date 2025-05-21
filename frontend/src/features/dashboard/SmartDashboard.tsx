/**
 * @file SmartDashboard component
 * @description A unified dashboard that adapts to the user's role
 */

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '@/core/store';
import { UserRole } from '@/core/types/models';
import { FiLoader } from 'react-icons/fi';
import { glassCard } from '@/shared/styles';

// Role-specific content components
import SolicitanteDashboardContent from './components/SolicitanteDashboardContent';
import AsignadorDashboardContent from './components/AsignadorDashboardContent';
import EjecutorDashboardContent from './components/EjecutorDashboardContent';
import AdminDashboardContent from './components/AdminDashboardContent';

// Shared components
import DashboardHeader from './components/DashboardHeader';
import QuickActionsBar from './components/QuickActionsBar';
import DashboardFooter from './components/DashboardFooter';

// Styled components
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  ${glassCard}
  padding: 24px;
`;

const LoadingSpinner = styled(FiLoader)`
  animation: spin 1s linear infinite;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 16px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 16px;
`;

/**
 * SmartDashboard component that adapts to the user's role
 * @returns {JSX.Element} The SmartDashboard component
 */
const SmartDashboard: React.FC = () => {
  // Get the current user from the global state
  const { user, isLoading: isLoadingUser } = useAppSelector((state) => state.auth);

  // Log the current user role for debugging
  useEffect(() => {
    if (user) {
      console.log('SmartDashboard: Current user role:', user.role);
    }
  }, [user]);

  // Render loading state if user data is still loading
  if (isLoadingUser || !user) {
    return (
      <DashboardContainer>
        <LoadingContainer>
          <LoadingSpinner size={40} />
          <LoadingText>Cargando dashboard...</LoadingText>
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  // Determine which dashboard content to render based on user role
  const renderDashboardContent = () => {
    switch (user.role) {
      case UserRole.SOLICITANTE:
        return <SolicitanteDashboardContent />;
      case UserRole.ASIGNADOR:
        return <AsignadorDashboardContent />;
      case UserRole.EJECUTOR:
        return <EjecutorDashboardContent />;
      case UserRole.ADMIN:
        return <AdminDashboardContent />;
      default:
        // For other roles (SUPERVISOR, USUARIO, CONSULTA), show a simplified dashboard
        // We could create specific content for these roles in the future
        return <AdminDashboardContent />;
    }
  };

  return (
    <DashboardContainer>
      {/* Common header with role-based welcome message */}
      <DashboardHeader user={user} />

      {/* Role-specific quick actions bar */}
      <QuickActionsBar userRole={user.role} />

      {/* Role-specific dashboard content */}
      {renderDashboardContent()}

      {/* Common footer */}
      <DashboardFooter />
    </DashboardContainer>
  );
};

export default SmartDashboard;
