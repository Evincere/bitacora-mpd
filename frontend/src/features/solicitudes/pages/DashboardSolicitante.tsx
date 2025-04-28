import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
  FiSend
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Componentes
import { StatusBadge } from '@/shared/components/ui';
import { Button } from '@/components/ui';

// Tipos
import { Activity, ActivityStatus } from '@/types/models';

// Servicios y hooks
// TODO: Implementar servicio y hooks para solicitudes

// Datos de ejemplo (se reemplazarán por datos reales del backend)
const MOCK_SOLICITUDES = [
  {
    id: 1,
    titulo: 'Solicitud de informe técnico',
    descripcion: 'Necesito un informe técnico sobre el caso #12345 para presentar en la audiencia del próximo mes.',
    categoria: 'LEGAL',
    prioridad: 'HIGH',
    fechaCreacion: '2025-05-01T10:30:00',
    fechaLimite: '2025-05-15',
    estado: 'REQUESTED',
    solicitante: 'Juan Pérez',
    asignador: null,
    ejecutor: null
  },
  {
    id: 2,
    titulo: 'Análisis de documentación',
    descripcion: 'Requiero un análisis detallado de la documentación presentada por la contraparte en el caso #54321.',
    categoria: 'LEGAL',
    prioridad: 'MEDIUM',
    fechaCreacion: '2025-04-28T14:15:00',
    fechaLimite: '2025-05-10',
    estado: 'ASSIGNED',
    solicitante: 'Juan Pérez',
    asignador: 'Carlos Rodríguez',
    ejecutor: 'Ana Martínez'
  },
  {
    id: 3,
    titulo: 'Revisión de contrato',
    descripcion: 'Necesito una revisión del contrato de arrendamiento para el local comercial.',
    categoria: 'LEGAL',
    prioridad: 'LOW',
    fechaCreacion: '2025-04-25T09:45:00',
    fechaLimite: '2025-05-05',
    estado: 'IN_PROGRESS',
    solicitante: 'Juan Pérez',
    asignador: 'Carlos Rodríguez',
    ejecutor: 'Luis Sánchez'
  },
  {
    id: 4,
    titulo: 'Preparación de presentación',
    descripcion: 'Requiero una presentación para la reunión con el cliente del próximo viernes.',
    categoria: 'ADMINISTRATIVA',
    prioridad: 'HIGH',
    fechaCreacion: '2025-04-20T11:00:00',
    fechaLimite: '2025-04-30',
    estado: 'COMPLETED',
    solicitante: 'Juan Pérez',
    asignador: 'Carlos Rodríguez',
    ejecutor: 'María López'
  },
  {
    id: 5,
    titulo: 'Análisis financiero',
    descripcion: 'Necesito un análisis financiero de la empresa para la reunión con inversores.',
    categoria: 'FINANCIERA',
    prioridad: 'CRITICAL',
    fechaCreacion: '2025-04-15T16:30:00',
    fechaLimite: '2025-04-25',
    estado: 'APPROVED',
    solicitante: 'Juan Pérez',
    asignador: 'Carlos Rodríguez',
    ejecutor: 'Pedro Gómez'
  }
];

