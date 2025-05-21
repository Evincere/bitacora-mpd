import React from 'react';
import { PageTransition } from '@/components/ui';
import AdminDashboard from '../components/AdminDashboard';

/**
 * Página principal para el dashboard administrativo
 */
const AdminDashboardPage: React.FC = () => {
  return (
    <PageTransition>
      <AdminDashboard />
    </PageTransition>
  );
};

export default AdminDashboardPage;
