import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import TaskRequestList from '../../components/task-request/TaskRequestList';
import { useAuth } from '../../contexts/AuthContext';
import { TaskRequestStatus } from '../../types/TaskRequest';

const TaskRequestsByStatusPage: React.FC = () => {
  const { status } = useParams<{ status: string }>();
  const { currentUser } = useAuth();
  
  // Solo los asignadores y administradores pueden ver las solicitudes por estado
  if (!currentUser?.roles.includes('ROLE_ASIGNADOR') && !currentUser?.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/unauthorized" />;
  }
  
  // Verificar que el estado sea válido
  const validStatuses = Object.values(TaskRequestStatus);
  if (!status || !validStatuses.includes(status as TaskRequestStatus)) {
    return <Navigate to="/not-found" />;
  }
  
  // Obtener el título según el estado
  let title = 'Solicitudes';
  switch (status) {
    case TaskRequestStatus.DRAFT:
      title = 'Solicitudes en Borrador';
      break;
    case TaskRequestStatus.SUBMITTED:
      title = 'Solicitudes Enviadas';
      break;
    case TaskRequestStatus.ASSIGNED:
      title = 'Solicitudes Asignadas';
      break;
    case TaskRequestStatus.COMPLETED:
      title = 'Solicitudes Completadas';
      break;
    case TaskRequestStatus.CANCELLED:
      title = 'Solicitudes Canceladas';
      break;
  }
  
  return <TaskRequestList listType="by-status" status={status} title={title} />;
};

export default TaskRequestsByStatusPage;
