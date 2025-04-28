import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiArrowLeft,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiUser,
  FiCalendar,
  FiTag,
  FiFileText,
  FiMessageSquare,
  FiSend,
  FiPaperclip
} from 'react-icons/fi';
import { toast } from 'react-toastify';

// Datos de ejemplo para mostrar en la interfaz
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
    asignador: null,
    ejecutor: null,
    historial: [
      {
        fecha: '2025-05-01T10:30:00',
        estado: 'REQUESTED',
        usuario: 'Juan Pérez',
        comentario: 'Solicitud creada'
      }
    ],
    comentarios: []
  },
  {
    id: 3,
    titulo: 'Preparación de presentación para audiencia',
    descripcion: 'Necesito una presentación para la audiencia del caso #67890 que resuma los puntos principales.',
    categoria: 'LEGAL',
    prioridad: 'CRITICAL',
    fechaCreacion: '2025-04-25T09:45:00',
    fechaLimite: '2025-05-05',
    estado: 'IN_PROGRESS',
    asignador: 'Carlos Rodríguez',
    ejecutor: 'Luis Sánchez',
    historial: [
      {
        fecha: '2025-04-25T09:45:00',
        estado: 'REQUESTED',
        usuario: 'Juan Pérez',
        comentario: 'Solicitud creada'
      },
      {
        fecha: '2025-04-26T11:20:00',
        estado: 'ASSIGNED',
        usuario: 'Carlos Rodríguez',
        comentario: 'Asignada a Luis Sánchez'
      },
      {
        fecha: '2025-04-27T08:30:00',
        estado: 'IN_PROGRESS',
        usuario: 'Luis Sánchez',
        comentario: 'Iniciando trabajo en la presentación'
      }
    ],
    comentarios: [
      {
        id: 1,
        fecha: '2025-04-27T14:30:00',
        usuario: 'Luis Sánchez',
        mensaje: '¿Podría proporcionar más detalles sobre los puntos específicos que desea incluir en la presentación?'
      },
      {
        id: 2,
        fecha: '2025-04-27T15:45:00',
        usuario: 'Juan Pérez',
        mensaje: 'Necesito que se incluyan los antecedentes del caso, los argumentos principales de la defensa y las pruebas disponibles.'
      },
      {
        id: 3,
        fecha: '2025-04-28T09:15:00',
        usuario: 'Luis Sánchez',
        mensaje: 'Entendido. Estoy trabajando en ello y le enviaré un borrador para su revisión antes de la fecha límite.'
      }
    ]
  }
];

const PageContainer = styled.div`
  padding: 0;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 8px;
  margin-right: 16px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SideContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: ${({ theme }) => theme.textSecondary};
  flex-shrink: 0;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 4px;
`;

const DetailValue = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;

  ${({ $status, theme }) => {
    switch ($status) {
      case 'REQUESTED':
        return `
          background-color: ${theme.infoLight};
          color: ${theme.info};
        `;
      case 'ASSIGNED':
        return `
          background-color: ${theme.warningLight};
          color: ${theme.warning};
        `;
      case 'IN_PROGRESS':
        return `
          background-color: ${theme.primaryLight};
          color: ${theme.primary};
        `;
      case 'COMPLETED':
        return `
          background-color: ${theme.successLight};
          color: ${theme.success};
        `;
      case 'APPROVED':
        return `
          background-color: ${theme.successLight};
          color: ${theme.success};
        `;
      case 'REJECTED':
        return `
          background-color: ${theme.errorLight};
          color: ${theme.error};
        `;
      default:
        return `
          background-color: ${theme.backgroundHover};
          color: ${theme.textSecondary};
        `;
    }
  }}
`;

const PriorityBadge = styled.span<{ $priority: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  ${({ $priority, theme }) => {
    switch ($priority) {
      case 'CRITICAL':
        return `
          background-color: ${theme.errorLight};
          color: ${theme.error};
        `;
      case 'HIGH':
        return `
          background-color: ${theme.warningLight};
          color: ${theme.warning};
        `;
      case 'MEDIUM':
        return `
          background-color: ${theme.infoLight};
          color: ${theme.info};
        `;
      case 'LOW':
        return `
          background-color: ${theme.successLight};
          color: ${theme.success};
        `;
      case 'TRIVIAL':
        return `
          background-color: ${theme.backgroundHover};
          color: ${theme.textSecondary};
        `;
      default:
        return `
          background-color: ${theme.backgroundHover};
          color: ${theme.textSecondary};
        `;
    }
  }}
`;

