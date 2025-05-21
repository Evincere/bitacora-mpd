import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RoleBasedLayout from '@/shared/components/layout/RoleBasedLayout';
import RoleProtectedRoute from './RoleProtectedRoute';
import { UserRole } from '@/core/types/models';
import TaskRequestRoutes from './TaskRequestRoutes';

// Componentes para SOLICITANTE
import DashboardSolicitante from '@/features/solicitudes/pages/DashboardSolicitante';
import SolicitudForm from '@/features/solicitudes/pages/SolicitudForm';
import MisSolicitudes from '@/features/solicitudes/pages/MisSolicitudes';
import SeguimientoSolicitud from '@/features/solicitudes/pages/SeguimientoSolicitud';
import SeguimientoGeneral from '@/features/solicitudes/pages/SeguimientoGeneral';

// Componentes para ASIGNADOR
import DashboardAsignador from '@/features/asignacion/pages/DashboardAsignador';
import AsignarTarea from '@/features/asignacion/pages/AsignarTarea';
import BandejaEntrada from '@/features/asignacion/pages/BandejaEntrada';
import DistribucionCarga from '@/features/asignacion/pages/DistribucionCarga';
import MetricasAsignacion from '@/features/asignacion/pages/MetricasAsignacion';

// Componentes para EJECUTOR
import DashboardEjecutor from '@/features/tareas/pages/DashboardEjecutor';
import ActualizarProgreso from '@/features/tareas/pages/ActualizarProgreso';
import MisTareas from '@/features/tareas/pages/MisTareas';
import ProgresoTareas from '@/features/tareas/pages/ProgresoTareas';
import HistorialTareas from '@/features/tareas/pages/HistorialTareas';

// Componentes de configuración
import ConfiguracionTareas from '@/features/configuracion/pages/ConfiguracionTareas';
import ConfiguracionNotificaciones from '@/features/notificaciones/pages/ConfiguracionNotificaciones';
import ConfiguracionIntegraciones from '@/features/integraciones/pages/ConfiguracionIntegraciones';
import DashboardReportes from '@/features/reportes/pages/DashboardReportes';

// Componentes comunes
import Dashboard from '@/features/dashboard/pages/Dashboard';
import ActivityList from '@/features/activities/pages/ActivityList';
import ActivityCalendar from '@/features/activities/pages/ActivityCalendar';
import Profile from '@/features/profile/pages/Profile';
import NotFound from '@/shared/components/ui/NotFound';

const RoleBasedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RoleBasedLayout />}>
        <Route index element={<Navigate to="/app" replace />} />
        <Route path="app" element={<Dashboard />} />

        {/* Rutas para SOLICITANTE */}
        <Route element={<RoleProtectedRoute allowedRoles={[UserRole.SOLICITANTE, UserRole.ADMIN]} />}>
          <Route path="app/solicitudes/dashboard" element={<DashboardSolicitante />} />
          <Route path="app/solicitudes/nueva" element={<SolicitudForm />} />
          <Route path="app/solicitudes" element={<MisSolicitudes />} />
          <Route path="app/solicitudes/seguimiento" element={<SeguimientoGeneral />} />
          <Route path="app/solicitudes/seguimiento/:id" element={<SeguimientoSolicitud />} />
        </Route>

        {/* Rutas para ASIGNADOR */}
        <Route element={<RoleProtectedRoute allowedRoles={[UserRole.ASIGNADOR, UserRole.ADMIN]} />}>
          <Route path="app/asignacion/dashboard" element={<DashboardAsignador />} />
          <Route path="app/asignacion/asignar/:id" element={<AsignarTarea />} />
          <Route path="app/asignacion/bandeja" element={<BandejaEntrada />} />
          <Route path="app/asignacion/distribucion" element={<DistribucionCarga />} />
          <Route path="app/asignacion/metricas" element={<MetricasAsignacion />} />
        </Route>

        {/* Rutas para EJECUTOR */}
        <Route element={<RoleProtectedRoute allowedRoles={[UserRole.EJECUTOR, UserRole.ADMIN]} />}>
          <Route path="app/tareas/dashboard" element={<DashboardEjecutor />} />
          <Route path="app/tareas/progreso/:id" element={<ActualizarProgreso />} />
          <Route path="app/tareas/asignadas" element={<MisTareas />} />
          <Route path="app/tareas/progreso" element={<ProgresoTareas />} />
          <Route path="app/tareas/historial" element={<HistorialTareas />} />
        </Route>

        {/* Rutas de configuración */}
        <Route element={<RoleProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.ASIGNADOR]} />}>
          <Route path="app/configuracion/tareas" element={<ConfiguracionTareas />} />
          <Route path="app/configuracion/notificaciones" element={<ConfiguracionNotificaciones />} />
          <Route path="app/configuracion/integraciones" element={<ConfiguracionIntegraciones />} />
        </Route>

        {/* Rutas de reportes */}
        <Route element={<RoleProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.ASIGNADOR]} />}>
          <Route path="app/reportes" element={<DashboardReportes />} />
        </Route>

        {/* Rutas de solicitudes de tareas */}
        <TaskRequestRoutes />

        {/* Rutas comunes */}
        <Route path="app/activities" element={<ActivityList />} />
        <Route path="app/activities/calendar" element={<ActivityCalendar />} />
        <Route path="app/profile" element={<Profile />} />

        {/* Ruta para páginas no encontradas */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default RoleBasedRoutes;
