import React from 'react';
import { Route } from 'react-router-dom';
import RoleProtectedRoute from './RoleProtectedRoute';
import { UserRole } from '@/core/types/models';

// Páginas de solicitudes de tareas
import AllTaskRequestsPage from '@/pages/task-request/AllTaskRequestsPage';
import MyTaskRequestsPage from '@/pages/task-request/MyTaskRequestsPage';
import AssignedTaskRequestsPage from '@/pages/task-request/AssignedTaskRequestsPage';
import TaskRequestsByStatusPage from '@/pages/task-request/TaskRequestsByStatusPage';
import TaskRequestDetailPage from '@/pages/task-request/TaskRequestDetailPage';
import TaskRequestFormPage from '@/pages/task-request/TaskRequestFormPage';
import TaskRequestCategoryPage from '@/pages/task-request/TaskRequestCategoryPage';
import TaskRequestStatsPage from '@/pages/task-request/TaskRequestStatsPage';

/**
 * Rutas para la funcionalidad de solicitudes de tareas
 */
const TaskRequestRoutes: React.FC = () => {
  return (
    <>
      {/* Rutas para administradores */}
      <Route element={<RoleProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
        <Route path="app/task-requests/all" element={<AllTaskRequestsPage />} />
      </Route>

      {/* Rutas para solicitantes */}
      <Route element={<RoleProtectedRoute allowedRoles={[UserRole.SOLICITANTE, UserRole.ADMIN]} />}>
        <Route path="app/task-requests/my-requests" element={<MyTaskRequestsPage />} />
        <Route path="app/task-requests/new" element={<TaskRequestFormPage />} />
      </Route>

      {/* Rutas para asignadores */}
      <Route element={<RoleProtectedRoute allowedRoles={[UserRole.ASIGNADOR, UserRole.ADMIN]} />}>
        <Route path="app/task-requests/assigned" element={<AssignedTaskRequestsPage />} />
        <Route path="app/task-requests/by-status/:status" element={<TaskRequestsByStatusPage />} />
        <Route path="app/task-requests/stats" element={<TaskRequestStatsPage />} />
      </Route>

      {/* Rutas comunes para usuarios autenticados */}
      <Route element={<RoleProtectedRoute allowedRoles={[UserRole.SOLICITANTE, UserRole.ASIGNADOR, UserRole.EJECUTOR, UserRole.ADMIN]} />}>
        <Route path="app/task-requests/:id" element={<TaskRequestDetailPage />} />
        <Route path="app/task-requests/:id/edit" element={<TaskRequestFormPage />} />
        <Route path="app/task-requests/categories" element={<TaskRequestCategoryPage />} />
      </Route>
    </>
  );
};

export default TaskRequestRoutes;
