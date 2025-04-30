import React from 'react';
import TaskRequestList from '../../components/task-request/TaskRequestList';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const MyTaskRequestsPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Solo los solicitantes y administradores pueden ver sus solicitudes
  if (!currentUser?.roles.includes('ROLE_SOLICITANTE') && !currentUser?.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <TaskRequestList listType="my-requests" title="Mis Solicitudes" />;
};

export default MyTaskRequestsPage;
