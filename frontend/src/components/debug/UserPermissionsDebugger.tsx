import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import tokenService from '@/core/utils/tokenService';
import { getUser } from '@/core/utils/auth';
import apiClient from '@/core/api/apiClient';

const Container = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const Section = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const SectionTitle = styled.h3`
  margin-bottom: 10px;
  color: #333;
`;

const InfoItem = styled.div`
  margin-bottom: 5px;
  display: flex;
  flex-wrap: wrap;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 10px;
  min-width: 150px;
`;

const Value = styled.span`
  flex: 1;
  word-break: break-all;
`;

const PermissionsList = styled.ul`
  margin-top: 10px;
  padding-left: 20px;
`;

const PermissionItem = styled.li`
  margin-bottom: 5px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #3a80d2;
  }
`;

const ErrorMessage = styled.div`
  color: #e53935;
  margin-top: 10px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
`;

const UserPermissionsDebugger: React.FC = () => {
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [authMeResponse, setAuthMeResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = tokenService.getToken();
    if (token) {
      try {
        const decoded = tokenService.decodeToken(token);
        setDecodedToken(decoded);
      } catch (err) {
        console.error('Error al decodificar token:', err);
        setError('Error al decodificar token');
      }
    }

    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  const fetchAuthMe = async () => {
    setLoading(true);
    setError(null);

    try {
      // Usar la ruta correcta: /api/users/me en lugar de /api/auth/me
      console.log('Obteniendo información del usuario desde /api/users/me');
      const response = await apiClient.get('users/me');
      console.log('Respuesta de /api/users/me:', response);
      setAuthMeResponse(response);
    } catch (err: any) {
      console.error('Error al obtener información del usuario:', err);
      setError(err.message || 'Error al obtener información del usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Depurador de Permisos de Usuario</Title>

      <Button onClick={fetchAuthMe} disabled={loading}>
        {loading ? 'Cargando...' : 'Obtener información del usuario (/users/me)'}
      </Button>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Section>
        <SectionTitle>Información del Usuario (auth.getUser)</SectionTitle>
        {user ? (
          <>
            <InfoItem>
              <Label>Username:</Label>
              <Value>{user.username}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Rol:</Label>
              <Value>{user.role}</Value>
            </InfoItem>
            <InfoItem>
              <Label>ID:</Label>
              <Value>{user.id}</Value>
            </InfoItem>
          </>
        ) : (
          <InfoItem>No hay información de usuario disponible</InfoItem>
        )}
      </Section>

      <Section>
        <SectionTitle>Token Decodificado</SectionTitle>
        {decodedToken ? (
          <>
            <InfoItem>
              <Label>Subject (sub):</Label>
              <Value>{decodedToken.sub}</Value>
            </InfoItem>
            <InfoItem>
              <Label>ID:</Label>
              <Value>{decodedToken.id}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Rol:</Label>
              <Value>{decodedToken.role}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Expiración (exp):</Label>
              <Value>
                {new Date(decodedToken.exp * 1000).toLocaleString()}
                ({Math.floor((decodedToken.exp * 1000 - Date.now()) / 1000 / 60)} minutos restantes)
              </Value>
            </InfoItem>
            <InfoItem>
              <Label>Permisos:</Label>
              <Value>
                {decodedToken.authorities ? (
                  <PermissionsList>
                    {decodedToken.authorities.map((auth: string) => (
                      <PermissionItem key={auth}>{auth}</PermissionItem>
                    ))}
                  </PermissionsList>
                ) : (
                  'No hay permisos definidos'
                )}
              </Value>
            </InfoItem>
          </>
        ) : (
          <InfoItem>No hay token disponible o no se pudo decodificar</InfoItem>
        )}
      </Section>

      {authMeResponse && (
        <Section>
          <SectionTitle>Respuesta de /users/me</SectionTitle>
          <pre>{JSON.stringify(authMeResponse, null, 2)}</pre>
        </Section>
      )}
    </Container>
  );
};

export default UserPermissionsDebugger;
