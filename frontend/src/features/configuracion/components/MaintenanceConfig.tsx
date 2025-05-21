import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiTool, 
  FiSave, 
  FiInfo,
  FiAlertTriangle,
  FiClock,
  FiMessageSquare,
  FiRefreshCw
} from 'react-icons/fi';
import { useGeneralConfig, useUpdateMaintenanceConfig } from '../hooks/useGeneralConfig';

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

const Button = styled.button<{ $primary?: boolean; $warning?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary, $warning }) => 
    $primary ? theme.primary : 
    $warning ? theme.warning + '20' : 
    theme.cardBackground};
  color: ${({ theme, $primary, $warning }) => 
    $primary ? '#fff' : 
    $warning ? theme.warning : 
    theme.text};
  border: 1px solid ${({ theme, $primary, $warning }) => 
    $primary ? theme.primary : 
    $warning ? theme.warning : 
    theme.border};

  &:hover {
    background-color: ${({ theme, $primary, $warning }) => 
      $primary ? theme.primaryDark : 
      $warning ? theme.warning + '30' : 
      theme.hoverBackground};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InfoBox = styled.div<{ $warning?: boolean }>`
  background-color: ${({ theme, $warning }) => 
    $warning ? `${theme.warning}10` : `${theme.info}10`};
  border-left: 3px solid ${({ theme, $warning }) => 
    $warning ? theme.warning : theme.info};
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};

  .icon {
    color: ${({ theme, $warning }) => 
      $warning ? theme.warning : theme.info};
    margin-top: 2px;
  }
`;

const PreviewContainer = styled.div`
  margin-top: 20px;
  padding: 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  border: 1px dashed ${({ theme }) => theme.border};
`;

const PreviewTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PreviewContent = styled.div`
  padding: 16px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const MaintenanceMessage = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
`;

const MaintenanceTime = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
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

const MaintenanceConfig: React.FC = () => {
  const { data: generalConfig, isLoading } = useGeneralConfig();
  const updateMaintenanceConfig = useUpdateMaintenanceConfig();
  
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('El sistema está en mantenimiento. Por favor, inténtelo más tarde.');
  const [plannedEndTime, setPlannedEndTime] = useState('');

  // Actualizar el estado local cuando se cargan los datos
  useEffect(() => {
    if (generalConfig && generalConfig.maintenance) {
      setMaintenanceEnabled(generalConfig.maintenance.enabled);
      setMaintenanceMessage(generalConfig.maintenance.message);
      
      if (generalConfig.maintenance.plannedEndTime) {
        // Convertir la fecha a formato local para el input datetime-local
        const date = new Date(generalConfig.maintenance.plannedEndTime);
        const localDatetime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        
        setPlannedEndTime(localDatetime);
      } else {
        setPlannedEndTime('');
      }
    }
  }, [generalConfig]);

  const handleSaveConfig = async () => {
    try {
      await updateMaintenanceConfig.mutateAsync({
        enabled: maintenanceEnabled,
        message: maintenanceMessage,
        plannedEndTime: plannedEndTime ? new Date(plannedEndTime).toISOString() : null
      });
    } catch (error) {
      console.error('Error al guardar la configuración de mantenimiento:', error);
    }
  };

  if (isLoading) {
    return <Container>Cargando configuración de mantenimiento...</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiTool size={18} />
          Modo de Mantenimiento
        </Title>
        <ActionButtons>
          <Button $primary onClick={handleSaveConfig} disabled={updateMaintenanceConfig.isPending}>
            {updateMaintenanceConfig.isPending ? (
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

      {maintenanceEnabled ? (
        <InfoBox $warning>
          <div className="icon">
            <FiAlertTriangle size={16} />
          </div>
          <div>
            <strong>¡Atención!</strong> El modo de mantenimiento está actualmente <strong>activado</strong>. 
            Los usuarios no podrán acceder al sistema mientras esté en este modo.
          </div>
        </InfoBox>
      ) : (
        <InfoBox>
          <div className="icon">
            <FiInfo size={16} />
          </div>
          <div>
            El modo de mantenimiento permite bloquear temporalmente el acceso al sistema mientras se realizan tareas de mantenimiento.
          </div>
        </InfoBox>
      )}

      <CheckboxContainer>
        <Checkbox
          type="checkbox"
          id="maintenanceEnabled"
          checked={maintenanceEnabled}
          onChange={(e) => setMaintenanceEnabled(e.target.checked)}
        />
        <CheckboxLabel htmlFor="maintenanceEnabled">
          <FiAlertTriangle size={14} />
          Activar modo de mantenimiento
        </CheckboxLabel>
      </CheckboxContainer>

      <FormGroup>
        <Label htmlFor="maintenanceMessage">
          <FiMessageSquare size={14} />
          Mensaje de mantenimiento
        </Label>
        <TextArea
          id="maintenanceMessage"
          value={maintenanceMessage}
          onChange={(e) => setMaintenanceMessage(e.target.value)}
          placeholder="El sistema está en mantenimiento. Por favor, inténtelo más tarde."
          disabled={!maintenanceEnabled}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="plannedEndTime">
          <FiClock size={14} />
          Hora planificada de finalización (opcional)
        </Label>
        <Input
          type="datetime-local"
          id="plannedEndTime"
          value={plannedEndTime}
          onChange={(e) => setPlannedEndTime(e.target.value)}
          disabled={!maintenanceEnabled}
        />
      </FormGroup>

      {maintenanceEnabled && (
        <PreviewContainer>
          <PreviewTitle>
            <FiInfo size={16} />
            Vista previa del mensaje de mantenimiento
          </PreviewTitle>
          <PreviewContent>
            <MaintenanceMessage>{maintenanceMessage}</MaintenanceMessage>
            {plannedEndTime && (
              <MaintenanceTime>
                Hora estimada de finalización: {new Date(plannedEndTime).toLocaleString()}
              </MaintenanceTime>
            )}
          </PreviewContent>
        </PreviewContainer>
      )}
    </Container>
  );
};

export default MaintenanceConfig;
