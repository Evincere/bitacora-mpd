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

  // Depuración detallada
  console.log('RoleProtectedRoute: Usuario actual:', user);
  console.log('RoleProtectedRoute: Rol del usuario:', user?.role);
  console.log('RoleProtectedRoute: Tipo de rol:', typeof user?.role);
  console.log('RoleProtectedRoute: Roles permitidos:', allowedRoles);
  console.log('RoleProtectedRoute: ¿Es ADMIN?', user?.role === UserRole.ADMIN);
  console.log('RoleProtectedRoute: Comparación de roles:');
  allowedRoles.forEach(role => {
    console.log(`- ¿${role} === ${user?.role}?`, role === user?.role);
  });

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    console.log('RoleProtectedRoute: No hay usuario autenticado, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  // El rol ADMIN siempre tiene acceso a todas las rutas
  if (user.role === UserRole.ADMIN) {
    console.log('RoleProtectedRoute: Usuario es ADMIN, permitiendo acceso');
    return <Outlet />;
  }

  // Verificar si el rol del usuario está en la lista de roles permitidos
  if (allowedRoles.includes(user.role)) {
    console.log('RoleProtectedRoute: Usuario tiene rol permitido, permitiendo acceso');
    return <Outlet />;
  }

  // Si el usuario no tiene permiso, redirigir a la ruta especificada
  console.log('RoleProtectedRoute: Usuario NO tiene rol permitido, redirigiendo a', redirectTo);
  return <Navigate to={redirectTo} replace />;
};

export default RoleProtectedRoute;
