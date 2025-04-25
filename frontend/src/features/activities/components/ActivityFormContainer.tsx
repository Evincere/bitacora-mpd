import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Activity } from '@/core/types/models';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '@/core/api/api';
import ActivityForm from './ActivityForm';
import ActivityFormSkeleton from './ActivityFormSkeleton';

/**
 * Componente contenedor para el formulario de actividad
 * Este componente se encarga de:
 * 1. Obtener el ID de la actividad de los parámetros de la URL
 * 2. Cargar los datos de la actividad si es necesario
 * 3. Renderizar el formulario o un esqueleto de carga
 */
const ActivityFormContainer: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const activityId = id ? parseInt(id, 10) : undefined;
  const isEditing = !!activityId;

  // Obtener la actividad si estamos editando
  const { data: activity, isLoading, error } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: () => fetchData<Activity>(`activities/${activityId}`),
    enabled: !!activityId
  });

  const handleClose = () => {
    navigate('/activities');
  };

  // Mostrar un esqueleto de carga mientras se obtienen los datos
  if (isEditing && isLoading) {
    return <ActivityFormSkeleton />;
  }

  // Mostrar un mensaje de error si no se pudo cargar la actividad
  if (isEditing && (error || !activity)) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h3>Error al cargar la actividad</h3>
        <p>No se pudo cargar la información de la actividad. Por favor, intente nuevamente.</p>
        <button 
          onClick={() => navigate('/activities')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6C5CE7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  // Renderizar el formulario con o sin datos de actividad
  return (
    <ActivityForm
      activity={isEditing ? activity : undefined}
      onClose={handleClose}
    />
  );
};

export default ActivityFormContainer;
