import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiShield, 
  FiSave, 
  FiInfo,
  FiClock,
  FiLock,
  FiKey,
  FiRefreshCw,
  FiPlus,
  FiTrash2
} from 'react-icons/fi';
import { useGeneralConfig, useUpdateSecurityConfig } from '../hooks/useGeneralConfig';
import { SecurityConfig as SecurityConfigType } from '../services/generalConfigService';

// Estilos
const Container = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary, $danger }) => 
    $primary ? theme.primary : 
    $danger ? theme.danger + '20' : 
    theme.cardBackground};
  color: ${({ theme, $primary, $danger }) => 
    $primary ? '#fff' : 
    $danger ? theme.danger : 
    theme.text};
  border: 1px solid ${({ theme, $primary, $danger }) => 
    $primary ? theme.primary : 
    $danger ? theme.danger : 
    theme.border};

  &:hover {
    background-color: ${({ theme, $primary, $danger }) => 
      $primary ? theme.primaryDark : 
      $danger ? theme.danger + '30' : 
      theme.hoverBackground};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;

const InfoBox = styled.div`
  background-color: ${({ theme }) => `${theme.info}10`};
  border-left: 3px solid ${({ theme }) => theme.info};
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};

  .icon {
    color: ${({ theme }) => theme.info};
    margin-top: 2px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 20px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const IPListContainer = styled.div`
  margin-top: 16px;
`;

const IPItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const IPInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const LoadingSpinner = styled(FiRefreshCw)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const SecurityConfig: React.FC = () => {
  const { data: generalConfig, isLoading } = useGeneralConfig();
  const updateSecurityConfig = useUpdateSecurityConfig();
  
  const [config, setConfig] = useState<SecurityConfigType>({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expirationDays: 90
    },
    twoFactorAuthEnabled: false,
    ipWhitelist: []
  });

  const [newIP, setNewIP] = useState('');

  // Actualizar el estado local cuando se cargan los datos
  useEffect(() => {
    if (generalConfig) {
      setConfig(generalConfig.security);
    }
  }, [generalConfig]);

  const handleSaveConfig = async () => {
    try {
      await updateSecurityConfig.mutateAsync(config);
    } catch (error) {
      console.error('Error al guardar la configuración de seguridad:', error);
    }
  };

  const handleAddIP = () => {
    if (newIP && !config.ipWhitelist.includes(newIP)) {
      setConfig({
        ...config,
        ipWhitelist: [...config.ipWhitelist, newIP]
      });
      setNewIP('');
    }
  };

  const handleRemoveIP = (ip: string) => {
    setConfig({
      ...config,
      ipWhitelist: config.ipWhitelist.filter(item => item !== ip)
    });
  };

  if (isLoading) {
    return <Container>Cargando configuración de seguridad...</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiShield size={18} />
          Configuración de Seguridad
        </Title>
        <ActionButtons>
          <Button $primary onClick={handleSaveConfig} disabled={updateSecurityConfig.isPending}>
            {updateSecurityConfig.isPending ? (
              <>
                <LoadingSpinner size={16} />
                Guardando...
              </>
            ) : (
              <>
                <FiSave size={16} />
                Guardar cambios
              </>
            )}
          </Button>
        </ActionButtons>
      </Header>

      <InfoBox>
        <div className="icon">
          <FiInfo size={16} />
        </div>
        <div>
          La configuración de seguridad afecta a la protección del sistema y las políticas de acceso.
          Algunos cambios pueden requerir que los usuarios vuelvan a iniciar sesión.
        </div>
      </InfoBox>

      <FormGrid>
        <div>
          <FormGroup>
            <Label htmlFor="sessionTimeout">
              <FiClock size={14} />
              Tiempo de inactividad para cierre de sesión (minutos)
            </Label>
            <Input
              type="number"
              id="sessionTimeout"
              value={config.sessionTimeout}
              onChange={(e) => setConfig({
                ...config,
                sessionTimeout: parseInt(e.target.value)
              })}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="maxLoginAttempts">
              <FiLock size={14} />
              Máximo de intentos de inicio de sesión
            </Label>
            <Input
              type="number"
              id="maxLoginAttempts"
              value={config.maxLoginAttempts}
              onChange={(e) => setConfig({
                ...config,
                maxLoginAttempts: parseInt(e.target.value)
              })}
            />
          </FormGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="twoFactorAuthEnabled"
              checked={config.twoFactorAuthEnabled}
              onChange={(e) => setConfig({
                ...config,
                twoFactorAuthEnabled: e.target.checked
              })}
            />
            <CheckboxLabel htmlFor="twoFactorAuthEnabled">
              Habilitar autenticación de dos factores
            </CheckboxLabel>
          </CheckboxContainer>
        </div>

        <div>
          <SectionTitle>Política de contraseñas</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="minLength">
              <FiKey size={14} />
              Longitud mínima de contraseña
            </Label>
            <Input
              type="number"
              id="minLength"
              value={config.passwordPolicy.minLength}
              onChange={(e) => setConfig({
                ...config,
                passwordPolicy: {
                  ...config.passwordPolicy,
                  minLength: parseInt(e.target.value)
                }
              })}
            />
          </FormGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="requireUppercase"
              checked={config.passwordPolicy.requireUppercase}
              onChange={(e) => setConfig({
                ...config,
                passwordPolicy: {
                  ...config.passwordPolicy,
                  requireUppercase: e.target.checked
                }
              })}
            />
            <CheckboxLabel htmlFor="requireUppercase">
              Requerir mayúsculas
            </CheckboxLabel>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="requireLowercase"
              checked={config.passwordPolicy.requireLowercase}
              onChange={(e) => setConfig({
                ...config,
                passwordPolicy: {
                  ...config.passwordPolicy,
                  requireLowercase: e.target.checked
                }
              })}
            />
            <CheckboxLabel htmlFor="requireLowercase">
              Requerir minúsculas
            </CheckboxLabel>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="requireNumbers"
              checked={config.passwordPolicy.requireNumbers}
              onChange={(e) => setConfig({
                ...config,
                passwordPolicy: {
                  ...config.passwordPolicy,
                  requireNumbers: e.target.checked
                }
              })}
            />
            <CheckboxLabel htmlFor="requireNumbers">
              Requerir números
            </CheckboxLabel>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="requireSpecialChars"
              checked={config.passwordPolicy.requireSpecialChars}
              onChange={(e) => setConfig({
                ...config,
                passwordPolicy: {
                  ...config.passwordPolicy,
                  requireSpecialChars: e.target.checked
                }
              })}
            />
            <CheckboxLabel htmlFor="requireSpecialChars">
              Requerir caracteres especiales
            </CheckboxLabel>
          </CheckboxContainer>

          <FormGroup>
            <Label htmlFor="expirationDays">
              <FiClock size={14} />
              Días para expiración de contraseña (0 = nunca)
            </Label>
            <Input
              type="number"
              id="expirationDays"
              value={config.passwordPolicy.expirationDays}
              onChange={(e) => setConfig({
                ...config,
                passwordPolicy: {
                  ...config.passwordPolicy,
                  expirationDays: parseInt(e.target.value)
                }
              })}
            />
          </FormGroup>
        </div>
      </FormGrid>

      <SectionTitle>Lista blanca de IPs</SectionTitle>
      <div>Si la lista está vacía, se permitirá el acceso desde cualquier IP.</div>
      
      <IPListContainer>
        {config.ipWhitelist.map((ip, index) => (
          <IPItem key={index}>
            <IPInput
              type="text"
              value={ip}
              readOnly
            />
            <Button $danger onClick={() => handleRemoveIP(ip)}>
              <FiTrash2 size={16} />
            </Button>
          </IPItem>
        ))}
        
        <IPItem>
          <IPInput
            type="text"
            placeholder="Añadir nueva IP (ej. 192.168.1.1)"
            value={newIP}
            onChange={(e) => setNewIP(e.target.value)}
          />
          <Button onClick={handleAddIP}>
            <FiPlus size={16} />
          </Button>
        </IPItem>
      </IPListContainer>
    </Container>
  );
};

export default SecurityConfig;
