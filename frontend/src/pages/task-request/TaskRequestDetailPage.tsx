import React from 'react';
import TaskRequestDetail from '../../components/task-request/TaskRequestDetail';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const TaskRequestDetailPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Cualquier usuario autenticado puede ver los detalles de una solicitud
  // (los permisos específicos se manejan en el componente)
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return <TaskRequestDetail />;
};

export default TaskRequestDetailPage;
