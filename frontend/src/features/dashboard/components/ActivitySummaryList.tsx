import React from 'react';
import styled from 'styled-components';
import { FiClock, FiMoreVertical, FiLoader, FiAlertCircle, FiChevronRight } from 'react-icons/fi';
import { useActivitySummaries } from '@/features/activities/hooks';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { StatusBadge, TypeBadge } from '@/shared/components/ui';

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ActivityMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
`;

const ActivityTime = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActivityUser = styled.div``;

const BadgeContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 16px;
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${({ theme }) => theme.error};
  gap: 8px;
  text-align: center;
  padding: 0 20px;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${({ theme }) => theme.textSecondary};
  gap: 8px;
  text-align: center;
`;

const ActivitySummaryList: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useActivitySummaries();

  const handleActivityClick = (id: number) => {
    navigate(`/activities/${id}`);
  };

  const handleViewAllClick = () => {
    navigate('/activities');
  };

  return (
    <Card>
      <CardHeader>
        <Title>Actividades recientes</Title>
        <MenuButton>
          <FiMoreVertical size={20} />
        </MenuButton>
      </CardHeader>

      {isLoading && (
        <LoadingContainer>
          <FiLoader size={24} />
        </LoadingContainer>
      )}

      {isError && (
        <ErrorContainer>
          <FiAlertCircle size={24} />
          <span>Error al cargar actividades: {(error as Error)?.message || 'Error desconocido'}</span>
        </ErrorContainer>
      )}

      {!isLoading && !isError && data?.summaries?.length === 0 && (
        <EmptyContainer>
          <span>No hay actividades recientes</span>
        </EmptyContainer>
      )}

      {!isLoading && !isError && data?.summaries?.length > 0 && (
        <>
          <ActivityList>
            {data.summaries.map((activity: any) => (
              <ActivityItem key={activity.id}>
                <ActivityContent>
                  <ActivityTitle onClick={() => handleActivityClick(activity.id)}>
                    {activity.description}
                  </ActivityTitle>
                  <ActivityMeta>
                    <ActivityTime>
                      <FiClock size={12} />
                      {(() => {
                        try {
                          // Verificar si la fecha es válida
                          const date = new Date(activity.date);
                          if (isNaN(date.getTime())) {
                            return 'Fecha no disponible';
                          }
                          return formatDistanceToNow(date, { addSuffix: true, locale: es });
                        } catch (error) {
                          console.error('Error al formatear fecha:', error);
                          return 'Fecha no disponible';
                        }
                      })()}
                    </ActivityTime>
                    {activity.person && (
                      <ActivityUser>
                        por <strong>{activity.person}</strong>
                      </ActivityUser>
                    )}
                  </ActivityMeta>
                  <BadgeContainer>
                    <TypeBadge type={activity.type} />
                    <StatusBadge status={activity.status} />
                  </BadgeContainer>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityList>

          <ViewAllButton onClick={handleViewAllClick}>
            Ver todas las actividades
            <FiChevronRight size={16} />
          </ViewAllButton>
        </>
      )}
    </Card>
  );
};

export default ActivitySummaryList;
