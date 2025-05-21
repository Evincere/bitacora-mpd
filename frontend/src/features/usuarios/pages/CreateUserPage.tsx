import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserForm } from '../components';
import { PageTransition, useToastContext } from '@/components/ui';
import { useCreateUser } from '../hooks/useUsers';
import { UserCreateDto } from '../services/userService';

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastContext();
  const createUser = useCreateUser();

  const handleSubmit = async (data: UserCreateDto) => {
    try {
      await createUser.mutateAsync(data);
      showSuccess('Usuario creado correctamente');
      navigate('/app/admin/usuarios');
    } catch (error) {
      showError('Error al crear el usuario');
      console.error('Error al crear usuario:', error);
    }
  };

  const handleCancel = () => {
    navigate('/app/admin/usuarios');
  };

  return (
    <PageTransition>
      <UserForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </PageTransition>
  );
};

export default CreateUserPage;
