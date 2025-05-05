import React, { useState, useEffect } from 'react';
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
  FiSend,
  FiLoader
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

// Componentes
import { StatusBadge } from '@/shared/components/ui';
import { Button } from '@/components/ui';

// Tipos
import { TaskRequest } from '@/features/solicitudes/services/solicitudesService';

// Servicios y hooks
import solicitudesService from '@/features/solicitudes/services/solicitudesService';

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
  background-color: ${({ theme }) => theme.backgroundPrimary};
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
  background-color: ${({ theme }) => theme.backgroundPrimary};
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
  const [solicitudes, setSolicitudes] = useState<SolicitudAdaptada[]>([]);
  const [tiemposRespuesta, setTiemposRespuesta] = useState<TiemposRespuesta>({
    tiempoPromedioAsignacion: 0,
    tiempoPromedioCompletado: 0,
    tiempoPromedioAprobacion: 0,
    solicitudesCompletadasATiempo: 0,
    solicitudesRetrasadas: 0
  });

  // Consulta para obtener las solicitudes del usuario
  const {
    data: solicitudesData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['mySolicitudes'],
    queryFn: () => solicitudesService.getMySolicitudes(0, 100), // Obtener todas para calcular estadísticas
    staleTime: 60000, // 1 minuto
  });

  // Adaptar los datos del backend al formato esperado por el componente
  useEffect(() => {
    if (solicitudesData?.taskRequests) {
      const solicitudesAdaptadas: SolicitudAdaptada[] = solicitudesData.taskRequests.map(tr => ({
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

      setSolicitudes(solicitudesAdaptadas);

      // Calcular estadísticas de tiempos
      if (solicitudesAdaptadas.length > 0) {
        // Solicitudes con fechas de asignación
        const solicitudesAsignadas = solicitudesData.taskRequests.filter(tr => tr.assignmentDate);

        // Calcular tiempo promedio de asignación (desde solicitud hasta asignación)
        const tiemposAsignacion = solicitudesAsignadas.map(tr => {
          const fechaSolicitud = new Date(tr.requestDate);
          const fechaAsignacion = new Date(tr.assignmentDate!);
          return differenceInDays(fechaAsignacion, fechaSolicitud);
        });

        // Calcular tiempo promedio de completado (desde asignación hasta completado)
        const solicitudesCompletadas = solicitudesData.taskRequests.filter(tr =>
          tr.assignmentDate && (tr.status === 'COMPLETED' || tr.status === 'APPROVED' || tr.status === 'REJECTED')
        );

        const tiemposCompletado = solicitudesCompletadas.map(tr => {
          const fechaAsignacion = new Date(tr.assignmentDate!);
          const fechaCompletado = new Date(tr.completionDate || new Date());
          return differenceInDays(fechaCompletado, fechaAsignacion);
        });

        // Calcular porcentaje de solicitudes completadas a tiempo
        const solicitudesConFechaLimite = solicitudesCompletadas.filter(tr => tr.dueDate);
        const completadasATiempo = solicitudesConFechaLimite.filter(tr => {
          const fechaCompletado = new Date(tr.completionDate || new Date());
          const fechaLimite = new Date(tr.dueDate!);
          return fechaCompletado <= fechaLimite;
        });

        const porcentajeATiempo = solicitudesConFechaLimite.length > 0
          ? Math.round((completadasATiempo.length / solicitudesConFechaLimite.length) * 100)
          : 100;

        setTiemposRespuesta({
          tiempoPromedioAsignacion: tiemposAsignacion.length > 0
            ? tiemposAsignacion.reduce((sum, time) => sum + time, 0) / tiemposAsignacion.length
            : 0,
          tiempoPromedioCompletado: tiemposCompletado.length > 0
            ? tiemposCompletado.reduce((sum, time) => sum + time, 0) / tiemposCompletado.length
            : 0,
          tiempoPromedioAprobacion: 0, // No tenemos esta información por ahora
          solicitudesCompletadasATiempo: porcentajeATiempo,
          solicitudesRetrasadas: 100 - porcentajeATiempo
        });
      }
    }
  }, [solicitudesData]);

  // Calcular estadísticas
  const totalSolicitudes = solicitudes.length;
  const solicitudesPendientes = solicitudes.filter(s => s.estado === 'SUBMITTED').length;
  const solicitudesAsignadas = solicitudes.filter(s => s.estado === 'ASSIGNED' || s.estado === 'IN_PROGRESS').length;
  const solicitudesCompletadas = solicitudes.filter(s => s.estado === 'COMPLETED' || s.estado === 'APPROVED' || s.estado === 'REJECTED').length;

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

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Dashboard de Solicitudes</PageTitle>
        <Button $primary onClick={handleNuevaSolicitud}>
          <FiPlus size={16} />
          Nueva Solicitud
        </Button>
      </PageHeader>

      <StatsContainer>
        <StatCard>
          <StatTitle>
            <FiFileText size={16} />
            Total de Solicitudes
          </StatTitle>
          {isLoading ? (
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
            Tiempo Promedio de Asignación
          </StatTitle>
          {isLoading ? (
            <StatValue><Spinner size={16} /></StatValue>
          ) : (
            <>
              <StatValue>{tiemposRespuesta.tiempoPromedioAsignacion.toFixed(1)}</StatValue>
              <StatFooter>días</StatFooter>
            </>
          )}
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiClock size={16} />
            Tiempo Promedio de Completado
          </StatTitle>
          {isLoading ? (
            <StatValue><Spinner size={16} /></StatValue>
          ) : (
            <>
              <StatValue>{tiemposRespuesta.tiempoPromedioCompletado.toFixed(1)}</StatValue>
              <StatFooter>días</StatFooter>
            </>
          )}
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiCheckCircle size={16} />
            Solicitudes Completadas a Tiempo
          </StatTitle>
          {isLoading ? (
            <StatValue><Spinner size={16} /></StatValue>
          ) : (
            <>
              <StatValue>{tiemposRespuesta.solicitudesCompletadasATiempo}%</StatValue>
              <StatFooter>{tiemposRespuesta.solicitudesRetrasadas}% con retraso</StatFooter>
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

          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Spinner size={32} />
            </div>
          ) : error ? (
            <EmptyState>
              <FiAlertCircle size={48} />
              <h3>Error al cargar solicitudes</h3>
              <p>No se pudieron cargar las solicitudes. Intente nuevamente.</p>
              <Button $primary onClick={() => window.location.reload()}>
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
                      <StatusBadge $status={solicitud.estado}>
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
              <Button $primary onClick={handleNuevaSolicitud}>
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

          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Spinner size={32} />
            </div>
          ) : (
            <>
              <ProgressContainer>
                <ProgressHeader>
                  <ProgressLabel>Solicitadas</ProgressLabel>
                  <ProgressValue>{solicitudesPendientes} de {totalSolicitudes}</ProgressValue>
                </ProgressHeader>
                <ProgressBar>
                  <ProgressFill $percentage={totalSolicitudes > 0 ? (solicitudesPendientes / totalSolicitudes) * 100 : 0} />
                </ProgressBar>
              </ProgressContainer>

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

            {isLoading ? (
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

            {!isLoading && solicitudes.filter(s => s.fechaLimite && s.estado !== 'COMPLETED' && s.estado !== 'APPROVED' && s.estado !== 'REJECTED').length === 0 && (
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
