import React from 'react';
import { PageTransition } from '@/components/ui';
import UserAuditLog from '../components/UserAuditLog';

/**
 * Página principal para la auditoría de usuarios
 */
const UserAuditPage: React.FC = () => {
  return (
    <PageTransition>
      <UserAuditLog />
    </PageTransition>
  );
};

export default UserAuditPage;
