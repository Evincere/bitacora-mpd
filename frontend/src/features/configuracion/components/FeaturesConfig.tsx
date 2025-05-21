import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiToggleRight, 
  FiSave, 
  FiInfo,
  FiMessageSquare,
  FiPaperclip,
  FiBell,
  FiClock,
  FiUserCheck,
  FiRefreshCw
} from 'react-icons/fi';
import { useGeneralConfig, useUpdateFeaturesConfig } from '../hooks/useGeneralConfig';

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

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.primary + '20'};
  color: ${({ theme }) => theme.primary};
  margin-right: 12px;
`;

const FeatureInfo = styled.div`
  flex: 1;
`;

const FeatureName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 4px;
`;

const FeatureDescription = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  margin-left: 12px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${({ theme }) => theme.primary};
  }

  &:checked + span:before {
    transform: translateX(24px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.border};
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
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

// Definición de características disponibles
const availableFeatures = [
  {
    id: 'taskComments',
    name: 'Comentarios en tareas',
    description: 'Permite a los usuarios añadir comentarios a las tareas',
    icon: <FiMessageSquare size={20} />
  },
  {
    id: 'fileAttachments',
    name: 'Adjuntos de archivos',
    description: 'Permite adjuntar archivos a las tareas',
    icon: <FiPaperclip size={20} />
  },
  {
    id: 'realTimeNotifications',
    name: 'Notificaciones en tiempo real',
    description: 'Habilita las notificaciones push en tiempo real',
    icon: <FiBell size={20} />
  },
  {
    id: 'taskHistory',
    name: 'Historial de tareas',
    description: 'Registra y muestra el historial de cambios en las tareas',
    icon: <FiClock size={20} />
  },
  {
    id: 'userAudit',
    name: 'Auditoría de usuarios',
    description: 'Registra las acciones de los usuarios para auditoría',
    icon: <FiUserCheck size={20} />
  }
];

const FeaturesConfig: React.FC = () => {
  const { data: generalConfig, isLoading } = useGeneralConfig();
  const updateFeaturesConfig = useUpdateFeaturesConfig();
  
  const [features, setFeatures] = useState<Record<string, boolean>>({
    taskComments: true,
    fileAttachments: true,
    realTimeNotifications: true,
    taskHistory: true,
    userAudit: true
  });

  // Actualizar el estado local cuando se cargan los datos
  useEffect(() => {
    if (generalConfig && generalConfig.features) {
      setFeatures(generalConfig.features);
    }
  }, [generalConfig]);

  const handleToggleFeature = (featureId: string) => {
    setFeatures({
      ...features,
      [featureId]: !features[featureId]
    });
  };

  const handleSaveConfig = async () => {
    try {
      await updateFeaturesConfig.mutateAsync(features);
    } catch (error) {
      console.error('Error al guardar la configuración de características:', error);
    }
  };

  if (isLoading) {
    return <Container>Cargando configuración de características...</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiToggleRight size={18} />
          Características del Sistema
        </Title>
        <ActionButtons>
          <Button $primary onClick={handleSaveConfig} disabled={updateFeaturesConfig.isPending}>
            {updateFeaturesConfig.isPending ? (
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
          Active o desactive características específicas del sistema. Los cambios se aplicarán inmediatamente después de guardar.
        </div>
      </InfoBox>

      <FeaturesGrid>
        {availableFeatures.map(feature => (
          <FeatureItem key={feature.id}>
            <FeatureIcon>
              {feature.icon}
            </FeatureIcon>
            <FeatureInfo>
              <FeatureName>{feature.name}</FeatureName>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureInfo>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={features[feature.id] || false}
                onChange={() => handleToggleFeature(feature.id)}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </FeatureItem>
        ))}
      </FeaturesGrid>
    </Container>
  );
};

export default FeaturesConfig;
