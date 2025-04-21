import React, { useState } from 'react';
import styled from 'styled-components';
import { FiEye, FiEdit2, FiUsers, FiInfo } from 'react-icons/fi';
import { useCollaboration } from '../../../services/collaborationService';

interface PresenceIndicatorProps {
  activityId: number;
  showNames?: boolean;
  size?: 'small' | 'medium' | 'large';
  position?: 'top-right' | 'bottom-right' | 'inline';
  userNames?: { [key: number]: string };
}

/**
 * Componente que muestra indicadores visuales de presencia en la interfaz de actividades.
 */
const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  activityId,
  showNames = false,
  size = 'medium',
  position = 'top-right',
  userNames = {}
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const collaboration = useCollaboration();

  const viewers = collaboration.getViewers(activityId);
  const editor = collaboration.getEditor(activityId);
  const viewerCount = collaboration.getViewerCount(activityId);
  const isSomeoneElseEditing = collaboration.isSomeoneElseEditing(activityId);

  // Si no hay nadie viendo o editando, no mostrar nada
  if (viewerCount === 0 && !editor) {
    return null;
  }

  // Obtener nombres de usuarios o usar IDs si no están disponibles
  const getNameOrId = (userId: number) => userNames[userId] || `Usuario ${userId}`;

  // Generar texto para el tooltip
  const generateTooltipText = () => {
    const texts: string[] = [];

    if (editor) {
      texts.push(`${getNameOrId(editor)} está editando`);
    }

    const otherViewers = viewers.filter(id => id !== editor);
    if (otherViewers.length > 0) {
      if (otherViewers.length === 1) {
        texts.push(`${getNameOrId(otherViewers[0])} está viendo`);
      } else if (otherViewers.length <= 3) {
        texts.push(`${otherViewers.map(id => getNameOrId(id)).join(', ')} están viendo`);
      } else {
        texts.push(`${otherViewers.length} usuarios están viendo`);
      }
    }

    return texts.join('\n');
  };

  return (
    <Container $position={position} $size={size}>
      <IndicatorGroup
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        {editor && (
          <EditorIndicator $size={size} $isSomeoneElse={isSomeoneElseEditing}>
            <FiEdit2 />
          </EditorIndicator>
        )}

        {viewerCount > 0 && (
          <ViewerIndicator $size={size}>
            <FiEye />
            {viewerCount > 1 && <Count>{viewerCount}</Count>}
          </ViewerIndicator>
        )}

        {showTooltip && (
          <Tooltip $position={position}>
            <TooltipHeader>
              <FiUsers />
              <span>Colaboradores</span>
            </TooltipHeader>
            <TooltipContent>
              {editor && (
                <TooltipItem $isEditor>
                  <FiEdit2 />
                  <span>{getNameOrId(editor)}</span>
                  <Status>editando</Status>
                </TooltipItem>
              )}

              {viewers
                .filter(id => id !== editor)
                .map(viewerId => (
                  <TooltipItem key={viewerId}>
                    <FiEye />
                    <span>{getNameOrId(viewerId)}</span>
                    <Status>viendo</Status>
                  </TooltipItem>
                ))}
            </TooltipContent>
            <TooltipFooter>
              <FiInfo size={12} />
              <span>Actualizado en tiempo real</span>
            </TooltipFooter>
          </Tooltip>
        )}
      </IndicatorGroup>

      {showNames && editor && (
        <EditorName $isSomeoneElse={isSomeoneElseEditing}>
          {getNameOrId(editor)} está editando
        </EditorName>
      )}
    </Container>
  );
};

// Estilos
const Container = styled.div<{ $position: string; $size: string }>`
  position: ${({ $position }) => $position === 'inline' ? 'relative' : 'absolute'};
  ${({ $position }) => $position === 'top-right' && `
    top: 8px;
    right: 8px;
  `}
  ${({ $position }) => $position === 'bottom-right' && `
    bottom: 8px;
    right: 8px;
  `}
  display: flex;
  flex-direction: ${({ $position }) => $position === 'inline' ? 'row' : 'column'};
  align-items: center;
  gap: 4px;
  z-index: 5;
`;

const IndicatorGroup = styled.div`
  position: relative;
  display: flex;
  gap: 4px;
`;

const Indicator = styled.div<{ $size: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.backgroundAlt};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $size }) => $size === 'small' && `
    width: 24px;
    height: 24px;
    font-size: 12px;
  `}

  ${({ $size }) => $size === 'medium' && `
    width: 32px;
    height: 32px;
    font-size: 14px;
  `}

  ${({ $size }) => $size === 'large' && `
    width: 40px;
    height: 40px;
    font-size: 16px;
  `}

  &:hover {
    transform: scale(1.05);
  }
`;

const EditorIndicator = styled(Indicator)<{ $isSomeoneElse: boolean }>`
  background-color: ${({ $isSomeoneElse, theme }) =>
    $isSomeoneElse ? theme.warningLight : theme.primaryLight};
  color: ${({ $isSomeoneElse, theme }) =>
    $isSomeoneElse ? theme.warning : theme.primary};

  ${({ $isSomeoneElse }) => $isSomeoneElse && `
    animation: pulse 1.5s infinite;

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(255, 170, 0, 0.4);
      }
      70% {
        box-shadow: 0 0 0 6px rgba(255, 170, 0, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(255, 170, 0, 0);
      }
    }
  `}
`;

const ViewerIndicator = styled(Indicator)`
  background-color: ${({ theme }) => theme.infoLight};
  color: ${({ theme }) => theme.info};
  position: relative;
`;

const Count = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: ${({ theme }) => theme.info};
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const EditorName = styled.div<{ $isSomeoneElse: boolean }>`
  font-size: 12px;
  color: ${({ $isSomeoneElse, theme }) =>
    $isSomeoneElse ? theme.warning : theme.primary};
  font-weight: ${({ $isSomeoneElse }) => $isSomeoneElse ? 'bold' : 'normal'};
  white-space: nowrap;
`;

const Tooltip = styled.div<{ $position: string }>`
  position: absolute;
  ${({ $position }) => $position === 'top-right' && `
    top: 100%;
    right: 0;
    margin-top: 8px;
  `}
  ${({ $position }) => $position === 'bottom-right' && `
    bottom: 100%;
    right: 0;
    margin-bottom: 8px;
  `}
  ${({ $position }) => $position === 'inline' && `
    top: 100%;
    left: 0;
    margin-top: 8px;
  `}
  width: 220px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 10;
`;

const TooltipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-weight: 600;
  font-size: 13px;
`;

const TooltipContent = styled.div`
  padding: 8px 0;
  max-height: 200px;
  overflow-y: auto;
`;

const TooltipItem = styled.div<{ $isEditor?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 13px;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }

  ${({ $isEditor, theme }) => $isEditor && `
    background-color: ${theme.primaryLight}20;
    font-weight: 500;
  `}

  svg {
    color: ${({ $isEditor, theme }) =>
      $isEditor ? theme.primary : theme.info};
  }
`;

const Status = styled.span`
  margin-left: auto;
  font-size: 11px;
  color: ${({ theme }) => theme.textTertiary};
`;

const TooltipFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-top: 1px solid ${({ theme }) => theme.border};
  font-size: 11px;
  color: ${({ theme }) => theme.textTertiary};
`;

export default PresenceIndicator;
