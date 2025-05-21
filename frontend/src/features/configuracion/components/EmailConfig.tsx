import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiMail, 
  FiSave, 
  FiInfo,
  FiSend,
  FiServer,
  FiLock,
  FiUser,
  FiAtSign,
  FiRefreshCw,
  FiFileText
} from 'react-icons/fi';
import { useGeneralConfig, useUpdateEmailConfig, useTestEmailConfig } from '../hooks/useGeneralConfig';
import { EmailConfig as EmailConfigType } from '../services/generalConfigService';

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

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.cardBackground};
  color: ${({ theme, $primary }) => 
    $primary ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.border};

  &:hover {
    background-color: ${({ theme, $primary }) => 
      $primary ? theme.primaryDark : theme.hoverBackground};
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: border-color 0.2s;
  min-height: 100px;
  resize: vertical;

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

const TestEmailContainer = styled.div`
  margin-top: 20px;
  padding: 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
`;

const TestEmailHeader = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TestEmailForm = styled.div`
  display: flex;
  gap: 8px;
`;

const TestEmailInput = styled.input`
  flex: 1;
  padding: 10px 12px;
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

const EmailConfig: React.FC = () => {
  const { data: generalConfig, isLoading } = useGeneralConfig();
  const updateEmailConfig = useUpdateEmailConfig();
  const testEmail = useTestEmailConfig();
  
  const [config, setConfig] = useState<EmailConfigType>({
    smtpServer: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpSecure: true,
    defaultSender: '',
    defaultReplyTo: '',
    emailSignature: '',
    emailTemplatesEnabled: true
  });

  const [testEmailAddress, setTestEmailAddress] = useState('');

  // Actualizar el estado local cuando se cargan los datos
  useEffect(() => {
    if (generalConfig) {
      setConfig(generalConfig.email);
    }
  }, [generalConfig]);

  const handleSaveConfig = async () => {
    try {
      await updateEmailConfig.mutateAsync(config);
    } catch (error) {
      console.error('Error al guardar la configuración de correo electrónico:', error);
    }
  };

  const handleTestEmail = async () => {
    if (testEmailAddress) {
      try {
        await testEmail.mutateAsync(testEmailAddress);
      } catch (error) {
        console.error('Error al enviar correo de prueba:', error);
      }
    }
  };

  if (isLoading) {
    return <Container>Cargando configuración de correo electrónico...</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiMail size={18} />
          Configuración de Correo Electrónico
        </Title>
        <ActionButtons>
          <Button $primary onClick={handleSaveConfig} disabled={updateEmailConfig.isPending}>
            {updateEmailConfig.isPending ? (
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
          Configure los ajustes del servidor SMTP para el envío de correos electrónicos.
          Puede probar la configuración enviando un correo de prueba.
        </div>
      </InfoBox>

      <FormGrid>
        <div>
          <FormGroup>
            <Label htmlFor="smtpServer">
              <FiServer size={14} />
              Servidor SMTP
            </Label>
            <Input
              type="text"
              id="smtpServer"
              value={config.smtpServer}
              onChange={(e) => setConfig({
                ...config,
                smtpServer: e.target.value
              })}
              placeholder="smtp.example.com"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="smtpPort">
              <FiServer size={14} />
              Puerto SMTP
            </Label>
            <Input
              type="number"
              id="smtpPort"
              value={config.smtpPort}
              onChange={(e) => setConfig({
                ...config,
                smtpPort: parseInt(e.target.value)
              })}
            />
          </FormGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="smtpSecure"
              checked={config.smtpSecure}
              onChange={(e) => setConfig({
                ...config,
                smtpSecure: e.target.checked
              })}
            />
            <CheckboxLabel htmlFor="smtpSecure">
              <FiLock size={14} style={{ marginRight: '4px' }} />
              Usar conexión segura (SSL/TLS)
            </CheckboxLabel>
          </CheckboxContainer>

          <FormGroup>
            <Label htmlFor="smtpUsername">
              <FiUser size={14} />
              Usuario SMTP
            </Label>
            <Input
              type="text"
              id="smtpUsername"
              value={config.smtpUsername}
              onChange={(e) => setConfig({
                ...config,
                smtpUsername: e.target.value
              })}
              placeholder="usuario@example.com"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="smtpPassword">
              <FiLock size={14} />
              Contraseña SMTP
            </Label>
            <Input
              type="password"
              id="smtpPassword"
              value={config.smtpPassword}
              onChange={(e) => setConfig({
                ...config,
                smtpPassword: e.target.value
              })}
              placeholder="••••••••"
            />
          </FormGroup>
        </div>

        <div>
          <FormGroup>
            <Label htmlFor="defaultSender">
              <FiAtSign size={14} />
              Remitente predeterminado
            </Label>
            <Input
              type="email"
              id="defaultSender"
              value={config.defaultSender}
              onChange={(e) => setConfig({
                ...config,
                defaultSender: e.target.value
              })}
              placeholder="noreply@example.com"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="defaultReplyTo">
              <FiAtSign size={14} />
              Responder a
            </Label>
            <Input
              type="email"
              id="defaultReplyTo"
              value={config.defaultReplyTo}
              onChange={(e) => setConfig({
                ...config,
                defaultReplyTo: e.target.value
              })}
              placeholder="support@example.com"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="emailSignature">
              <FiFileText size={14} />
              Firma de correo electrónico
            </Label>
            <TextArea
              id="emailSignature"
              value={config.emailSignature}
              onChange={(e) => setConfig({
                ...config,
                emailSignature: e.target.value
              })}
              placeholder="Equipo de Soporte\nwww.example.com"
            />
          </FormGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="emailTemplatesEnabled"
              checked={config.emailTemplatesEnabled}
              onChange={(e) => setConfig({
                ...config,
                emailTemplatesEnabled: e.target.checked
              })}
            />
            <CheckboxLabel htmlFor="emailTemplatesEnabled">
              Habilitar plantillas de correo electrónico
            </CheckboxLabel>
          </CheckboxContainer>
        </div>
      </FormGrid>

      <TestEmailContainer>
        <TestEmailHeader>
          <FiSend size={16} />
          Enviar correo de prueba
        </TestEmailHeader>
        <TestEmailForm>
          <TestEmailInput
            type="email"
            placeholder="Ingrese un correo electrónico para la prueba"
            value={testEmailAddress}
            onChange={(e) => setTestEmailAddress(e.target.value)}
          />
          <Button onClick={handleTestEmail} disabled={testEmail.isPending || !testEmailAddress}>
            {testEmail.isPending ? (
              <>
                <LoadingSpinner size={16} />
                Enviando...
              </>
            ) : (
              <>
                <FiSend size={16} />
                Enviar prueba
              </>
            )}
          </Button>
        </TestEmailForm>
      </TestEmailContainer>
    </Container>
  );
};

export default EmailConfig;
