import React from 'react';
import TaskRequestStats from '../../components/task-request/TaskRequestStats';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const TaskRequestStatsPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Solo los asignadores y administradores pueden ver las estadísticas
  if (!currentUser?.roles.includes('ROLE_ASIGNADOR') && !currentUser?.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <TaskRequestStats />;
};

export default TaskRequestStatsPage;
