import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiUser,
  FiCalendar,
  FiFlag,
  FiFileText,
  FiMessageSquare,
  FiAlertCircle,
  FiInfo,
  FiArrowLeft,
  FiCheck,
  FiLoader,
  FiEdit,
  FiDownload
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Hooks y servicios
import { api } from '@/core/api/api';
import { useAuth } from '@/core/hooks/useAuth';
import useComments from '@/features/comentarios/hooks/useComments';

// Componentes
import CommentSection from '@/features/comentarios/components/CommentSection';

// Tipos
import { Activity, ActivityStatus } from '@/types/models';

// Estilos
const PageContainer = styled.div`
  padding: 0;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ContentSection = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TareaDetails = styled.div`
  margin-bottom: 24px;
`;

const TareaHeader = styled.div`
  margin-bottom: 16px;
`;

const TareaTitle = styled.h3`
  font-size: 20px;
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.text};
`;

const TareaMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const TareaDescription = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.text};
  white-space: pre-wrap;
  margin-bottom: 24px;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;

  ${({ $status, theme }) => {
    switch ($status) {
      case 'REQUESTED':
        return `
          background-color: #E3F2FD;
          color: #0D47A1;
          border: 1px solid #2196F3;
        `;
      case 'SUBMITTED':
        return `
          background-color: #E8F5E9;
          color: #1B5E20;
          border: 1px solid #4CAF50;
        `;
      case 'ASSIGNED':
        return `
          background-color: #FFF8E1;
          color: #E65100;
          border: 1px solid #FFC107;
        `;
      case 'IN_PROGRESS':
        return `
          background-color: #EDE7F6;
          color: #4527A0;
          border: 1px solid #673AB7;
        `;
      case 'COMPLETED':
        return `
          background-color: #E8F5E9;
          color: #1B5E20;
          border: 1px solid #4CAF50;
        `;
      case 'APPROVED':
        return `
          background-color: #E8F5E9;
          color: #1B5E20;
          border: 1px solid #4CAF50;
        `;
      case 'REJECTED':
        return `
          background-color: #FFEBEE;
          color: #B71C1C;
          border: 1px solid #F44336;
        `;
      default:
        return `
          background-color: #ECEFF1;
          color: #263238;
          border: 1px solid #607D8B;
        `;
    }
  }}
`;

const PriorityBadge = styled.span<{ $priority: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;

  ${({ $priority, theme }) => {
    switch ($priority) {
      case 'CRITICAL':
        return `
          background-color: #FFEBEE;
          color: #B71C1C;
          border: 1px solid #F44336;
        `;
      case 'HIGH':
        return `
          background-color: #FFF3E0;
          color: #E65100;
          border: 1px solid #FF9800;
        `;
      case 'MEDIUM':
        return `
          background-color: #E3F2FD;
          color: #0D47A1;
          border: 1px solid #2196F3;
        `;
      case 'LOW':
        return `
          background-color: #E8F5E9;
          color: #1B5E20;
          border: 1px solid #4CAF50;
        `;
      case 'TRIVIAL':
        return `
          background-color: #ECEFF1;
          color: #263238;
          border: 1px solid #607D8B;
        `;
      default:
        return `
          background-color: #ECEFF1;
          color: #263238;
          border: 1px solid #607D8B;
        `;
    }
  }}
`;

const AttachmentsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
`;

const AttachmentItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    border-color: ${({ theme }) => theme.border};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  a {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    width: 100%;
    padding: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.border};
    cursor: not-allowed;
  }
