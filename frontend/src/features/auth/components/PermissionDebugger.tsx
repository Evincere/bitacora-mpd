import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tokenService from '@/core/utils/tokenService';
import permissionChecker from '@/utils/permissionChecker';
import { Button } from '@/components/ui';

const DebuggerContainer = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 16px;
  margin: 16px 0;
  max-width: 800px;
`;

const Title = styled.h3`
  margin-top: 0;
  color: #343a40;
`;

const TokenInfo = styled.div`
  margin-bottom: 16px;
`;

const PermissionsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const PermissionItem = styled.li<{ $hasPermission: boolean }>`
  padding: 8px;
  margin-bottom: 4px;
  background-color: ${props => props.$hasPermission ? '#d4edda' : '#f8d7da'};
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonContainer = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 8px;
`;

const commonPermissions = [
  'READ_USERS',
  'WRITE_USERS',
  'DELETE_USERS',
  'READ_ACTIVITIES',
  'WRITE_ACTIVITIES',
  'DELETE_ACTIVITIES',
  'GENERATE_REPORTS',
  'REQUEST_ACTIVITIES',
  'ASSIGN_ACTIVITIES',
  'EXECUTE_ACTIVITIES'
];

const PermissionDebugger: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Obtener token y permisos al montar el componente
    const currentToken = tokenService.getToken();
    setToken(currentToken);
    
    if (currentToken) {
      setPermissions(permissionChecker.getUserPermissions());
    }
  }, []);

  const handleRefresh = () => {
    const currentToken = tokenService.getToken();
    setToken(currentToken);
    
    if (currentToken) {
      setPermissions(permissionChecker.getUserPermissions());
    }
  };

  const handleLogPermissions = () => {
    permissionChecker.logUserPermissions();
  };

  if (!token) {
    return (
      <DebuggerContainer>
        <Title>Depurador de Permisos</Title>
        <p>No hay token de autenticación disponible.</p>
        <Button onClick={handleRefresh}>Actualizar</Button>
      </DebuggerContainer>
    );
  }

  return (
    <DebuggerContainer>
      <Title>Depurador de Permisos</Title>
      
      <TokenInfo>
        <p><strong>Token:</strong> {token.substring(0, 20)}...</p>
        <p><strong>Expiración:</strong> {tokenService.isTokenExpired(token) ? 'Expirado' : 'Válido'}</p>
      </TokenInfo>
      
      <div>
        <h4>Permisos Comunes:</h4>
        <PermissionsList>
          {commonPermissions.map(perm => (
            <PermissionItem key={perm} $hasPermission={permissions.includes(perm)}>
              <span>{perm}</span>
              <span>{permissions.includes(perm) ? '✅' : '❌'}</span>
            </PermissionItem>
          ))}
        </PermissionsList>
      </div>
      
      {expanded && (
        <div>
          <h4>Todos los Permisos:</h4>
          <PermissionsList>
            {permissions.map(perm => (
              <PermissionItem key={perm} $hasPermission={true}>
                <span>{perm}</span>
                <span>✅</span>
              </PermissionItem>
            ))}
          </PermissionsList>
        </div>
      )}
      
      <ButtonContainer>
        <Button onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Ocultar Detalles' : 'Mostrar Todos los Permisos'}
        </Button>
        <Button onClick={handleRefresh}>Actualizar</Button>
        <Button onClick={handleLogPermissions}>Registrar en Consola</Button>
      </ButtonContainer>
    </DebuggerContainer>
  );
};

export default PermissionDebugger;
