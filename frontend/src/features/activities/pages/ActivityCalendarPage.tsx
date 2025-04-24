import React, { useState } from 'react';
import styled from 'styled-components';
import { FiCalendar, FiInfo } from 'react-icons/fi';
import { useActivities, useUpdateActivity } from '@/hooks/useActivities';
import ActivityCalendar from '../components/ActivityCalendar';
import ActivityDetail from '../components/ActivityDetail';
import ActivityForm from '../components/ActivityForm';
import AdvancedFilters from '../components/AdvancedFilters';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Activity } from '@/types/models';
import { useToast } from '@/components/ui/Toast';

const ActivityCalendarPage: React.FC = () => {
  const [filters, setFilters] = useState<any>({});
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const { data: activities, isLoading, error } = useActivities(filters);
  const updateActivity = useUpdateActivity();
  const toast = useToast();

  const handleSelectActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowDetail(true);
  };

  const handleMoveActivity = async (activity: Activity, newDate: Date) => {
    try {
      const updatedActivity = {
        ...activity,
        date: newDate.toISOString()
      };

      await updateActivity.mutateAsync({
        id: activity.id,
        activityData: updatedActivity
      });

      toast.success('Actividad movida correctamente');
    } catch (error) {
      toast.error('Error al mover la actividad');
      console.error('Error moving activity:', error);
    }
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  const handleEdit = () => {
    setShowDetail(false);
    setShowEditForm(true);
  };

  const handleCloseForm = () => {
    setShowEditForm(false);
    setSelectedActivity(null);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <FiCalendar />
          Calendario de Actividades
        </PageTitle>
      </PageHeader>

      <AdvancedFilters
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
      />

      <ErrorBoundary>
        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner size={60} />
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <FiInfo size={24} />
            <ErrorMessage>Error al cargar las actividades</ErrorMessage>
            <ErrorDetails>{(error as Error).message}</ErrorDetails>
          </ErrorContainer>
        ) : activities && activities.activities && activities.activities.length > 0 ? (
          <ActivityCalendar
            activities={activities.activities}
            onSelectActivity={handleSelectActivity}
            onMoveActivity={handleMoveActivity}
          />
        ) : (
          <EmptyContainer>
            <FiInfo size={24} />
            <EmptyMessage>No hay actividades para mostrar</EmptyMessage>
            <EmptyDetails>Intenta cambiar los filtros o crear una nueva actividad</EmptyDetails>
          </EmptyContainer>
        )}
      </ErrorBoundary>

      {showDetail && selectedActivity && (
        <ActivityDetail
          activity={selectedActivity}
          onClose={handleCloseDetail}
          onEdit={handleEdit}
        />
      )}

      {showEditForm && selectedActivity && (
        <ActivityForm
          activity={selectedActivity}
          onClose={handleCloseForm}
        />
      )}
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 20px;
`;

const PageHeader = styled.div`
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 30px;
  text-align: center;

  svg {
    color: ${({ theme }) => theme.danger};
    margin-bottom: 20px;
  }
`;

const ErrorMessage = styled.h3`
  margin: 0 0 10px 0;
  font-size: 18px;
`;

const ErrorDetails = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textSecondary};
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 30px;
  text-align: center;

  svg {
    color: ${({ theme }) => theme.info};
    margin-bottom: 20px;
  }
`;

const EmptyMessage = styled.h3`
  margin: 0 0 10px 0;
  font-size: 18px;
`;

const EmptyDetails = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textSecondary};
`;

export default ActivityCalendarPage;
