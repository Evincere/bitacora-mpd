import React from 'react';
import { useAppSelector } from '@/core/store';
import styled from 'styled-components';

const DebugContainer = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 12px;
  z-index: 9999;
  max-width: 400px;
  overflow: auto;
  max-height: 300px;
`;

const DebugTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: #ff9800;
`;

const DebugItem = styled.div`
  margin-bottom: 3px;
`;

const DebugValue = styled.span<{ $highlight?: boolean }>`
  color: ${({ $highlight }) => ($highlight ? '#4caf50' : '#03a9f4')};
  font-weight: ${({ $highlight }) => ($highlight ? 'bold' : 'normal')};
`;

/**
 * Componente para depurar información del usuario y roles
 */
const UserRoleDebug: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <DebugContainer>
      <DebugTitle>Información de Usuario (Debug)</DebugTitle>
      <DebugItem>
        Usuario: <DebugValue>{user.username}</DebugValue>
      </DebugItem>
      <DebugItem>
        Rol: <DebugValue $highlight>{user.role}</DebugValue>
      </DebugItem>
      <DebugItem>
        Rol (localStorage): <DebugValue $highlight>{JSON.parse(localStorage.getItem('bitacora_user') || '{}').role}</DebugValue>
      </DebugItem>
      <DebugItem>
        Rol (tipo): <DebugValue $highlight>{typeof user.role}</DebugValue>
      </DebugItem>
      <DebugItem>
        Permisos: <DebugValue $highlight>{user.permissions?.join(', ') || 'Ninguno'}</DebugValue>
      </DebugItem>
      <DebugItem>
        Permisos (localStorage): <DebugValue $highlight>{JSON.stringify(JSON.parse(localStorage.getItem('bitacora_user') || '{}').permissions || [])}</DebugValue>
      </DebugItem>
      <DebugItem>
        ID: <DebugValue>{user.id}</DebugValue>
      </DebugItem>
      <DebugItem>
        Permisos: <DebugValue>{user.permissions?.join(', ') || 'Ninguno'}</DebugValue>
      </DebugItem>
    </DebugContainer>
  );
};

export default UserRoleDebug;
