import React from 'react';
import styled from 'styled-components';
import { FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { usePriorities } from '../hooks/usePriorities';

// Estilos
const Container = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-top: 20px;
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
`;

const PrioritiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PriorityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const ColorIndicator = styled.div<{ $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background-color: ${({ $color }) => $color};
  margin-right: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const PriorityInfo = styled.div`
  flex: 1;
`;

const PriorityName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const PriorityValue = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 2px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.textTertiary};
`;

const EmptyStateText = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const EmptyStateSubtext = styled.div`
  font-size: 14px;
  margin-bottom: 16px;
`;

const InfoMessage = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.info + '20'};
  color: ${({ theme }) => theme.info};
  border: 1px solid ${({ theme }) => theme.info + '40'};
  margin-bottom: 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PrioridadesList: React.FC = () => {
  const { data: priorities, isLoading, isError, refetch } = usePriorities();

  return (
    <Container>
      <Header>
        <Title>Prioridades de Tareas</Title>
        <ActionButtons>
          <Button onClick={() => refetch()}>
            <FiRefreshCw size={16} />
            Actualizar
          </Button>
        </ActionButtons>
      </Header>

      <InfoMessage>
        <FiAlertCircle size={16} />
        Las prioridades son predefinidas por el sistema y no pueden ser modificadas.
      </InfoMessage>

      {isLoading ? (
        <div>Cargando prioridades...</div>
      ) : isError ? (
        <div>Error al cargar prioridades</div>
      ) : priorities && priorities.length > 0 ? (
        <PrioritiesList>
          {priorities.map(priority => (
            <PriorityItem key={priority.name}>
              <ColorIndicator $color={priority.color} />
              <PriorityInfo>
                <PriorityName>{priority.displayName}</PriorityName>
                <PriorityValue>
                  {priority.name} {priority.value && `(Valor: ${priority.value})`}
                </PriorityValue>
              </PriorityInfo>
            </PriorityItem>
          ))}
        </PrioritiesList>
      ) : (
        <EmptyState>
          <EmptyStateIcon>
            <FiAlertCircle />
          </EmptyStateIcon>
          <EmptyStateText>No se encontraron prioridades</EmptyStateText>
          <EmptyStateSubtext>
            El sistema no tiene prioridades configuradas
          </EmptyStateSubtext>
        </EmptyState>
      )}
    </Container>
  );
};

export default PrioridadesList;
