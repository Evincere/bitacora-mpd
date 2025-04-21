import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiZap, FiToggleLeft, FiToggleRight, FiSettings, FiInfo } from 'react-icons/fi';
import { useWebSocket, CompressionConfig } from '../../../services/websocketService';

interface CompressionStatsProps {
  showSettings?: boolean;
}

/**
 * Componente que muestra estadísticas de compresión de mensajes WebSocket.
 */
const CompressionStats: React.FC<CompressionStatsProps> = ({
  showSettings = false
}) => {
  const webSocket = useWebSocket();
  const [stats, setStats] = useState<any>({ totalCompressed: 0, totalSaved: 0, averageRatio: 0, enabled: true });
  const [expanded, setExpanded] = useState(showSettings);
  const [config, setConfig] = useState<CompressionConfig>({
    enabled: true,
    threshold: 1024,
    level: 6
  });
  
  // Actualizar estadísticas periódicamente
  useEffect(() => {
    const updateStats = () => {
      const currentStats = webSocket.getCompressionStats();
      setStats(currentStats);
    };
    
    // Actualizar inmediatamente
    updateStats();
    
    // Actualizar cada 5 segundos
    const interval = setInterval(updateStats, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [webSocket]);
  
  // Manejar cambios en la configuración
  const handleToggleEnabled = () => {
    const newConfig = { ...config, enabled: !config.enabled };
    setConfig(newConfig);
    webSocket.setCompressionConfig(newConfig);
  };
  
  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      const newConfig = { ...config, threshold: value };
      setConfig(newConfig);
      webSocket.setCompressionConfig(newConfig);
    }
  };
  
  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 9) {
      const newConfig = { ...config, level: value };
      setConfig(newConfig);
      webSocket.setCompressionConfig(newConfig);
    }
  };
  
  // Formatear bytes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Si no hay compresión y no se muestran ajustes, no mostrar nada
  if (stats.totalCompressed === 0 && !showSettings) {
    return null;
  }
  
  return (
    <Container>
      <Header onClick={() => setExpanded(!expanded)}>
        <IconContainer $enabled={stats.enabled}>
          <FiZap size={16} />
        </IconContainer>
        <Title>
          Compresión de mensajes
          {stats.enabled ? 
            <StatusBadge $enabled={true}>Activa</StatusBadge> : 
            <StatusBadge $enabled={false}>Inactiva</StatusBadge>
          }
        </Title>
        <ToggleButton onClick={(e) => { e.stopPropagation(); handleToggleEnabled(); }}>
          {stats.enabled ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
        </ToggleButton>
      </Header>
      
      {expanded && (
        <Content>
          {stats.totalCompressed > 0 ? (
            <>
              <StatRow>
                <StatLabel>Mensajes comprimidos:</StatLabel>
                <StatValue>{stats.totalCompressed}</StatValue>
              </StatRow>
              
              <StatRow>
                <StatLabel>Datos ahorrados:</StatLabel>
                <StatValue>{formatBytes(stats.totalSaved)}</StatValue>
              </StatRow>
              
              <StatRow>
                <StatLabel>Ratio promedio:</StatLabel>
                <StatValue>{Math.round(stats.averageRatio * 100)}%</StatValue>
              </StatRow>
            </>
          ) : (
            <EmptyState>
              <FiInfo size={16} />
              <span>No hay estadísticas de compresión disponibles</span>
            </EmptyState>
          )}
          
          {showSettings && (
            <>
              <Divider />
              
              <SettingsTitle>
                <FiSettings size={14} />
                <span>Configuración</span>
              </SettingsTitle>
              
              <SettingRow>
                <SettingLabel>Umbral de compresión:</SettingLabel>
                <SettingInput
                  type="number"
                  min="0"
                  step="512"
                  value={config.threshold}
                  onChange={handleThresholdChange}
                  disabled={!config.enabled}
                />
                <SettingUnit>bytes</SettingUnit>
              </SettingRow>
              
              <SettingRow>
                <SettingLabel>Nivel de compresión:</SettingLabel>
                <RangeInput
                  type="range"
                  min="1"
                  max="9"
                  value={config.level}
                  onChange={handleLevelChange}
                  disabled={!config.enabled}
                />
                <SettingValue>{config.level}</SettingValue>
              </SettingRow>
              
              <SettingInfo>
                Nivel 1: más rápido, menos compresión<br />
                Nivel 9: más lento, máxima compresión
              </SettingInfo>
            </>
          )}
        </Content>
      )}
    </Container>
  );
};

// Estilos
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 16px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const IconContainer = styled.div<{ $enabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 12px;
  background-color: ${({ $enabled, theme }) => $enabled ? theme.successLight : theme.backgroundAlt};
  color: ${({ $enabled, theme }) => $enabled ? theme.success : theme.textSecondary};
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  display: flex;
  align-items: center;
`;

const StatusBadge = styled.span<{ $enabled: boolean }>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  margin-left: 8px;
  background-color: ${({ $enabled, theme }) => $enabled ? theme.successLight : theme.backgroundAlt};
  color: ${({ $enabled, theme }) => $enabled ? theme.success : theme.textSecondary};
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
  
  &:hover {
    color: ${({ theme }) => theme.primaryDark};
  }
`;

const Content = styled.div`
  padding: 0 16px 16px;
  font-size: 13px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.textSecondary};
`;

const StatValue = styled.div`
  font-weight: 500;
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.border};
  margin: 12px 0;
`;

const SettingsTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const SettingLabel = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.textSecondary};
`;

const SettingInput = styled.input`
  width: 80px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SettingUnit = styled.div`
  margin-left: 8px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 12px;
`;

const RangeInput = styled.input`
  flex: 1;
  margin: 0 8px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SettingValue = styled.div`
  width: 20px;
  text-align: center;
  font-weight: 500;
`;

const SettingInfo = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.textTertiary};
  margin-top: 8px;
  line-height: 1.4;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  color: ${({ theme }) => theme.textSecondary};
  font-style: italic;
`;

export default CompressionStats;
