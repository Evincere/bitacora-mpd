import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserList } from '../components';
import { PageTransition } from '@/components/ui';

const UsersPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAddUser = () => {
    navigate('/app/admin/usuarios/nuevo');
  };

  const handleEditUser = (userId: number) => {
    navigate(`/app/admin/usuarios/editar/${userId}`);
  };

  const handleViewUser = (userId: number) => {
    navigate(`/app/admin/usuarios/${userId}`);
  };

  return (
    <PageTransition>
      <UserList 
        onAdd={handleAddUser}
        onEdit={(user) => handleEditUser(user.id)}
        onView={(user) => handleViewUser(user.id)}
      />
    </PageTransition>
  );
};

export default UsersPage;
