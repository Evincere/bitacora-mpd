import { useTourGuide } from '@/components/ui/TourGuide';

export const useDashboardTour = (userRole: string) => {
  const { startTour } = useTourGuide();

  const startDashboardTour = () => {
    const steps = [
      {
        element: '#dashboard-stats',
        popover: {
          title: 'Estadísticas',
          description: 'Aquí puedes ver las métricas principales relacionadas con tus actividades.',
        },
      },
      {
        element: '#notifications-panel',
        popover: {
          title: 'Notificaciones',
          description: 'Revisa las notificaciones importantes aquí.',
        },
      },
      ...(userRole === 'ASIGNADOR'
        ? [
            {
              element: '#assignments-overview',
              popover: {
                title: 'Asignaciones',
                description: 'Gestiona las tareas asignadas a los ejecutores.',
              },
            },
          ]
        : []),
    ];

    startTour(steps);
  };

  return { startDashboardTour };
};
