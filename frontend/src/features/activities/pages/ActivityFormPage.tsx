import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ActivityForm from '../components/ActivityForm';
import { Activity } from '@/types/models';
import { useQuery } from '@tanstack/react-query';
import activitiesService from '@/services/activitiesService';

/**
 * Página contenedora para el formulario de actividad
 */
const ActivityFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const activityId = id ? parseInt(id, 10) : undefined;
  const isEditing = !!activityId;

  // Obtener la actividad si estamos editando
  const { data: activity, isLoading, error } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: () => activitiesService.getActivity(activityId as number),
    enabled: !!activityId
  });

  const handleClose = () => {
    navigate('/app/activities');
  };

  if (isEditing && isLoading) {
    return <div>Cargando...</div>;
  }

  if (isEditing && (error || !activity)) {
    return <div>Error al cargar la actividad</div>;
  }

  return (
    <ActivityForm 
      activity={isEditing ? (activity as Activity) : undefined} 
      onClose={handleClose} 
    />
  );
};

export default ActivityFormPage;