const Timeline = styled.div`
  position: relative;
  padding-left: 24px;

  &::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: ${({ theme }) => theme.border};
  }
`;

const TimelineItem = styled.div`
  position: relative;
  padding-bottom: 24px;

  &:last-child {
    padding-bottom: 0;
  }
`;

const TimelineDot = styled.div<{ $status: string }>`
  position: absolute;
  left: -24px;
  top: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $status, theme }) => {
    switch ($status) {
      case 'REQUESTED':
        return `
          background-color: ${theme.info};
          color: white;
        `;
      case 'ASSIGNED':
        return `
          background-color: ${theme.warning};
          color: white;
        `;
      case 'IN_PROGRESS':
        return `
          background-color: ${theme.primary};
          color: white;
        `;
      case 'COMPLETED':
        return `
          background-color: ${theme.success};
          color: white;
        `;
      case 'APPROVED':
        return `
          background-color: ${theme.success};
          color: white;
        `;
      case 'REJECTED':
        return `
          background-color: ${theme.error};
          color: white;
        `;
      default:
        return `
          background-color: ${theme.textSecondary};
          color: white;
        `;
    }
  }}
`;

const TimelineContent = styled.div`
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 8px;
  padding: 12px 16px;
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const TimelineTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const TimelineDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const TimelineBody = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 12px;
`;

const CommentAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme }) => `${theme.primary}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
  flex-shrink: 0;
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const CommentAuthor = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const CommentDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const CommentText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.backgroundAlt};
  padding: 12px;
  border-radius: 8px;
`;

const CommentForm = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundTertiary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}30`};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AttachButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const SendButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.border};
    cursor: not-allowed;
  }
`;

// Función para formatear fechas
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Función para formatear fechas con hora
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Función para obtener el texto de estado
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

// Función para obtener el icono de estado
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

// Función para obtener el texto de prioridad
const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'CRITICAL':
      return 'Crítica';
    case 'HIGH':
      return 'Alta';
    case 'MEDIUM':
      return 'Media';
    case 'LOW':
      return 'Baja';
    case 'TRIVIAL':
      return 'Trivial';
    default:
      return priority;
  }
};

// Función para obtener el texto de categoría
const getCategoryText = (category: string) => {
  switch (category) {
    case 'ADMINISTRATIVA':
      return 'Administrativa';
    case 'LEGAL':
      return 'Legal';
    case 'TECNICA':
      return 'Técnica';
    case 'FINANCIERA':
      return 'Financiera';
    case 'RECURSOS_HUMANOS':
      return 'Recursos Humanos';
    case 'OTRA':
      return 'Otra';
    default:
      return category;
  }
};

