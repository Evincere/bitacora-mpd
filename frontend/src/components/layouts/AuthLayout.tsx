import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background};
`;

/**
 * Layout para páginas de autenticación
 */
const AuthLayout: React.FC = () => {
  return (
    <AuthContainer>
      <Outlet />
    </AuthContainer>
  );
};

export default AuthLayout;
