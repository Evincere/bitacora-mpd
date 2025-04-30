import React from 'react';
import TaskRequestList from '../../components/task-request/TaskRequestList';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AllTaskRequestsPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Solo los administradores pueden ver todas las solicitudes
  if (!currentUser?.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <TaskRequestList listType="all" title="Todas las Solicitudes" />;
};

export default AllTaskRequestsPage;