`;

const ActionButtonSecondary = styled(ActionButton)`
  background-color: transparent;
  color: ${({ theme }) => theme.textSecondary};
  border: 1px solid ${({ theme }) => theme.border};

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
    transform: translateY(-1px);
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: flex-end;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  text-align: center;

  h3 {
    margin: 16px 0 8px 0;
    color: ${({ theme }) => theme.text};
  }

  p {
    color: ${({ theme }) => theme.textSecondary};
    margin: 0;
  }

  svg {
    color: ${({ theme }) => theme.primary};
    animation: spin 2s linear infinite;

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
`;

// Funciones auxiliares
const formatDate = (dateString?: string) => {
  if (!dateString) return 'No especificada';

  try {
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
  } catch (error) {
    return dateString;
  }
};

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

const getStatusText = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return 'Solicitada';
    case 'SUBMITTED':
      return 'Enviada';
    case 'ASSIGNED':
      return 'Asignada';
    case 'IN_PROGRESS':
      return 'En progreso';
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
      return <FiInfo size={14} />;
    case 'SUBMITTED':
      return <FiCheck size={14} />;
    case 'ASSIGNED':
      return <FiUser size={14} />;
    case 'IN_PROGRESS':
      return <FiLoader size={14} />;
    case 'COMPLETED':
      return <FiCheck size={14} />;
    case 'APPROVED':
      return <FiCheck size={14} />;
    case 'REJECTED':
      return <FiAlertCircle size={14} />;
    default:
      return <FiInfo size={14} />;
  }
};

// Componente principal
const DetalleTarea: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const activityId = parseInt(id || '0');
  const auth = useAuth();
  const currentUser = auth?.user || { id: 0 };

  // Estado para almacenar los detalles de la tarea
  const [tarea, setTarea] = useState<Activity | null>(null);
  const [isLoadingTarea, setIsLoadingTarea] = useState(true);

  // Usar el hook personalizado para comentarios
  const {
    comments,
    isLoading: isLoadingComments,
    addComment,
    editComment,
    deleteComment,
    markAsRead,
    refetch: refetchComments
  } = useComments({
    taskId: activityId,
    onAddSuccess: () => {
      toast.success('Comentario agregado correctamente');
      // Refrescar los comentarios después de agregar uno nuevo
      setTimeout(() => refetchComments(), 500);
    }
  });

  // Refrescar los comentarios cuando cambia la tarea
  useEffect(() => {
    if (tarea) {
      refetchComments();
    }
  }, [tarea, refetchComments]);

  // Cargar los detalles de la tarea
  useEffect(() => {
    const fetchTarea = async () => {
      if (!activityId) return;

      try {
        setIsLoadingTarea(true);

        // Primero intentamos cargar como una solicitud de tarea (TaskRequest)
        try {
          console.log(`Intentando cargar solicitud de tarea con ID: ${activityId}`);
          const taskResponse = await api.get(`task-requests/${activityId}`).json();
          console.log('Datos de solicitud de tarea cargados:', taskResponse);

          // Mapear TaskRequest a Activity para mantener la compatibilidad
          const mappedTask: Activity = {
            id: taskResponse.id,
            title: taskResponse.title,
            description: taskResponse.description,
            status: taskResponse.status,
            priority: taskResponse.priority,
            category: taskResponse.category?.name,
            requesterId: taskResponse.requesterId,
            requesterName: taskResponse.requesterName,
            executorId: taskResponse.executorId,
            executorName: taskResponse.executorName,
            assignerId: taskResponse.assignerId,
            assignerName: taskResponse.assignerName,
            requestDate: taskResponse.requestDate,
            dueDate: taskResponse.dueDate,
            createdAt: taskResponse.requestDate,
            updatedAt: null
          };

          console.log('Datos mapeados de solicitud a actividad:', mappedTask);
          setTarea(mappedTask);

          // Cargar comentarios específicamente para esta solicitud
          try {
            console.log(`Cargando comentarios para la solicitud ${activityId}...`);
            const solicitudesService = await import('@/features/solicitudes/services/solicitudesService').then(m => m.default);
            const commentsResponse = await solicitudesService.getCommentsWithReadStatus(activityId);
            console.log('Comentarios cargados directamente:', commentsResponse);
          } catch (commentsError) {
            console.warn('Error al cargar comentarios directamente:', commentsError);
          }

        } catch (taskError) {
          console.warn('No se pudo cargar como solicitud de tarea, intentando cargar como actividad:', taskError);

          // Si falla, intentamos cargar como una actividad (Activity)
          try {
            const response = await api.get(`activities/${activityId}`).json<Activity>();
            console.log('Datos de actividad cargados:', response);
            setTarea(response);
          } catch (activityError) {
            console.error('Error al cargar como actividad:', activityError);
            throw activityError; // Propagar el error para que se maneje en el catch general
          }
        }
      } catch (error) {
        console.error('Error al cargar la tarea:', error);
        toast.error('Error al cargar los detalles de la tarea');
      } finally {
        setIsLoadingTarea(false);
      }
    };

    fetchTarea();
  }, [activityId]);

  // Manejar la edición de la tarea
  const handleEditarTarea = () => {
    navigate(`/app/asignacion/editar/${activityId}`);
  };

  // Manejar la reasignación de la tarea
  const handleReasignarTarea = () => {
    navigate(`/app/asignacion/reasignar/${activityId}`);
  };

  if (isLoadingTarea) {
    return (
      <LoadingContainer>
        <FiLoader size={48} />
        <h3>Cargando tarea</h3>
        <p>Por favor, espere mientras se cargan los detalles de la tarea.</p>
      </LoadingContainer>
    );
  }

  if (!tarea) {
    return (
      <LoadingContainer>
        <FiAlertCircle size={48} />
        <h3>Tarea no encontrada</h3>
        <p>No se pudo encontrar la tarea con el ID especificado.</p>
        <ActionButton onClick={() => navigate('/app/asignacion/dashboard')} style={{ marginTop: '16px' }}>
          <FiArrowLeft size={16} />
          Volver al dashboard
        </ActionButton>
      </LoadingContainer>
    );
  }

  // Determinar si es una tarea de tipo Activity o TaskRequest
  const isTaskRequest = tarea && (tarea.status === 'REQUESTED' || tarea.status === 'SUBMITTED' || tarea.status === 'ASSIGNED');

  console.log('Tipo de tarea detectado:', isTaskRequest ? 'TaskRequest' : 'Activity');
  console.log('Datos de tarea completos:', tarea);

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate('/app/asignacion/dashboard')}>
          <FiArrowLeft size={20} />
        </BackButton>
        <PageTitle>Detalle de {isTaskRequest ? 'Solicitud' : 'Tarea'}</PageTitle>
      </PageHeader>

      <ContentGrid>
        <ContentSection>
          <TareaDetails>
            <TareaHeader>
              <TareaTitle>{tarea.title}</TareaTitle>
              <StatusBadge $status={tarea.status || 'REQUESTED'}>
                {getStatusIcon(tarea.status || 'REQUESTED')}
                {getStatusText(tarea.status || 'REQUESTED')}
              </StatusBadge>
            </TareaHeader>

            <TareaMeta>
              <MetaItem>
                <FiUser size={16} />
                Solicitante: {tarea.requesterName || (tarea.requesterId ? `Usuario #${tarea.requesterId}` : 'No especificado')}
              </MetaItem>
              <MetaItem>
                <FiUser size={16} />
                Ejecutor: {tarea.executorName || (tarea.executorId ? `Usuario #${tarea.executorId}` : 'No asignado')}
              </MetaItem>
              <MetaItem>
                <FiCalendar size={16} />
                Fecha de solicitud: {formatDate(tarea.requestDate || tarea.createdAt)}
              </MetaItem>
              <MetaItem>
                <FiCalendar size={16} />
                Fecha límite: {formatDate(tarea.dueDate)}
              </MetaItem>
              <MetaItem>
                <FiFlag size={16} />
                Prioridad: {getPriorityText(tarea.priority || 'MEDIUM')}
              </MetaItem>
              <MetaItem>
                <FiFileText size={16} />
                Categoría: {tarea.category || 'No especificada'}
              </MetaItem>
              {tarea.assignerId && (
                <MetaItem>
                  <FiUser size={16} />
                  Asignador: {tarea.assignerName || `ID: ${tarea.assignerId}`}
                </MetaItem>
              )}
            </TareaMeta>

            <SectionTitle>
              <FiFileText size={18} />
              Descripción
            </SectionTitle>
            <TareaDescription>
              {tarea.description || 'Sin descripción'}
            </TareaDescription>

            {tarea.attachments && tarea.attachments.length > 0 && (
              <>
                <SectionTitle>
                  <FiFileText size={18} />
                  Archivos adjuntos
                </SectionTitle>
                <AttachmentsList>
                  {tarea.attachments.map((attachment, index) => (
                    <AttachmentItem key={index} title="Haz clic para descargar el archivo">
                      <a
                        href={attachment.downloadUrl}
                        download={attachment.fileName}
                        onClick={(e) => {
                          e.preventDefault();
                          // Crear un enlace temporal para forzar la descarga
                          const link = document.createElement('a');
                          link.href = attachment.downloadUrl;
                          link.setAttribute('download', attachment.fileName);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          toast.success(`Descargando ${attachment.fileName}...`);
                        }}
                      >
                        <FiDownload size={16} />
                        {attachment.fileName} ({(attachment.fileSize / 1024).toFixed(1)} KB)
                      </a>
                    </AttachmentItem>
                  ))}
                </AttachmentsList>
              </>
            )}

            <ActionButtonsContainer>
              {/* Solo mostrar el botón de editar si la tarea no está asignada (SUBMITTED) */}
              {tarea.status === 'SUBMITTED' && (
                <ActionButtonSecondary onClick={handleEditarTarea}>
                  <FiEdit size={16} />
                  Editar {isTaskRequest ? 'solicitud' : 'tarea'}
                </ActionButtonSecondary>
              )}
              {/* Si la tarea está asignada, mostrar el botón deshabilitado con un tooltip */}
              {tarea.status !== 'SUBMITTED' && (
                <ActionButtonSecondary
                  style={{
                    opacity: 0.5,
                    cursor: 'not-allowed',
                    position: 'relative'
                  }}
                  title="No se puede editar una solicitud que ya ha sido asignada"
                >
                  <FiEdit size={16} />
                  Editar {isTaskRequest ? 'solicitud' : 'tarea'}
                </ActionButtonSecondary>
              )}
              {/* Solo mostrar el botón de reasignar si la tarea está en estado ASSIGNED */}
              {tarea.status === 'ASSIGNED' && (
                <ActionButton onClick={handleReasignarTarea}>
                  <FiUser size={16} />
                  Reasignar
                </ActionButton>
              )}
              {/* Si la tarea no está en estado ASSIGNED, mostrar el botón deshabilitado con un tooltip */}
              {tarea.status !== 'ASSIGNED' && (
                <ActionButton
                  style={{
                    opacity: 0.5,
                    cursor: 'not-allowed',
                    position: 'relative'
                  }}
                  title="Solo se pueden reasignar tareas en estado ASSIGNED"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Solo se pueden reasignar tareas en estado ASSIGNED');
                  }}
                >
                  <FiUser size={16} />
                  Reasignar
                </ActionButton>
              )}
            </ActionButtonsContainer>
          </TareaDetails>
        </ContentSection>

        <ContentSection>
          <CommentSection
            comments={comments}
            isLoading={isLoadingComments}
            onAddComment={addComment}
            onEditComment={editComment}
            onDeleteComment={deleteComment}
            onMarkAsRead={markAsRead}
            currentUserId={currentUser?.id}
            placeholder="Escribe un comentario para el solicitante o el ejecutor..."
          />
        </ContentSection>
      </ContentGrid>
    </PageContainer>
  );
};

export default DetalleTarea;
