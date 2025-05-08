import React from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '@/core/store';
import { setUser } from '@/features/auth/store/authSlice';
import { Button } from '@/components/ui';
import { FiShield } from 'react-icons/fi';

const Container = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const DebugButton = styled(Button)`
  background-color: #ff5722;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: #e64a19;
  }
`;

/**
 * Componente para añadir el permiso EXECUTE_ACTIVITIES al usuario actual
 */
const AddExecutePermission: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  // Si no hay usuario o ya tiene el permiso, no mostrar el botón
  if (!user || (user.permissions && user.permissions.includes('EXECUTE_ACTIVITIES'))) {
    return null;
  }
  
  const handleAddPermission = () => {
    // Crear una copia del usuario con el permiso EXECUTE_ACTIVITIES
    const updatedUser = {
      ...user,
      permissions: [...(user.permissions || []), 'EXECUTE_ACTIVITIES']
    };
    
    // Actualizar en localStorage
    localStorage.setItem('bitacora_user', JSON.stringify(updatedUser));
    
    // Actualizar en Redux
    dispatch(setUser(updatedUser));
    
    // Mostrar mensaje
    alert('Permiso EXECUTE_ACTIVITIES añadido correctamente. Intenta completar la tarea ahora.');
  };
  
  return (
    <Container>
      <DebugButton onClick={handleAddPermission}>
        <FiShield size={16} style={{ marginRight: '8px' }} />
        Añadir permiso EXECUTE_ACTIVITIES
      </DebugButton>
    </Container>
  );
};

export default AddExecutePermission;
