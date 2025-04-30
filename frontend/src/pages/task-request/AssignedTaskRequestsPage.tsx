import React from 'react';
import TaskRequestList from '../../components/task-request/TaskRequestList';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AssignedTaskRequestsPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Solo los asignadores y administradores pueden ver las solicitudes asignadas
  if (!currentUser?.roles.includes('ROLE_ASIGNADOR') && !currentUser?.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <TaskRequestList listType="assigned-to-me" title="Solicitudes Asignadas" />;
};

export default AssignedTaskRequestsPage;
