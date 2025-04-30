import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import styled from 'styled-components';

const DebugContainer = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #00ff00;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 12px;
  z-index: 9999;
  max-width: 400px;
  max-height: 300px;
  overflow: auto;
`;

const PermissionsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const PermissionItem = styled.li`
  margin-bottom: 5px;
`;

const PermissionsDebugger: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return (
      <DebugContainer>
        <h3>Usuario no autenticado</h3>
      </DebugContainer>
    );
  }

  return (
    <DebugContainer>
      <h3>Información de Usuario</h3>
      <p>ID: {user.id}</p>
      <p>Username: {user.username}</p>
      <p>Rol: {user.role}</p>
      
      <h4>Permisos ({user.permissions?.length || 0}):</h4>
      <PermissionsList>
        {user.permissions?.length > 0 ? (
          user.permissions.map((permission, index) => (
            <PermissionItem key={index}>{permission}</PermissionItem>
          ))
        ) : (
          <PermissionItem>No tiene permisos asignados</PermissionItem>
        )}
      </PermissionsList>
    </DebugContainer>
  );
};

export default PermissionsDebugger;
