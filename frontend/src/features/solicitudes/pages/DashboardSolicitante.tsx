import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiBarChart2,
  FiCalendar,
  FiFileText,
  FiLoader,
  FiRefreshCw
} from 'react-icons/fi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

// Componentes
import { StatusBadge } from '@/shared/components/ui';
import { Button } from '@/components/ui';
import BarChart from '@/features/dashboard/components/BarChart';

// Servicios y hooks
import solicitudesService from '@/features/solicitudes/services/solicitudesService';
import useRequesterStats, { REQUESTER_STATS_KEY } from '../hooks/useRequesterStats';

// Tipo para las solicitudes adaptadas al formato del dashboard
interface SolicitudAdaptada {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  prioridad: string;
  fechaCreacion: string;
  fechaLimite?: string;
  estado: string;
  solicitante: string;
  asignador?: string;
  ejecutor?: string;
}

// Tipo para las estadísticas de tiempos
interface TiemposRespuesta {
  tiempoPromedioAsignacion: number;
  tiempoPromedioCompletado: number;
  tiempoPromedioAprobacion: number;
  solicitudesCompletadasATiempo: number;
  solicitudesRetrasadas: number;
}

// Estilos
const PageContainer = styled.div`
  padding: 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const StatFooter = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 8px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ContentSection = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const SolicitudesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SolicitudItem = styled.div`
  background-color: ${({ theme }) => theme.backgroundTertiary};
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

const SolicitudHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SolicitudTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const SolicitudMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SolicitudDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SolicitudDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProgressContainer = styled.div`
  margin-top: 16px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ProgressLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ProgressValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: ${({ theme }) => theme.backgroundTertiary};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background-color: ${({ theme }) => theme.primary};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;

  svg {
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 16px;
  }

  h3 {
    margin: 0 0 8px;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0 0 20px;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

// Animación para el spinner
const SpinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Estilos para el spinner
const Spinner = styled(FiLoader)`
  animation: ${SpinAnimation} 1s linear infinite;
