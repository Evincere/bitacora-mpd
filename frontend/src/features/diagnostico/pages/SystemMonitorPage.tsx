import React from 'react';
import { PageTransition } from '@/components/ui';
import SystemMonitor from '../components/SystemMonitor';

/**
 * Página principal para las herramientas de diagnóstico y mantenimiento
 */
const SystemMonitorPage: React.FC = () => {
  return (
    <PageTransition>
      <SystemMonitor />
    </PageTransition>
  );
};

export default SystemMonitorPage;
