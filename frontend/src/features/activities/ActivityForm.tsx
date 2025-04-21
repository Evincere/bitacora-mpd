import React from 'react';
import { useParams } from 'react-router-dom';

/**
 * Componente para crear o editar una actividad
 */
const ActivityForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;

  return (
    <div>
      <h1>{isEditing ? 'Editar' : 'Crear'} Actividad</h1>
      {isEditing && <p>ID: {id}</p>}
      {/* Aquí iría el formulario real de la actividad */}
    </div>
  );
};

export default ActivityForm;
