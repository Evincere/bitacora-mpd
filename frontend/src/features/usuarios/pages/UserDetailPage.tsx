import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserDetail } from '../components';
import { PageTransition } from '@/components/ui';
import { useUser } from '../hooks/useUsers';

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '0', 10);
  
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useUser(userId);

  const handleBack = () => {
    navigate('/app/admin/usuarios');
  };

  const handleEdit = () => {
    navigate(`/app/admin/usuarios/editar/${userId}`);
  };

  if (isLoading) {
    return <div>Cargando usuario...</div>;
  }

  if (isError || !user) {
    return <div>Error al cargar el usuario</div>;
  }

  return (
    <PageTransition>
      <UserDetail 
        user={user}
        onBack={handleBack}
        onEdit={handleEdit}
      />
    </PageTransition>
  );
};

export default UserDetailPage;
