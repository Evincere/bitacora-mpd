import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserForm } from '../components';
import { PageTransition, useToast } from '@/components/ui';
import { useUser, useUpdateUser } from '../hooks/useUsers';
import { UserUpdateDto } from '../services/userService';

const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '0', 10);

  const navigate = useNavigate();
  const toast = useToast();

  const { data: user, isLoading, isError } = useUser(userId);
  const updateUser = useUpdateUser();

  const handleSubmit = async (data: UserUpdateDto) => {
    try {
      await updateUser.mutateAsync({ id: userId, userData: data });
      toast.success('Usuario actualizado correctamente');
      navigate('/app/admin/usuarios');
    } catch (error) {
      toast.error('Error al actualizar el usuario');
      console.error('Error al actualizar usuario:', error);
    }
  };

  const handleCancel = () => {
    navigate('/app/admin/usuarios');
  };

  if (isLoading) {
    return <div>Cargando usuario...</div>;
  }

  if (isError || !user) {
    return <div>Error al cargar el usuario</div>;
  }

  return (
    <PageTransition>
      <UserForm
        user={user}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </PageTransition>
  );
};

export default EditUserPage;
