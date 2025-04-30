import React from 'react';
import TaskRequestCategoryList from '../../components/task-request/TaskRequestCategoryList';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const TaskRequestCategoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Cualquier usuario autenticado puede ver las categorías
  // (los permisos para editar se manejan en el componente)
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return <TaskRequestCategoryList />;
};

export default TaskRequestCategoryPage;