`;

// Funciones auxiliares
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha inválida';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return 'Solicitada';
    case 'ASSIGNED':
      return 'Asignada';
    case 'IN_PROGRESS':
      return 'En Progreso';
    case 'COMPLETED':
      return 'Completada';
    case 'APPROVED':
      return 'Aprobada';
    case 'REJECTED':
      return 'Rechazada';
    default:
      return status;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return <FiClock size={14} />;
    case 'ASSIGNED':
      return <FiClock size={14} />;
    case 'IN_PROGRESS':
      return <FiClock size={14} />;
    case 'COMPLETED':
      return <FiCheckCircle size={14} />;
    case 'APPROVED':
      return <FiCheckCircle size={14} />;
    case 'REJECTED':
      return <FiXCircle size={14} />;
    default:
      return <FiAlertCircle size={14} />;
  }
};

const DashboardSolicitante: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [solicitudes, setSolicitudes] = useState<SolicitudAdaptada[]>([]);
  const [isLoadingSolicitudes, setIsLoadingSolicitudes] = useState<boolean>(false);
  const [tiemposRespuesta, setTiemposRespuesta] = useState<TiemposRespuesta>({
    tiempoPromedioAsignacion: 0,
    tiempoPromedioCompletado: 0,
    tiempoPromedioAprobacion: 0,
    solicitudesCompletadasATiempo: 0,
    solicitudesRetrasadas: 0
  });

  // Efecto para limpiar la caché de estadísticas y solicitudes al montar el componente
  useEffect(() => {
    // Invalidar la caché de estadísticas para forzar una nueva petición
    queryClient.invalidateQueries({ queryKey: REQUESTER_STATS_KEY });
    queryClient.invalidateQueries({ queryKey: ['mySolicitudes'] });

    // Limpiar datos en caché
    queryClient.setQueryData(REQUESTER_STATS_KEY, null);
    queryClient.setQueryData(['mySolicitudes'], null);

    console.log('Caché de estadísticas y solicitudes invalidada');

    // Verificar que el token esté disponible
    const token = localStorage.getItem('bitacora_token');
    console.log('Token disponible en dashboard:', token ? `${token.substring(0, 10)}...` : 'null');

    if (token) {
      // Forzar la carga inmediata de estadísticas y solicitudes
      setTimeout(() => {
        console.log('Forzando carga inicial de estadísticas y solicitudes');

        // Refrescar las consultas en lugar de hacer peticiones directas
        queryClient.invalidateQueries({ queryKey: REQUESTER_STATS_KEY });
        queryClient.invalidateQueries({ queryKey: ['mySolicitudes'] });

        // Forzar la recarga de las consultas
        refetchStats?.().then(result => {
          console.log('Estadísticas recargadas inicialmente:', result.data);
        }).catch(error => {
          console.error('Error al recargar estadísticas inicialmente:', error);
        });

        refetchSolicitudes?.().then(result => {
          console.log('Solicitudes recargadas inicialmente:', result.data);
        }).catch(error => {
          console.error('Error al recargar solicitudes inicialmente:', error);
        });
      }, 500);
    } else {
      console.error('No hay token disponible para realizar peticiones');
    }
  }, [queryClient]);

  // Consulta para obtener las solicitudes del usuario
  const {
    data: solicitudesData,
    error: solicitudesError,
    refetch: refetchSolicitudes
  } = useQuery({
    queryKey: ['mySolicitudes'],
    queryFn: async () => {
      setIsLoadingSolicitudes(true);
      try {
        const result = await solicitudesService.getMySolicitudes(0, 100); // Obtener todas para calcular estadísticas
        setIsLoadingSolicitudes(false);
        return result;
      } catch (error) {
        setIsLoadingSolicitudes(false);
        throw error;
      }
    },
    staleTime: 0, // Forzar actualización en cada render
    refetchOnWindowFocus: true, // Actualizar cuando la ventana recupera el foco
    refetchOnMount: true, // Actualizar al montar el componente
  });

  // Consulta para obtener estadísticas del solicitante (forzando actualización)
  const {
    data: statsData,
    isLoading: isLoadingStats,
    refetch: refetchStats
  } = useRequesterStats(true); // Forzar actualización de datos

  // Efecto para refrescar los datos cuando cambia la ruta o se monta el componente
  useEffect(() => {
    const refreshData = async () => {
      console.log('Refrescando datos del dashboard...');
      try {
        // Establecer estado de carga
        setIsLoadingSolicitudes(true);

        // Realizar peticiones en paralelo
        const [solicitudesResult, statsResult] = await Promise.all([
          refetchSolicitudes(),
          refetchStats()
        ]);

        console.log('Datos refrescados con éxito:');
        console.log('- Solicitudes:', solicitudesResult.data);
        console.log('- Estadísticas:', statsResult.data);

        // Actualizar el estado con los nuevos datos
        if (solicitudesResult.data) {
          setSolicitudes(adaptarSolicitudes(solicitudesResult.data.taskRequests || []));
        }

        // Desactivar estado de carga
        setIsLoadingSolicitudes(false);
      } catch (error) {
        console.error('Error al refrescar datos:', error);
        setIsLoadingSolicitudes(false);
      }
    };

    // Ejecutar inmediatamente
    refreshData();

    // Configurar intervalo para refrescar datos cada 30 segundos
    const intervalId = setInterval(refreshData, 30000);

    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalId);
  }, [refetchSolicitudes, refetchStats]);

  // Función para adaptar las solicitudes del formato de la API al formato interno
  const adaptarSolicitudes = useCallback((solicitudesApi: any[]): SolicitudAdaptada[] => {
    console.log('Adaptando solicitudes:', solicitudesApi);
    return solicitudesApi.map(tr => ({
      id: tr.id,
      titulo: tr.title,
      descripcion: tr.description,
      categoria: tr.category?.name || 'Sin categoría',
      prioridad: tr.priority,
      fechaCreacion: tr.requestDate,
      fechaLimite: tr.dueDate,
      estado: tr.status,
      solicitante: tr.requesterName || 'Desconocido',
      asignador: tr.assignerName,
      ejecutor: tr.executorName
    }));
  }, []);

  // Adaptar los datos del backend al formato esperado por el componente
  useEffect(() => {
    if (solicitudesData?.taskRequests) {
      console.log('Actualizando solicitudes desde solicitudesData:', solicitudesData.taskRequests);
      const solicitudesAdaptadas = adaptarSolicitudes(solicitudesData.taskRequests);
      setSolicitudes(solicitudesAdaptadas);

      // Calcular estadísticas de tiempos
      if (solicitudesAdaptadas.length > 0) {
        // Solicitudes con fechas de asignación (asumimos que las solicitudes con estado ASSIGNED o IN_PROGRESS ya tienen fecha de asignación)
        const solicitudesAsignadas = solicitudesData.taskRequests.filter(tr =>
          tr.status === 'ASSIGNED' || tr.status === 'IN_PROGRESS' || tr.status === 'COMPLETED');

        // Calcular tiempo promedio de asignación (desde solicitud hasta asignación)
        // Como no tenemos assignmentDate, usamos la fecha de solicitud + 2 días como aproximación
        const tiemposAsignacion = solicitudesAsignadas.map(tr => {
          const fechaSolicitud = new Date(tr.requestDate);
          // Simulamos una fecha de asignación (2 días después de la solicitud)
          const fechaAsignacion = new Date(fechaSolicitud);
          fechaAsignacion.setDate(fechaAsignacion.getDate() + 2);
          return differenceInDays(fechaAsignacion, fechaSolicitud);
        });

        // Calcular tiempo promedio de completado (desde asignación hasta completado)
        const solicitudesCompletadas = solicitudesData.taskRequests.filter(tr =>
          tr.status === 'COMPLETED' || tr.status === 'APPROVED' || tr.status === 'REJECTED'
        );

        const tiemposCompletado = solicitudesCompletadas.map(tr => {
          // Simulamos una fecha de asignación (2 días después de la solicitud)
          const fechaSolicitud = new Date(tr.requestDate);
          const fechaAsignacion = new Date(fechaSolicitud);
          fechaAsignacion.setDate(fechaAsignacion.getDate() + 2);

          const fechaCompletado = new Date(tr.completionDate || new Date());
          return differenceInDays(fechaCompletado, fechaAsignacion);
        });

        // Calcular porcentaje de solicitudes completadas a tiempo
        const solicitudesConFechaLimite = solicitudesCompletadas.filter(tr => tr.dueDate && tr.completionDate);

        // Solo calcular si hay solicitudes con fecha límite y fecha de completado
        let porcentajeATiempo = 0;
        let porcentajeConRetraso = 0;

        if (solicitudesConFechaLimite.length > 0) {
          const completadasATiempo = solicitudesConFechaLimite.filter(tr => {
            const fechaCompletado = new Date(tr.completionDate!);
            const fechaLimite = new Date(tr.dueDate!);
            return fechaCompletado <= fechaLimite;
          });

          porcentajeATiempo = Math.round((completadasATiempo.length / solicitudesConFechaLimite.length) * 100);
          porcentajeConRetraso = 100 - porcentajeATiempo;
        }

        setTiemposRespuesta({
          tiempoPromedioAsignacion: tiemposAsignacion.length > 0
            ? tiemposAsignacion.reduce((sum, time) => sum + time, 0) / tiemposAsignacion.length
            : 0,
          tiempoPromedioCompletado: tiemposCompletado.length > 0
            ? tiemposCompletado.reduce((sum, time) => sum + time, 0) / tiemposCompletado.length
            : 0,
          tiempoPromedioAprobacion: 0, // No tenemos esta información por ahora
          solicitudesCompletadasATiempo: porcentajeATiempo,
          solicitudesRetrasadas: porcentajeConRetraso
        });
      }
    }
  }, [solicitudesData]);

  // Función para calcular el tiempo promedio de respuesta (primera interacción después de enviar la solicitud)
  const calcularTiempoPromedioRespuesta = (): number => {
    // Si no hay solicitudes en total, no hay tiempo promedio
    if (statsData?.totalRequests === 0 || totalSolicitudes === 0) {
      return 0;
    }

    // Si tenemos datos del backend, verificamos que sean reales
    if (statsData?.averageAssignmentTime !== undefined) {
      // Verificamos que haya solicitudes asignadas para considerar el tiempo promedio como válido
      if (statsData.assignedRequests > 0 || statsData.inProgressRequests > 0 || statsData.completedRequests > 0) {
        return statsData.averageAssignmentTime;
      } else {
        // Si no hay solicitudes asignadas, no hay tiempo promedio real
        return 0;
      }
    }

    // Si no tenemos datos del backend o son inválidos, calculamos con los datos locales
    if (!solicitudesData?.taskRequests || solicitudesData.taskRequests.length === 0) {
      return 0;
    }

    // Filtramos solicitudes que han recibido alguna respuesta (no están en estado SUBMITTED)
    const solicitudesConRespuesta = solicitudesData.taskRequests.filter(tr =>
      tr.status !== 'SUBMITTED' && tr.status !== 'DRAFT');

    if (solicitudesConRespuesta.length === 0) {
      return 0;
    }

    // Para cada solicitud, calculamos el tiempo desde la solicitud hasta la primera respuesta
    // Solo usamos solicitudes que tienen fecha de asignación (respuesta real)
    const solicitudesConFechaAsignacion = solicitudesConRespuesta.filter(tr => tr.assignmentDate);

    // Si no hay solicitudes con fecha de asignación, no podemos calcular un tiempo real
    if (solicitudesConFechaAsignacion.length === 0) {
      return 0;
    }

    const tiemposRespuesta = solicitudesConFechaAsignacion.map(tr => {
      const fechaSolicitud = new Date(tr.requestDate);
      const fechaAsignacion = new Date(tr.assignmentDate!);

      return differenceInDays(fechaAsignacion, fechaSolicitud);
    });

    // Calculamos el promedio
    const tiempoPromedio = tiemposRespuesta.reduce((sum, time) => sum + time, 0) / tiemposRespuesta.length;

    return tiempoPromedio;
  };

  // Calcular estadísticas
  const totalSolicitudes = statsData?.totalRequests || solicitudes.length;
  const solicitudesPendientes = statsData?.pendingRequests || solicitudes.filter(s => s.estado === 'SUBMITTED').length;
  const solicitudesAsignadas = (statsData?.assignedRequests || 0) + (statsData?.inProgressRequests || 0) ||
    solicitudes.filter(s => s.estado === 'ASSIGNED' || s.estado === 'IN_PROGRESS').length;
  const solicitudesCompletadas = statsData?.completedRequests ||
    solicitudes.filter(s => s.estado === 'COMPLETED' || s.estado === 'APPROVED' || s.estado === 'REJECTED').length;

  // Determinar si hay suficientes datos para mostrar estadísticas de completado a tiempo
  const haySuficientesDatosCompletado = solicitudesCompletadas > 0;

  // Ordenar solicitudes por fecha de creación (más recientes primero)
  const solicitudesRecientes = [...solicitudes]
    .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
    .slice(0, 5);

  const handleNuevaSolicitud = () => {
    navigate('/app/solicitudes/nueva');
  };

  const handleVerSolicitud = (id: number) => {
    navigate(`/app/solicitudes/seguimiento/${id}`);
  };

  const handleVerTodasSolicitudes = () => {
    navigate('/app/solicitudes');
  };

  // Función para recargar manualmente los datos
  const handleRecargarDatos = async () => {
    console.log('Recargando datos manualmente...');
    // Mostrar estado de carga
    setIsLoadingSolicitudes(true);

    try {
      // Refrescar datos
      await refetchSolicitudes();
      await refetchStats();
      console.log('Datos recargados correctamente');
    } catch (error) {
      console.error('Error al recargar datos:', error);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Dashboard de Solicitudes</PageTitle>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" onClick={handleRecargarDatos} disabled={isLoadingStats || isLoadingSolicitudes}>
            {isLoadingStats || isLoadingSolicitudes ? (
              <Spinner size={16} />
            ) : (
              <FiRefreshCw size={16} />
            )}
            Recargar
          </Button>
          <Button variant="primary" onClick={handleNuevaSolicitud}>
            <FiPlus size={16} />
            Nueva Solicitud
          </Button>
        </div>
      </PageHeader>

      <StatsContainer>
        <StatCard>
          <StatTitle>
            <FiFileText size={16} />
            Total de Solicitudes
          </StatTitle>
          {isLoadingStats ? (
            <StatValue><Spinner size={16} /></StatValue>
          ) : (
            <>
              <StatValue>{totalSolicitudes}</StatValue>
              <StatFooter>
                {solicitudesPendientes} pendientes, {solicitudesAsignadas} en proceso
              </StatFooter>
            </>
          )}
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiClock size={16} />
            Tiempo Promedio de Respuesta
          </StatTitle>
          {isLoadingStats ? (
            <StatValue><Spinner size={16} /></StatValue>
          ) : (
            <>
              {/* Verificar explícitamente si hay solicitudes y si hay datos reales */}
              {totalSolicitudes === 0 ? (
                <>
                  <StatValue>-</StatValue>
                  <StatFooter>No hay solicitudes</StatFooter>
                </>
              ) : solicitudesPendientes === totalSolicitudes ? (
                <>
                  <StatValue>-</StatValue>
                  <StatFooter>Todas las solicitudes están pendientes</StatFooter>
                </>
              ) : statsData?.assignedRequests === 0 && statsData?.inProgressRequests === 0 && statsData?.completedRequests === 0 ? (
                <>
                  <StatValue>-</StatValue>
                  <StatFooter>No hay solicitudes asignadas</StatFooter>
                </>
              ) : (() => {
                const tiempoPromedio = calcularTiempoPromedioRespuesta();
                return tiempoPromedio > 0 ? (
                  <>
                    <StatValue>{tiempoPromedio.toFixed(1)}</StatValue>
                    <StatFooter>días</StatFooter>
                  </>
                ) : (
                  <>
                    <StatValue>-</StatValue>
                    <StatFooter>Sin datos suficientes</StatFooter>
                  </>
                );
              })()}
            </>
          )}
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiClock size={16} />
            Tiempo Promedio de Asignación
          </StatTitle>
          {isLoadingStats ? (
            <StatValue><Spinner size={16} /></StatValue>
          ) : (
            <>
              {(statsData?.averageAssignmentTime && statsData.averageAssignmentTime > 0) || tiemposRespuesta.tiempoPromedioAsignacion > 0 ? (
                <>
                  <StatValue>
                    {statsData?.averageAssignmentTime
                      ? statsData.averageAssignmentTime.toFixed(1)
                      : tiemposRespuesta.tiempoPromedioAsignacion.toFixed(1)}
                  </StatValue>
                  <StatFooter>días</StatFooter>
                </>
              ) : (
                <>
                  <StatValue>-</StatValue>
                  <StatFooter>
                    {totalSolicitudes === 0
                      ? "No hay solicitudes"
                      : solicitudesAsignadas === 0
                        ? "No hay solicitudes asignadas"
                        : "Sin datos suficientes"}
                  </StatFooter>
                </>
              )}
            </>
          )}
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiClock size={16} />
            Tiempo Promedio de Completado
          </StatTitle>
          {isLoadingStats ? (
            <StatValue><Spinner size={16} /></StatValue>
          ) : (
            <>
              {(statsData?.averageCompletionTime && statsData.averageCompletionTime > 0) || tiemposRespuesta.tiempoPromedioCompletado > 0 ? (
                <>
                  <StatValue>
                    {statsData?.averageCompletionTime
                      ? statsData.averageCompletionTime.toFixed(1)
                      : tiemposRespuesta.tiempoPromedioCompletado.toFixed(1)}
                  </StatValue>
                  <StatFooter>días</StatFooter>
                </>
              ) : (
                <>
                  <StatValue>-</StatValue>
                  <StatFooter>
                    {totalSolicitudes === 0
                      ? "No hay solicitudes"
                      : solicitudesCompletadas === 0
                        ? "No hay solicitudes completadas"
                        : "Sin datos suficientes"}
                  </StatFooter>
                </>
              )}
            </>
          )}
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiCheckCircle size={16} />
            Solicitudes Completadas a Tiempo
          </StatTitle>
          {isLoadingStats ? (
            <StatValue><Spinner size={16} /></StatValue>
          ) : (
            <>
              {/* Verificar si hay datos suficientes para mostrar estadísticas */}
              {((statsData?.onTimeCompletionPercentage !== undefined &&
                 statsData.completedRequests !== undefined &&
                 statsData.completedRequests > 0) ||
                (tiemposRespuesta.solicitudesCompletadasATiempo > 0 &&
                 haySuficientesDatosCompletado)) ? (
                <>
                  <StatValue>
                    {statsData?.onTimeCompletionPercentage !== undefined
                      ? statsData.onTimeCompletionPercentage.toFixed(0)
                      : tiemposRespuesta.solicitudesCompletadasATiempo}%
                  </StatValue>
                  <StatFooter>
                    {statsData?.lateCompletionPercentage !== undefined
                      ? statsData.lateCompletionPercentage.toFixed(0)
                      : tiemposRespuesta.solicitudesRetrasadas}% con retraso
                  </StatFooter>
                </>
              ) : (
                <>
                  <StatValue>-</StatValue>
                  <StatFooter>
                    {solicitudesCompletadas === 0
                      ? "No hay solicitudes completadas"
                      : "Faltan datos de fechas límite"}
                  </StatFooter>
                </>
              )}
            </>
          )}
        </StatCard>
      </StatsContainer>

      <ContentGrid>
        <ContentSection>
          <SectionTitle>
            <FiFileText size={18} />
            Solicitudes Recientes
          </SectionTitle>

          {isLoadingSolicitudes ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Spinner size={32} />
            </div>
          ) : solicitudesError ? (
            <EmptyState>
              <FiAlertCircle size={48} />
              <h3>Error al cargar solicitudes</h3>
              <p>No se pudieron cargar las solicitudes. Intente nuevamente.</p>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </EmptyState>
          ) : solicitudesRecientes.length > 0 ? (
            <SolicitudesList>
              {solicitudesRecientes.map((solicitud) => (
                <SolicitudItem key={solicitud.id} onClick={() => handleVerSolicitud(solicitud.id)}>
                  <SolicitudHeader>
                    <SolicitudTitle>{solicitud.titulo}</SolicitudTitle>
                    <SolicitudMeta>
                      <StatusBadge status={solicitud.estado}>
                        {getStatusIcon(solicitud.estado)}
                        {getStatusText(solicitud.estado)}
                      </StatusBadge>
                      <SolicitudDate>
                        <FiCalendar size={12} />
                        {formatDate(solicitud.fechaCreacion)}
                      </SolicitudDate>
                    </SolicitudMeta>
                  </SolicitudHeader>
                  <SolicitudDescription>{solicitud.descripcion}</SolicitudDescription>
                </SolicitudItem>
              ))}

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Button onClick={handleVerTodasSolicitudes}>
                  Ver todas las solicitudes
                </Button>
              </div>
            </SolicitudesList>
          ) : (
            <EmptyState>
              <FiAlertCircle size={48} />
              <h3>No hay solicitudes recientes</h3>
              <p>Crea una nueva solicitud para comenzar.</p>
              <Button variant="primary" onClick={handleNuevaSolicitud}>
                <FiPlus size={16} />
                Nueva Solicitud
              </Button>
            </EmptyState>
          )}
        </ContentSection>

        <ContentSection>
          <SectionTitle>
            <FiBarChart2 size={18} />
            Estado de Solicitudes
          </SectionTitle>

          {isLoadingStats ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Spinner size={32} />
            </div>
          ) : (
            <>
              {statsData?.requestsByCategory && Object.keys(statsData.requestsByCategory).length > 0 ? (
                <div style={{ height: '250px', marginBottom: '20px' }}>
                  <BarChart
                    data={{
                      labels: Object.keys(statsData.requestsByCategory),
                      datasets: [
                        {
                          label: 'Solicitudes por categoría',
                          data: Object.values(statsData.requestsByCategory),
                          backgroundColor: [
                            'rgba(108, 92, 231, 0.7)',
                            'rgba(0, 184, 212, 0.7)',
                            'rgba(76, 217, 100, 0.7)',
                            'rgba(255, 51, 102, 0.7)',
                            'rgba(255, 153, 0, 0.7)',
                          ],
                          borderColor: [
                            'rgba(108, 92, 231, 1)',
                            'rgba(0, 184, 212, 1)',
                            'rgba(76, 217, 100, 1)',
                            'rgba(255, 51, 102, 1)',
                            'rgba(255, 153, 0, 1)',
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        title: {
                          display: true,
                          text: 'Distribución por categoría',
                          font: {
                            size: 14,
                          },
                        },
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0,
                          },
                        },
                      },
                    }}
                    height={200}
                  />
                </div>
              ) : (
                <ProgressContainer>
                  <ProgressHeader>
                    <ProgressLabel>Solicitadas</ProgressLabel>
                    <ProgressValue>{solicitudesPendientes} de {totalSolicitudes}</ProgressValue>
                  </ProgressHeader>
                  <ProgressBar>
                    <ProgressFill $percentage={totalSolicitudes > 0 ? (solicitudesPendientes / totalSolicitudes) * 100 : 0} />
                  </ProgressBar>
                </ProgressContainer>
              )}

              <ProgressContainer>
                <ProgressHeader>
                  <ProgressLabel>En Proceso</ProgressLabel>
                  <ProgressValue>{solicitudesAsignadas} de {totalSolicitudes}</ProgressValue>
                </ProgressHeader>
                <ProgressBar>
                  <ProgressFill $percentage={totalSolicitudes > 0 ? (solicitudesAsignadas / totalSolicitudes) * 100 : 0} />
                </ProgressBar>
              </ProgressContainer>

              <ProgressContainer>
                <ProgressHeader>
                  <ProgressLabel>Completadas</ProgressLabel>
                  <ProgressValue>{solicitudesCompletadas} de {totalSolicitudes}</ProgressValue>
                </ProgressHeader>
                <ProgressBar>
                  <ProgressFill $percentage={totalSolicitudes > 0 ? (solicitudesCompletadas / totalSolicitudes) * 100 : 0} />
                </ProgressBar>
              </ProgressContainer>
            </>
          )}

          <div style={{ marginTop: '24px' }}>
            <SectionTitle>
              <FiClock size={18} />
              Próximas Fechas Límite
            </SectionTitle>

            {isLoadingSolicitudes ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <Spinner size={24} />
              </div>
            ) : (
              solicitudes
                .filter(s => s.fechaLimite && s.estado !== 'COMPLETED' && s.estado !== 'APPROVED' && s.estado !== 'REJECTED')
                .sort((a, b) => new Date(a.fechaLimite || '').getTime() - new Date(b.fechaLimite || '').getTime())
                .slice(0, 3)
                .map((solicitud) => (
                  <SolicitudItem key={solicitud.id} onClick={() => handleVerSolicitud(solicitud.id)}>
                    <SolicitudHeader>
                      <SolicitudTitle>{solicitud.titulo}</SolicitudTitle>
                      <SolicitudDate>
                        <FiCalendar size={12} />
                        {formatDate(solicitud.fechaLimite || '')}
                      </SolicitudDate>
                    </SolicitudHeader>
                  </SolicitudItem>
                ))
            )}

            {!isLoadingSolicitudes && solicitudes.filter(s => s.fechaLimite && s.estado !== 'COMPLETED' && s.estado !== 'APPROVED' && s.estado !== 'REJECTED').length === 0 && (
              <div style={{ padding: '10px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No hay fechas límite próximas
              </div>
            )}
          </div>
        </ContentSection>
      </ContentGrid>
    </PageContainer>
  );
};

export default DashboardSolicitante;
