import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserForm } from '../components';
import { PageTransition } from '@/components/ui';
import { useCreateUser } from '../hooks/useUsers';
import { UserCreateDto, UserUpdateDto } from '../services/userService';
import { toast } from 'react-toastify';

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const createUser = useCreateUser();

  const handleSubmit = async (data: UserCreateDto | UserUpdateDto) => {
    try {
      // Para la página de creación, siempre esperamos UserCreateDto
      await createUser.mutateAsync(data as UserCreateDto);
      toast.success('Usuario creado correctamente');
      navigate('/app/admin/usuarios');
    } catch (error) {
      toast.error('Error al crear el usuario');
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
