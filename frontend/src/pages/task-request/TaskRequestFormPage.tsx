import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import TaskRequestForm from '../../components/task-request/TaskRequestForm';
import { useAuth } from '../../contexts/AuthContext';

const TaskRequestFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { currentUser } = useAuth();
  
  // Solo los solicitantes y administradores pueden crear solicitudes
  if (!currentUser?.roles.includes('ROLE_SOLICITANTE') && !currentUser?.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/unauthorized" />;
  }
  
  // Los permisos específicos para editar se manejan en el componente
  
  return <TaskRequestForm />;
};

export default TaskRequestFormPage;
