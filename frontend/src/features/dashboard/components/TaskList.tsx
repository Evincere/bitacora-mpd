/**
 * @file TaskList component
 * @description A reusable component for displaying lists of tasks/requests
 */

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiArrowRight, FiClock, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { StatusBadge, PriorityBadge, CategoryBadge } from '@/shared/components/ui';
import { glassCard } from '@/shared/styles';

// Styled components
const ListContainer = styled.div`
  ${glassCard}
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ListTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ViewAllLink = styled.a`
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.primaryHover};
    text-decoration: underline;
  }
`;

const TaskItem = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-left: 4px solid ${({ theme }) => theme.primary};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const TaskTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  margin: 0;
`;

const TaskMeta = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const TaskDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TaskDescription = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
`;

const TaskDate = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.textTertiary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;

  h4 {
    margin: 8px 0 4px;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 16px;
`;

const LoadingSpinner = styled(FiLoader)`
  animation: spin 1s linear infinite;
  color: ${({ theme }) => theme.primary};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Types
export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  category?: {
    name: string;
  };
  createdAt: string;
  dueDate?: string;
  assignee?: string;
  requester?: string;
}

interface TaskListProps {
  title: string;
  icon: React.ReactNode;
  items: TaskItem[];
  viewAllLink?: string;
  viewAllLabel?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  onItemClick?: (id: number) => void;
  type?: 'request' | 'task' | 'assignment';
}

/**
 * TaskList component
 * @param props Component props
 * @returns {JSX.Element} The TaskList component
 */
const TaskList: React.FC<TaskListProps> = ({
  title,
  icon,
  items,
  viewAllLink,
  viewAllLabel = 'Ver todos',
  emptyMessage = 'No hay elementos para mostrar',
  isLoading = false,
  onItemClick,
  type = 'task'
}) => {
  const navigate = useNavigate();

  const handleItemClick = (id: number) => {
    if (onItemClick) {
      onItemClick(id);
    } else {
      // Default navigation based on type
      switch (type) {
        case 'request':
          navigate(`/app/solicitudes/seguimiento/${id}`);
          break;
        case 'assignment':
          navigate(`/app/asignacion/asignar/${id}`);
          break;
        case 'task':
        default:
          navigate(`/app/tareas/progreso/${id}`);
          break;
      }
    }
  };

  const handleViewAll = () => {
    if (viewAllLink) {
      navigate(viewAllLink);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>
          {icon}
          {title}
        </ListTitle>
        {viewAllLink && (
          <ViewAllLink onClick={handleViewAll}>
            {viewAllLabel}
            <FiArrowRight size={14} />
          </ViewAllLink>
        )}
      </ListHeader>

      {isLoading ? (
        <LoadingState>
          <LoadingSpinner size={24} />
        </LoadingState>
      ) : items.length === 0 ? (
        <EmptyState>
          <FiAlertCircle size={24} />
          <h4>{title === "Tareas Asignadas" ? "No hay tareas pendientes" : "No hay tareas en progreso"}</h4>
          <p>{title === "Tareas Asignadas"
            ? "No tienes tareas pendientes de iniciar en este momento."
            : "No tienes tareas en curso actualmente."}</p>
          {title === "Tareas Asignadas" && (
            <p style={{ marginTop: '8px', fontSize: '13px' }}>
              Cuando recibas nuevas asignaciones, aparecerán aquí.
            </p>
          )}
        </EmptyState>
      ) : (
        items.map((item) => (
          <TaskItem key={item.id} onClick={() => handleItemClick(item.id)}>
            <TaskHeader>
              <TaskTitle>{item.title}</TaskTitle>
              <TaskMeta>
                <PriorityBadge priority={item.priority}>
                  {item.priority}
                </PriorityBadge>
                <StatusBadge status={item.status}>
                  {item.status}
                </StatusBadge>
              </TaskMeta>
            </TaskHeader>
            <TaskDetails>
              <TaskDescription>{item.description}</TaskDescription>
              <TaskDate>
                <FiClock size={12} />
                {formatDate(item.createdAt)}
              </TaskDate>
            </TaskDetails>
          </TaskItem>
        ))
      )}
    </ListContainer>
  );
};

export default TaskList;
