import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiZap, 
  FiSave, 
  FiRefreshCw, 
  FiInfo,
  FiClock,
  FiDatabase,
  FiDownload,
  FiMaximize2
} from 'react-icons/fi';
import { useGeneralConfig, useUpdatePerformanceConfig, useClearCache } from '../hooks/useGeneralConfig';
import { PerformanceConfig as PerformanceConfigType } from '../services/generalConfigService';

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

const Select = styled.select`
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

const PerformanceConfig: React.FC = () => {
  const { data: generalConfig, isLoading } = useGeneralConfig();
  const updatePerformanceConfig = useUpdatePerformanceConfig();
  const clearCache = useClearCache();
  
  const [config, setConfig] = useState<PerformanceConfigType>({
    cacheEnabled: true,
    cacheTTL: 3600,
    prefetchEnabled: true,
    compressionEnabled: true,
    maxConcurrentRequests: 6,
    requestTimeout: 30000
  });

  // Actualizar el estado local cuando se cargan los datos
  useEffect(() => {
    if (generalConfig) {
      setConfig(generalConfig.performance);
    }
  }, [generalConfig]);

  const handleSaveConfig = async () => {
    try {
      await updatePerformanceConfig.mutateAsync(config);
    } catch (error) {
      console.error('Error al guardar la configuración de rendimiento:', error);
    }
  };

  const handleClearCache = async () => {
    try {
      await clearCache.mutateAsync();
    } catch (error) {
      console.error('Error al limpiar la caché:', error);
    }
  };

  if (isLoading) {
    return <Container>Cargando configuración de rendimiento...</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiZap size={18} />
          Configuración de Rendimiento
        </Title>
        <ActionButtons>
          <Button onClick={handleClearCache} disabled={clearCache.isPending}>
            {clearCache.isPending ? (
              <>
                <LoadingSpinner size={16} />
                Limpiando...
              </>
            ) : (
              <>
                <FiRefreshCw size={16} />
                Limpiar caché
              </>
            )}
          </Button>
          <Button $primary onClick={handleSaveConfig} disabled={updatePerformanceConfig.isPending}>
            {updatePerformanceConfig.isPending ? (
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
          La configuración de rendimiento afecta a la velocidad y eficiencia del sistema. 
          Los cambios se aplicarán inmediatamente después de guardar.
        </div>
      </InfoBox>

      <FormGrid>
        <div>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="cacheEnabled"
              checked={config.cacheEnabled}
              onChange={(e) => setConfig({
                ...config,
                cacheEnabled: e.target.checked
              })}
            />
            <CheckboxLabel htmlFor="cacheEnabled">
              Habilitar caché
            </CheckboxLabel>
          </CheckboxContainer>

          <FormGroup>
            <Label htmlFor="cacheTTL">
              <FiClock size={14} />
              Tiempo de vida de la caché (segundos)
            </Label>
            <Input
              type="number"
              id="cacheTTL"
              value={config.cacheTTL}
              onChange={(e) => setConfig({
                ...config,
                cacheTTL: parseInt(e.target.value)
              })}
              disabled={!config.cacheEnabled}
            />
          </FormGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="prefetchEnabled"
              checked={config.prefetchEnabled}
              onChange={(e) => setConfig({
                ...config,
                prefetchEnabled: e.target.checked
              })}
            />
            <CheckboxLabel htmlFor="prefetchEnabled">
              Habilitar precarga de datos
            </CheckboxLabel>
          </CheckboxContainer>
        </div>

        <div>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="compressionEnabled"
              checked={config.compressionEnabled}
              onChange={(e) => setConfig({
                ...config,
                compressionEnabled: e.target.checked
              })}
            />
            <CheckboxLabel htmlFor="compressionEnabled">
              Habilitar compresión
            </CheckboxLabel>
          </CheckboxContainer>

          <FormGroup>
            <Label htmlFor="maxConcurrentRequests">
              <FiMaximize2 size={14} />
              Máximo de solicitudes concurrentes
            </Label>
            <Input
              type="number"
              id="maxConcurrentRequests"
              value={config.maxConcurrentRequests}
              onChange={(e) => setConfig({
                ...config,
                maxConcurrentRequests: parseInt(e.target.value)
              })}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="requestTimeout">
              <FiDatabase size={14} />
              Tiempo de espera para solicitudes (ms)
            </Label>
            <Input
              type="number"
              id="requestTimeout"
              value={config.requestTimeout}
              onChange={(e) => setConfig({
                ...config,
                requestTimeout: parseInt(e.target.value)
              })}
            />
          </FormGroup>
        </div>
      </FormGrid>
    </Container>
  );
};

export default PerformanceConfig;
