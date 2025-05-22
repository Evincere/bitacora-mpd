import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '@/core/store';
import { FiArrowLeft, FiRefreshCw, FiShield, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import PermissionDebugger from '@/features/auth/components/PermissionDebugger';
import permissionChecker from '@/utils/permissionChecker';
import tokenDebugger from '@/utils/tokenDebugger';
import ApiTester from '@/components/debug/ApiTester';
import ApiConfigTester from '@/components/debug/ApiConfigTester';
import MultiEndpointTester from '@/components/debug/MultiEndpointTester';
import AuthTester from '@/components/debug/AuthTester';

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.primary.main};
  cursor: pointer;
  font-size: 14px;
  padding: 8px;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};
  }
`;

const DebugContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.border.main};
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const DebugSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PermissionsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const PermissionItem = styled.li`
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.colors.background.hover};
  display: flex;
  align-items: center;
  gap: 8px;

  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.background.alternate};
  }
`;

const UserInfo = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 8px;
  margin-bottom: 16px;
`;

const Label = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Value = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TokenSection = styled.div`
  margin-top: 16px;
`;

const TokenDisplay = styled.pre`
  background-color: ${({ theme }) => theme.colors.background.code};
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
  max-height: 200px;
  overflow-y: auto;
`;

const ActionButton = styled(Button)`
  margin-top: 16px;
`;

/**
 * Página para depurar permisos del usuario actual
 */
const PermissionsDebugPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    // Obtener tokens del localStorage
    const storedToken = localStorage.getItem('bitacora_token');
    const storedRefreshToken = localStorage.getItem('bitacora_refresh_token');

    setToken(storedToken);
    setRefreshToken(storedRefreshToken);

    // Verificar permisos
    if (storedToken) {
      console.log('Depurando token en PermissionsDebugPage:');
      tokenDebugger.debugToken(storedToken);
      permissionChecker.logUserPermissions();
    }
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleAddExecutePermission = () => {
    if (user) {
      // Crear una copia del usuario con el permiso EXECUTE_ACTIVITIES
      const updatedUser = {
        ...user,
        permissions: [...(user.permissions || []), 'EXECUTE_ACTIVITIES']
      };

      // Actualizar en localStorage
      localStorage.setItem('bitacora_user', JSON.stringify(updatedUser));

      // Recargar la página
      window.location.reload();
    }
  };

  if (!user) {
    return (
      <PageContainer>
        <PageHeader>
          <BackButton onClick={() => navigate(-1)}>
            <FiArrowLeft size={16} />
            Volver
          </BackButton>
          <PageTitle>Depurador de Permisos</PageTitle>
          <div></div>
        </PageHeader>

        <DebugContainer>
          <h3>Usuario no autenticado</h3>
          <p>Debe iniciar sesión para ver esta información.</p>
        </DebugContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate(-1)}>
          <FiArrowLeft size={16} />
          Volver
        </BackButton>
        <PageTitle>Depurador de Permisos</PageTitle>
        <Button onClick={handleRefresh}>
          <FiRefreshCw size={16} />
          Actualizar
        </Button>
      </PageHeader>

      <DebugContainer>
        <DebugSection>
          <SectionTitle>
            <FiUser size={20} />
            Información de Usuario
          </SectionTitle>

          <UserInfo>
            <Label>ID:</Label>
            <Value>{user.id}</Value>

            <Label>Username:</Label>
            <Value>{user.username}</Value>

            <Label>Nombre:</Label>
            <Value>{user.firstName} {user.lastName}</Value>

            <Label>Email:</Label>
            <Value>{user.email}</Value>

            <Label>Rol:</Label>
            <Value>{user.role}</Value>
          </UserInfo>
        </DebugSection>

        <DebugSection>
          <SectionTitle>
            <FiShield size={20} />
            Permisos ({user.permissions?.length || 0})
          </SectionTitle>

          <PermissionsList>
            {user.permissions?.length > 0 ? (
              user.permissions.map((permission, index) => (
                <PermissionItem key={index}>
                  <FiShield size={16} />
                  {permission}
                </PermissionItem>
              ))
            ) : (
              <PermissionItem>
                <FiShield size={16} />
                No tiene permisos asignados
              </PermissionItem>
            )}
          </PermissionsList>

          {!user.permissions?.includes('EXECUTE_ACTIVITIES') && (
            <ActionButton onClick={handleAddExecutePermission}>
              Añadir permiso EXECUTE_ACTIVITIES
            </ActionButton>
          )}
        </DebugSection>

        <DebugSection>
          <SectionTitle>
            <FiShield size={20} />
            Depurador de Permisos Avanzado
          </SectionTitle>
          <PermissionDebugger />
          <ActionButton onClick={() => permissionChecker.logUserPermissions()}>
            Verificar Permisos en Consola
          </ActionButton>
        </DebugSection>

        <DebugSection>
          <SectionTitle>
            <FiShield size={20} />
            Probador de API
          </SectionTitle>
          <p>Usa esta herramienta para probar diferentes endpoints de la API y verificar si el problema es específico de la ruta /api/users.</p>
          <ApiTester />
        </DebugSection>

        <DebugSection>
          <SectionTitle>
            <FiShield size={20} />
            Probador de Configuraciones de API
          </SectionTitle>
          <p>Esta herramienta prueba diferentes configuraciones de autenticación para un endpoint para identificar cuál funciona.</p>
          <ApiConfigTester />
        </DebugSection>

        <DebugSection>
          <SectionTitle>
            <FiShield size={20} />
            Probador de Múltiples Endpoints
          </SectionTitle>
          <p>Esta herramienta prueba múltiples endpoints de la API y analiza los resultados para identificar patrones.</p>
          <MultiEndpointTester />
        </DebugSection>

        <DebugSection>
          <SectionTitle>
            <FiShield size={20} />
            Probador de Autenticación
          </SectionTitle>
          <p>Esta herramienta prueba diferentes endpoints de autenticación para verificar el funcionamiento del token.</p>
          <AuthTester />
        </DebugSection>

        <TokenSection>
          <SectionTitle>Token JWT</SectionTitle>
          <TokenDisplay>
            {token ? token : 'No hay token almacenado'}
          </TokenDisplay>

          <SectionTitle>Refresh Token</SectionTitle>
          <TokenDisplay>
            {refreshToken ? refreshToken : 'No hay refresh token almacenado'}
          </TokenDisplay>
        </TokenSection>
      </DebugContainer>
    </PageContainer>
  );
};

export default PermissionsDebugPage;