const SeguimientoSolicitud: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    // Simulamos la carga de datos
    setLoading(true);
    setTimeout(() => {
      const solicitudEncontrada = MOCK_SOLICITUDES.find(s => s.id === Number(id));
      if (solicitudEncontrada) {
        setSolicitud(solicitudEncontrada);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSubmitComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    // Simulamos el envío del comentario
    const nuevoComentario = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      usuario: 'Juan Pérez',
      mensaje: comentario
    };

    // Actualizamos el estado local
    setSolicitud({
      ...solicitud,
      comentarios: [...solicitud.comentarios, nuevoComentario]
    });

    // Limpiamos el formulario
    setComentario('');

    // Mostramos notificación
    toast.success('Comentario enviado correctamente');
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!solicitud) {
    return (
      <PageContainer>
        <PageHeader>
          <BackButton onClick={() => navigate('/app/solicitudes')}>
            <FiArrowLeft size={20} />
          </BackButton>
          <PageTitle>Solicitud no encontrada</PageTitle>
        </PageHeader>
        <div>No se encontró la solicitud con ID {id}</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate('/app/solicitudes')}>
          <FiArrowLeft size={20} />
        </BackButton>
        <PageTitle>Seguimiento de Solicitud</PageTitle>
      </PageHeader>

      <ContentContainer>
        <MainContent>
          <Card>
            <CardHeader>
              <CardTitle>
                <FiFileText size={18} />
                Detalles de la Solicitud
              </CardTitle>
              <StatusBadge $status={solicitud.estado}>
                {getStatusIcon(solicitud.estado)}
                {getStatusText(solicitud.estado)}
              </StatusBadge>
            </CardHeader>
            <CardContent>
              <h3 style={{ marginTop: 0 }}>{solicitud.titulo}</h3>
              <p>{solicitud.descripcion}</p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <PriorityBadge $priority={solicitud.prioridad}>
                  {getPriorityText(solicitud.prioridad)}
                </PriorityBadge>
                <span style={{ color: '#666' }}>
                  Categoría: {getCategoryText(solicitud.categoria)}
                </span>
              </div>

              <DetailItem>
                <DetailIcon>
                  <FiCalendar size={18} />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Fecha de creación</DetailLabel>
                  <DetailValue>{formatDateTime(solicitud.fechaCreacion)}</DetailValue>
                </DetailContent>
              </DetailItem>

              <DetailItem>
                <DetailIcon>
                  <FiClock size={18} />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Fecha límite</DetailLabel>
                  <DetailValue>{formatDate(solicitud.fechaLimite)}</DetailValue>
                </DetailContent>
              </DetailItem>

              {solicitud.asignador && (
                <DetailItem>
                  <DetailIcon>
                    <FiUser size={18} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Asignador</DetailLabel>
                    <DetailValue>{solicitud.asignador}</DetailValue>
                  </DetailContent>
                </DetailItem>
              )}

              {solicitud.ejecutor && (
                <DetailItem>
                  <DetailIcon>
                    <FiUser size={18} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Ejecutor</DetailLabel>
                    <DetailValue>{solicitud.ejecutor}</DetailValue>
                  </DetailContent>
                </DetailItem>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <FiMessageSquare size={18} />
                Comentarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              {solicitud.comentarios && solicitud.comentarios.length > 0 ? (
                <CommentsList>
                  {solicitud.comentarios.map((comment: any) => (
                    <CommentItem key={comment.id}>
                      <CommentAvatar>
                        <FiUser size={18} />
                      </CommentAvatar>
                      <CommentContent>
                        <CommentHeader>
                          <CommentAuthor>{comment.usuario}</CommentAuthor>
                          <CommentDate>{formatDateTime(comment.fecha)}</CommentDate>
                        </CommentHeader>
                        <CommentText>{comment.mensaje}</CommentText>
                      </CommentContent>
                    </CommentItem>
                  ))}
                </CommentsList>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#666' }}>
                  No hay comentarios aún
                </div>
              )}

              <CommentForm onSubmit={handleSubmitComentario}>
                <CommentInput
                  placeholder="Escribe un comentario..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
                <ButtonGroup>
                  <AttachButton type="button">
                    <FiPaperclip size={16} />
                    Adjuntar archivo
                  </AttachButton>
                  <SendButton type="submit" disabled={!comentario.trim()}>
                    <FiSend size={16} />
                    Enviar
                  </SendButton>
                </ButtonGroup>
              </CommentForm>
            </CardContent>
          </Card>
        </MainContent>

        <SideContent>
          <Card>
            <CardHeader>
              <CardTitle>
                <FiClock size={18} />
                Historial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline>
                {solicitud.historial.map((item: any, index: number) => (
                  <TimelineItem key={index}>
                    <TimelineDot $status={item.estado}>
                      {getStatusIcon(item.estado)}
                    </TimelineDot>
                    <TimelineContent>
                      <TimelineHeader>
                        <TimelineTitle>{getStatusText(item.estado)}</TimelineTitle>
                        <TimelineDate>{formatDateTime(item.fecha)}</TimelineDate>
                      </TimelineHeader>
                      <TimelineBody>
                        <div style={{ marginBottom: '4px' }}>
                          <strong>{item.usuario}</strong>
                        </div>
                        {item.comentario}
                      </TimelineBody>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </SideContent>
      </ContentContainer>
    </PageContainer>
  );
};

export default SeguimientoSolicitud;
