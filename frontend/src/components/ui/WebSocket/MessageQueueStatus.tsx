import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiInbox, FiAlertTriangle, FiRefreshCw, FiTrash2, FiClock, FiInfo } from 'react-icons/fi';
import { useWebSocket, QueuedMessage } from '../../../services/websocketService';

interface MessageQueueStatusProps {
  showDetails?: boolean;
  onClearQueue?: () => void;
}

/**
 * Componente que muestra el estado de la cola de mensajes WebSocket.
 */
const MessageQueueStatus: React.FC<MessageQueueStatusProps> = ({
  showDetails = false,
  onClearQueue
}) => {
  const webSocket = useWebSocket();
  const [queueStatus, setQueueStatus] = useState<{ size: number, messages: QueuedMessage[] }>({ size: 0, messages: [] });
  const [isConnected, setIsConnected] = useState(webSocket.isConnected());
  const [expanded, setExpanded] = useState(showDetails);

  // Actualizar el estado de la cola
  useEffect(() => {
    // Obtener el estado inicial
    setQueueStatus(webSocket.getQueueStatus());
    
    // Suscribirse a actualizaciones de la cola
    const unsubscribeQueue = webSocket.subscribeToQueueUpdates((data) => {
      setQueueStatus(webSocket.getQueueStatus());
    });
    
    // Suscribirse al estado de la conexión
    const unsubscribeConnection = webSocket.subscribeToConnectionStatus((status) => {
      setIsConnected(status.connected);
      
      // Actualizar el estado de la cola cuando cambia la conexión
      setQueueStatus(webSocket.getQueueStatus());
    });
    
    return () => {
      unsubscribeQueue();
      unsubscribeConnection();
    };
  }, [webSocket]);
  
  // Manejar la limpieza de la cola
  const handleClearQueue = () => {
    if (onClearQueue) {
      onClearQueue();
    } else {
      webSocket.clearQueue();
      setQueueStatus(webSocket.getQueueStatus());
    }
  };
  
  // Si no hay mensajes en cola y no se muestra el detalle, no mostrar nada
  if (queueStatus.size === 0 && !showDetails) {
    return null;
  }
  
  return (
    <Container>
      <Header onClick={() => setExpanded(!expanded)}>
        <IconContainer $hasMessages={queueStatus.size > 0} $isConnected={isConnected}>
          {queueStatus.size > 0 ? <FiInbox size={16} /> : <FiInfo size={16} />}
        </IconContainer>
        <Title>
          Cola de mensajes
          {queueStatus.size > 0 && <Count>{queueStatus.size}</Count>}
        </Title>
        <Actions>
          {queueStatus.size > 0 && (
            <ActionButton onClick={(e) => { e.stopPropagation(); handleClearQueue(); }} title="Limpiar cola">
              <FiTrash2 size={14} />
            </ActionButton>
          )}
          <ActionButton 
            onClick={(e) => { e.stopPropagation(); webSocket.reconnect(); }} 
            title="Reconectar WebSocket"
            disabled={isConnected}
          >
            <FiRefreshCw size={14} />
          </ActionButton>
        </Actions>
      </Header>
      
      {expanded && (
        <Content>
          <StatusRow>
            <StatusLabel>Estado:</StatusLabel>
            <StatusValue $isConnected={isConnected}>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </StatusValue>
          </StatusRow>
          
          <StatusRow>
            <StatusLabel>Mensajes en cola:</StatusLabel>
            <StatusValue>{queueStatus.size}</StatusValue>
          </StatusRow>
          
          {queueStatus.size > 0 && (
            <>
              <Divider />
              
              <MessageList>
                {queueStatus.messages.slice(0, 5).map((message) => (
                  <MessageItem key={message.id}>
                    <MessageIcon $priority={message.priority}>
                      {message.sent ? <FiClock size={14} /> : <FiAlertTriangle size={14} />}
                    </MessageIcon>
                    <MessageContent>
                      <MessageEvent>{message.event}</MessageEvent>
                      <MessageMeta>
                        {message.sent ? 'Enviado' : `Intentos: ${message.retries}/${message.maxRetries}`}
                        {' • '}
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </MessageMeta>
                    </MessageContent>
                  </MessageItem>
                ))}
                
                {queueStatus.size > 5 && (
                  <MoreMessages>
                    {queueStatus.size - 5} mensajes más...
                  </MoreMessages>
                )}
              </MessageList>
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

const IconContainer = styled.div<{ $hasMessages: boolean, $isConnected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 12px;
  background-color: ${({ $hasMessages, $isConnected, theme }) => {
    if (!$isConnected) return theme.errorLight;
    return $hasMessages ? theme.warningLight : theme.infoLight;
  }};
  color: ${({ $hasMessages, $isConnected, theme }) => {
    if (!$isConnected) return theme.error;
    return $hasMessages ? theme.warning : theme.info;
  }};
  
  ${({ $hasMessages, $isConnected }) => $hasMessages && !$isConnected && `
    animation: pulse 1.5s infinite;
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
      }
      70% {
        box-shadow: 0 0 0 6px rgba(255, 0, 0, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
      }
    }
  `}
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  display: flex;
  align-items: center;
`;

const Count = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.warning};
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  margin-left: 8px;
  min-width: 18px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  color: ${({ theme }) => theme.textSecondary};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    background-color: ${({ theme, disabled }) => disabled ? 'transparent' : theme.backgroundHover};
    color: ${({ theme, disabled }) => disabled ? theme.textSecondary : theme.text};
  }
`;

const Content = styled.div`
  padding: 0 16px 16px;
  font-size: 13px;
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StatusLabel = styled.div`
  color: ${({ theme }) => theme.textSecondary};
`;

const StatusValue = styled.div<{ $isConnected?: boolean }>`
  font-weight: 500;
  color: ${({ $isConnected, theme }) => {
    if ($isConnected === undefined) return theme.text;
    return $isConnected ? theme.success : theme.error;
  }};
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.border};
  margin: 12px 0;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MessageItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.backgroundAlt};
`;

const MessageIcon = styled.div<{ $priority: string }>`
  color: ${({ $priority, theme }) => {
    switch ($priority) {
      case 'high':
        return theme.error;
      case 'medium':
        return theme.warning;
      case 'low':
        return theme.info;
      default:
        return theme.textSecondary;
    }
  }};
`;

const MessageContent = styled.div`
  flex: 1;
`;

const MessageEvent = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const MessageMeta = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.textSecondary};
`;

const MoreMessages = styled.div`
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  padding: 8px;
`;

export default MessageQueueStatus;
