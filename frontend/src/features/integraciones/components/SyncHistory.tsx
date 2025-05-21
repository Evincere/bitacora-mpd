import React from 'react';
import styled from 'styled-components';
import { 
  FiClock, 
  FiCheck, 
  FiX, 
  FiAlertCircle,
  FiUpload,
  FiDownload,
  FiTrash2
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSyncHistory } from '../hooks/useIntegrations';

// Estilos
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
`;

const HistoryItem = styled.div<{ $success: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 6px;
  background-color: ${({ theme, $success }) => 
    $success ? theme.success + '10' : theme.error + '10'};
  border-left: 3px solid ${({ theme, $success }) => 
    $success ? theme.success : theme.error};
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Status = styled.div<{ $success: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme, $success }) => 
    $success ? theme.success : theme.error};
`;

const Message = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const Stats = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  background-color: ${({ theme }) => theme.backgroundAlt};
  padding: 4px 8px;
  border-radius: 4px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.textTertiary};
`;

interface SyncHistoryProps {
  integrationId: string;
}

const SyncHistory: React.FC<SyncHistoryProps> = ({ integrationId }) => {
  const { data: history, isLoading, isError } = useSyncHistory(integrationId);

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  if (isLoading) {
    return <Container>Cargando historial de sincronización...</Container>;
  }

  if (isError) {
    return (
      <Container>
        <EmptyState>
          <EmptyStateIcon>
            <FiAlertCircle />
          </EmptyStateIcon>
          <div>Error al cargar el historial de sincronización</div>
        </EmptyState>
      </Container>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Container>
        <EmptyState>
          <EmptyStateIcon>
            <FiClock />
          </EmptyStateIcon>
          <div>No hay historial de sincronización disponible</div>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiClock size={16} />
          Historial de sincronización
        </Title>
      </Header>

      <HistoryList>
        {history.map((item) => (
          <HistoryItem key={item.id} $success={item.success}>
            <ItemHeader>
              <Timestamp>
                <FiClock size={12} />
                {formatDate(item.timestamp)}
              </Timestamp>
              <Status $success={item.success}>
                {item.success ? (
                  <>
                    <FiCheck size={12} />
                    Exitosa
                  </>
                ) : (
                  <>
                    <FiX size={12} />
                    Fallida
                  </>
                )}
              </Status>
            </ItemHeader>
            <Message>{item.message}</Message>
            {item.stats && (
              <Stats>
                {item.stats.uploaded !== undefined && (
                  <StatItem>
                    <FiUpload size={12} />
                    {item.stats.uploaded} subidos
                  </StatItem>
                )}
                {item.stats.downloaded !== undefined && (
                  <StatItem>
                    <FiDownload size={12} />
                    {item.stats.downloaded} descargados
                  </StatItem>
                )}
                {item.stats.deleted !== undefined && (
                  <StatItem>
                    <FiTrash2 size={12} />
                    {item.stats.deleted} eliminados
                  </StatItem>
                )}
                {item.stats.created !== undefined && (
                  <StatItem>
                    <FiCheck size={12} />
                    {item.stats.created} creados
                  </StatItem>
                )}
                {item.stats.updated !== undefined && (
                  <StatItem>
                    <FiCheck size={12} />
                    {item.stats.updated} actualizados
                  </StatItem>
                )}
              </Stats>
            )}
          </HistoryItem>
        ))}
      </HistoryList>
    </Container>
  );
};

export default SyncHistory;
