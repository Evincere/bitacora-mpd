import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiCode, FiX, FiEye, FiEyeOff, FiRefreshCw, FiInfo, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { isDebugMode, setDebugMode } from '@/core/utils/debug';
import useActivityTemplates from '../hooks/useActivityTemplates';

interface DebugPanelProps {
  onClose: () => void;
}

const DebugContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
`;

const DebugHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
`;

const DebugTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const DebugContent = styled.div`
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
`;

const DebugSection = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DebugItem = styled.div`
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const ItemTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ItemStatus = styled.div<{ status: 'success' | 'warning' | 'error' | 'info' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;

  ${({ status, theme }) => {
    switch (status) {
      case 'success':
        return `color: ${theme.success};`;
      case 'warning':
        return `color: ${theme.warning};`;
      case 'error':
        return `color: ${theme.error};`;
      case 'info':
      default:
        return `color: ${theme.info || theme.primary};`;
    }
  }}
`;

const ItemDetails = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 11px;
`;

const DebugActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const DebugButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(DebugButton)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const SecondaryButton = styled(DebugButton)`
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const DebugPanel: React.FC<DebugPanelProps> = ({ onClose }) => {
  const [isDebugEnabled, setIsDebugEnabled] = useState(isDebugMode());
  const [refreshKey, setRefreshKey] = useState(0);
  const { templates, isLoading } = useActivityTemplates();

  // Forzar actualización
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Cambiar modo de depuración
  const handleToggleDebug = () => {
    setDebugMode(!isDebugEnabled);
    setIsDebugEnabled(!isDebugEnabled);
  };

  return (
    <DebugContainer>
      <DebugHeader>
        <DebugTitle>
          <FiCode size={16} />
          Panel de Depuración
        </DebugTitle>
        <CloseButton onClick={onClose}>
          <FiX size={16} />
        </CloseButton>
      </DebugHeader>

      <DebugContent>
        <DebugSection>
          <SectionTitle>
            <FiInfo size={14} />
            Estado de Depuración
          </SectionTitle>
          <DebugItem>
            <ItemHeader>
              <ItemTitle>Modo de Depuración</ItemTitle>
              <ItemStatus status={isDebugEnabled ? 'success' : 'info'}>
                {isDebugEnabled ? (
                  <>
                    <FiCheck size={12} />
                    Habilitado
                  </>
                ) : (
                  <>
                    <FiEyeOff size={12} />
                    Deshabilitado
                  </>
                )}
              </ItemStatus>
            </ItemHeader>
            <ItemDetails>
              {isDebugEnabled
                ? 'Los mensajes de depuración se muestran en la consola del navegador.'
                : 'Habilita el modo de depuración para ver mensajes en la consola.'}
            </ItemDetails>
          </DebugItem>
        </DebugSection>

        <DebugSection>
          <SectionTitle>
            <FiInfo size={14} />
            Plantillas de Actividades
          </SectionTitle>

          {isLoading ? (
            <DebugItem>
              <ItemHeader>
                <ItemTitle>Cargando plantillas...</ItemTitle>
              </ItemHeader>
            </DebugItem>
          ) : templates.length === 0 ? (
            <DebugItem>
              <ItemHeader>
                <ItemTitle>No hay plantillas</ItemTitle>
                <ItemStatus status="warning">
                  <FiAlertTriangle size={12} />
                  Advertencia
                </ItemStatus>
              </ItemHeader>
              <ItemDetails>
                No se encontraron plantillas. Esto podría indicar un problema con el almacenamiento local.
              </ItemDetails>
            </DebugItem>
          ) : (
            templates.map(template => (
              <DebugItem key={template.id}>
                <ItemHeader>
                  <ItemTitle>{template.name}</ItemTitle>
                  <ItemStatus status="success">
                    <FiCheck size={12} />
                    Disponible
                  </ItemStatus>
                </ItemHeader>
                <ItemDetails>
                  ID: {template.id}<br />
                  Descripción: {template.description}<br />
                  Actualizado: {new Date(template.updatedAt).toLocaleString()}
                </ItemDetails>
              </DebugItem>
            ))
          )}
        </DebugSection>

        <DebugActions>
          <PrimaryButton onClick={handleToggleDebug}>
            {isDebugEnabled ? (
              <>
                <FiEyeOff size={14} />
                Deshabilitar Depuración
              </>
            ) : (
              <>
                <FiEye size={14} />
                Habilitar Depuración
              </>
            )}
          </PrimaryButton>

          <SecondaryButton onClick={handleRefresh}>
            <FiRefreshCw size={14} />
            Actualizar
          </SecondaryButton>
        </DebugActions>
      </DebugContent>
    </DebugContainer>
  );
};

export default DebugPanel;
