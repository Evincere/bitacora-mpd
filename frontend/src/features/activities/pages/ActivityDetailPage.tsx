import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ActivityDetail from '../components/ActivityDetail';
import { Activity } from '@/types/models';
import { useQuery } from '@tanstack/react-query';
import activitiesService from '@/services/activitiesService';

/**
 * Página contenedora para el detalle de actividad
 */
const ActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const activityId = parseInt(id || '0', 10);

  // Obtener la actividad
  const { data: activity, isLoading, error } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: () => activitiesService.getActivityById(activityId),
    enabled: !!activityId
  });

  const handleClose = () => {
    navigate('/app/activities');
  };

  const handleEdit = () => {
    navigate(`/app/activities/${activityId}/edit`);
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error || !activity) {
    return <div>Error al cargar la actividad</div>;
  }

  return (
    <ActivityDetail
      activity={activity as Activity}
      onClose={handleClose}
      onEdit={handleEdit}
    />
  );
};

export default ActivityDetailPage;
