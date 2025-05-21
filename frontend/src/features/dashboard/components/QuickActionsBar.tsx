/**
 * @file QuickActionsBar component
 * @description A bar with quick action buttons that adapts to the user's role
 */

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/core/types/models';
import {
  FiPlus,
  FiInbox,
  FiUsers,
  FiClipboard,
  FiPlay,
  FiBarChart2,
  FiSettings,
  FiRefreshCw,
  FiFilter,
  FiAlertCircle
} from 'react-icons/fi';
import useSmartDashboardData from '../hooks/useSmartDashboardData';

// Styled components
const ActionsBarContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: ${({ theme, $disabled }) =>
    $disabled ? theme.backgroundDisabled : theme.backgroundSecondary};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.textDisabled : theme.text};
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: ${({ $disabled }) =>
    $disabled ? 'none' : '0 2px 5px rgba(0, 0, 0, 0.1)'};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.7 : 1)};

  &:hover {
    background-color: ${({ theme, $disabled }) =>
      $disabled ? theme.backgroundDisabled : theme.backgroundHover};
    transform: ${({ $disabled }) => ($disabled ? 'none' : 'translateY(-2px)')};
    box-shadow: ${({ $disabled }) =>
      $disabled ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.15)'};
  }

  &.primary {
    background-color: ${({ theme, $disabled }) =>
      $disabled ? theme.backgroundDisabled : theme.primary};
    color: ${({ $disabled }) => ($disabled ? '#999' : 'white')};

    &:hover {
      background-color: ${({ theme, $disabled }) =>
        $disabled ? theme.backgroundDisabled : theme.primaryHover};
    }
  }
`;

interface QuickActionsBarProps {
  userRole: UserRole;
}

/**
 * QuickActionsBar component
 * @param props Component props
 * @returns {JSX.Element} The QuickActionsBar component
 */
const QuickActionsBar: React.FC<QuickActionsBarProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const { data, isLoading, refreshData } = useSmartDashboardData();

  // Verificar si hay tareas asignadas pendientes para el ejecutor
  const hasPendingTasks = React.useMemo(() => {
    if (userRole !== UserRole.EJECUTOR) return true;
    return data.assignedTasks && data.assignedTasks.length > 0;
  }, [userRole, data.assignedTasks]);

  // Manejar la actualización de datos
  const handleRefresh = () => {
    refreshData();
  };

  // Render role-specific action buttons
  const renderRoleActions = () => {
    switch (userRole) {
      case UserRole.SOLICITANTE:
        return (
          <>
            <ActionButton
              className="primary"
              onClick={() => navigate('/app/solicitudes/nueva')}
            >
              <FiPlus size={18} />
              Nueva Solicitud
            </ActionButton>
            <ActionButton onClick={() => navigate('/app/solicitudes')}>
              <FiClipboard size={18} />
              Mis Solicitudes
            </ActionButton>
            <ActionButton onClick={() => handleRefresh()}>
              <FiRefreshCw size={18} />
              Actualizar
            </ActionButton>
          </>
        );

      case UserRole.ASIGNADOR:
        return (
          <>
            <ActionButton
              className="primary"
              onClick={() => navigate('/app/asignacion/bandeja')}
            >
              <FiInbox size={18} />
              Bandeja de Entrada
            </ActionButton>
            <ActionButton onClick={() => navigate('/app/asignacion/distribucion')}>
              <FiUsers size={18} />
              Distribución de Carga
            </ActionButton>
            <ActionButton onClick={() => navigate('/app/asignacion/metricas')}>
              <FiBarChart2 size={18} />
              Métricas
            </ActionButton>
            <ActionButton onClick={() => handleRefresh()}>
              <FiRefreshCw size={18} />
              Actualizar
            </ActionButton>
          </>
        );

      case UserRole.EJECUTOR:
        return (
          <>
            <ActionButton
              className="primary"
              onClick={() => navigate('/app/tareas/asignadas')}
              $disabled={!hasPendingTasks || isLoading}
              title={!hasPendingTasks ? "No hay tareas pendientes para iniciar" : "Ir a tareas asignadas"}
            >
              {hasPendingTasks ? (
                <>
                  <FiPlay size={18} />
                  Iniciar Tarea
                </>
              ) : (
                <>
                  <FiAlertCircle size={18} />
                  No hay tareas pendientes
                </>
              )}
            </ActionButton>
            <ActionButton onClick={() => navigate('/app/tareas/progreso')}>
              <FiClipboard size={18} />
              Tareas en Progreso
            </ActionButton>
            <ActionButton onClick={() => navigate('/app/tareas/historial')}>
              <FiBarChart2 size={18} />
              Historial
            </ActionButton>
            <ActionButton onClick={() => handleRefresh()}>
              <FiRefreshCw size={18} />
              Actualizar
            </ActionButton>
          </>
        );

      case UserRole.ADMIN:
        return (
          <>
            <ActionButton
              className="primary"
              onClick={() => navigate('/app/admin/usuarios')}
            >
              <FiUsers size={18} />
              Gestionar Usuarios
            </ActionButton>
            <ActionButton onClick={() => navigate('/app/admin/configuracion')}>
              <FiSettings size={18} />
              Configuración
            </ActionButton>
            <ActionButton onClick={() => navigate('/app/admin/reportes')}>
              <FiBarChart2 size={18} />
              Reportes
            </ActionButton>
            <ActionButton onClick={() => handleRefresh()}>
              <FiRefreshCw size={18} />
              Actualizar
            </ActionButton>
          </>
        );

      default:
        return (
          <>
            <ActionButton onClick={() => handleRefresh()}>
              <FiRefreshCw size={18} />
              Actualizar
            </ActionButton>
          </>
        );
    }
  };

  return (
    <ActionsBarContainer>
      {isLoading && userRole === UserRole.EJECUTOR ? (
        <div style={{ padding: '10px 0', color: 'var(--text-secondary)' }}>
          Cargando datos...
        </div>
      ) : (
        renderRoleActions()
      )}
    </ActionsBarContainer>
  );
};

export default QuickActionsBar;