// Datos de ejemplo para tiempos de respuesta
const MOCK_TIEMPOS_RESPUESTA = {
  tiempoPromedioAsignacion: 1.5, // días
  tiempoPromedioCompletado: 4.2, // días
  tiempoPromedioAprobacion: 0.8, // días
  solicitudesCompletadasATiempo: 85, // porcentaje
  solicitudesRetrasadas: 15 // porcentaje
};

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

  // Estado para almacenar las solicitudes
  const [solicitudes, setSolicitudes] = useState<any[]>(MOCK_SOLICITUDES);

  // Calcular estadísticas
  const totalSolicitudes = solicitudes.length;
  const solicitudesPendientes = solicitudes.filter(s => s.estado === 'REQUESTED').length;
  const solicitudesAsignadas = solicitudes.filter(s => s.estado === 'ASSIGNED' || s.estado === 'IN_PROGRESS').length;
  const solicitudesCompletadas = solicitudes.filter(s => s.estado === 'COMPLETED' || s.estado === 'APPROVED' || s.estado === 'REJECTED').length;

  // Ordenar solicitudes por fecha de creación (más recientes primero)
  const solicitudesRecientes = [...solicitudes]
    .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
    .slice(0, 5);

  // TODO: Implementar consulta real al backend
  // const { data, isLoading, error } = useQuery(['solicitudes'], fetchSolicitudes);

  // useEffect(() => {
  //   if (data) {
  //     setSolicitudes(data);
  //   }
  // }, [data]);

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
          <StatValue>{totalSolicitudes}</StatValue>
          <StatFooter>
            {solicitudesPendientes} pendientes, {solicitudesAsignadas} en proceso
          </StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiClock size={16} />
            Tiempo Promedio de Asignación
          </StatTitle>
          <StatValue>{MOCK_TIEMPOS_RESPUESTA.tiempoPromedioAsignacion.toFixed(1)}</StatValue>
          <StatFooter>días</StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiClock size={16} />
            Tiempo Promedio de Completado
          </StatTitle>
          <StatValue>{MOCK_TIEMPOS_RESPUESTA.tiempoPromedioCompletado.toFixed(1)}</StatValue>
          <StatFooter>días</StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiCheckCircle size={16} />
            Solicitudes Completadas a Tiempo
          </StatTitle>
          <StatValue>{MOCK_TIEMPOS_RESPUESTA.solicitudesCompletadasATiempo}%</StatValue>
          <StatFooter>{MOCK_TIEMPOS_RESPUESTA.solicitudesRetrasadas}% con retraso</StatFooter>
        </StatCard>
      </StatsContainer>

      <ContentGrid>
        <ContentSection>
          <SectionTitle>
            <FiFileText size={18} />
            Solicitudes Recientes
          </SectionTitle>
          
          {solicitudesRecientes.length > 0 ? (
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
          
          <ProgressContainer>
            <ProgressHeader>
              <ProgressLabel>Solicitadas</ProgressLabel>
              <ProgressValue>{solicitudesPendientes} de {totalSolicitudes}</ProgressValue>
            </ProgressHeader>
            <ProgressBar>
              <ProgressFill $percentage={(solicitudesPendientes / totalSolicitudes) * 100} />
            </ProgressBar>
          </ProgressContainer>
          
          <ProgressContainer>
            <ProgressHeader>
              <ProgressLabel>En Proceso</ProgressLabel>
              <ProgressValue>{solicitudesAsignadas} de {totalSolicitudes}</ProgressValue>
            </ProgressHeader>
            <ProgressBar>
              <ProgressFill $percentage={(solicitudesAsignadas / totalSolicitudes) * 100} />
            </ProgressBar>
          </ProgressContainer>
          
          <ProgressContainer>
            <ProgressHeader>
              <ProgressLabel>Completadas</ProgressLabel>
              <ProgressValue>{solicitudesCompletadas} de {totalSolicitudes}</ProgressValue>
            </ProgressHeader>
            <ProgressBar>
              <ProgressFill $percentage={(solicitudesCompletadas / totalSolicitudes) * 100} />
            </ProgressBar>
          </ProgressContainer>
          
          <div style={{ marginTop: '24px' }}>
            <SectionTitle>
              <FiClock size={18} />
              Próximas Fechas Límite
            </SectionTitle>
            
            {solicitudes
              .filter(s => s.estado !== 'COMPLETED' && s.estado !== 'APPROVED' && s.estado !== 'REJECTED')
              .sort((a, b) => new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime())
              .slice(0, 3)
              .map((solicitud) => (
                <SolicitudItem key={solicitud.id} onClick={() => handleVerSolicitud(solicitud.id)}>
                  <SolicitudHeader>
                    <SolicitudTitle>{solicitud.titulo}</SolicitudTitle>
                    <SolicitudDate>
                      <FiCalendar size={12} />
                      {formatDate(solicitud.fechaLimite)}
                    </SolicitudDate>
                  </SolicitudHeader>
                </SolicitudItem>
              ))}
          </div>
        </ContentSection>
      </ContentGrid>
    </PageContainer>
  );
};

export default DashboardSolicitante;
