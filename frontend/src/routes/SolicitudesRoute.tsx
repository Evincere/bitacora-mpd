import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Componente que envuelve las rutas de solicitudes y recarga los datos
 * cuando se navega a la página de solicitudes.
 */
const SolicitudesRoute: React.FC = () => {
  const queryClient = useQueryClient();
  const location = useLocation();

  useEffect(() => {
    // Si estamos en la página principal de solicitudes, recargar los datos
    if (location.pathname === '/app/solicitudes') {
      console.log('SolicitudesRoute: Recargando datos de solicitudes...');
      queryClient.invalidateQueries({ queryKey: ['mySolicitudes'] });
    }
  }, [location.pathname, queryClient]);

  return <Outlet />;
};

export default SolicitudesRoute;
