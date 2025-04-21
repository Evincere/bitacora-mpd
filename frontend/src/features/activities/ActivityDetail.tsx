import React from 'react';
import { useParams } from 'react-router-dom';

/**
 * Componente para mostrar el detalle de una actividad
 */
const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Detalle de Actividad</h1>
      <p>ID: {id}</p>
      {/* Aquí iría el contenido real del detalle de la actividad */}
    </div>
  );
};

export default ActivityDetail;
