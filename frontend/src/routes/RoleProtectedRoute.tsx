import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/core/store';
import { UserRole } from '@/core/types/models';

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
}

/**
 * Componente que protege rutas basado en roles de usuario.
 * Permite acceso solo a usuarios con roles específicos.
 * El rol ADMIN siempre tiene acceso a todas las rutas.
 */
const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
  redirectTo = '/app'
}) => {
  const { user } = useAppSelector((state) => state.auth);

  // No se necesita depuración detallada en producción

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // El rol ADMIN siempre tiene acceso a todas las rutas
  if (user.role === UserRole.ADMIN) {
    return <Outlet />;
  }

  // Verificar si el rol del usuario está en la lista de roles permitidos
  if (allowedRoles.includes(user.role)) {
    return <Outlet />;
  }

  // Si el usuario no tiene permiso, redirigir a la ruta especificada
  return <Navigate to={redirectTo} replace />;
};

export default RoleProtectedRoute;
