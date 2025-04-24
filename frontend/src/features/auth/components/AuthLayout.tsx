import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppSelector } from '@/core/store';

const AuthContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background};
`;

const AuthContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const AuthLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  // Efecto para depuración
  useEffect(() => {
    console.log('AuthLayout renderizado en ruta:', location.pathname);
    console.log('Estado de autenticación en AuthLayout:', isAuthenticated);

    // Si el usuario está autenticado y está en la ruta raíz o /login, redirigir a /app
    if (isAuthenticated && (location.pathname === '/' || location.pathname === '/login')) {
      console.log('Usuario autenticado en AuthLayout, redirigiendo a /app');
      navigate('/app', { replace: true });
    }
  }, [location.pathname, isAuthenticated, navigate]);

  return (
    <AuthContainer>
      <AuthContent>
        <Outlet />
      </AuthContent>
    </AuthContainer>
  );
};

export default AuthLayout;
