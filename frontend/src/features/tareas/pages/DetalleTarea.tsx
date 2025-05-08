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
  FiDownload,
  FiPlay,
  FiPause,
  FiShield
} from 'react-icons/fi';
import AddExecutePermission from '@/components/debug/AddExecutePermission';
import ConnectedUsers from '@/components/ui/Collaboration/ConnectedUsers';
import ActivityNotifications from '@/components/ui/Notifications/ActivityNotifications';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Hooks y servicios
import { api } from '@/core/api/api';
import { useAuth } from '@/core/hooks/useAuth';
import useComments from '@/features/comentarios/hooks/useComments';
import useTareas from '../hooks/useTareas';

// Componentes
import CommentSection from '@/features/comentarios/components/CommentSection';
import { Activity } from '@/types/models';

// Estilos
const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
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
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const ContentSection = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

const TareaDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TareaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

const TareaTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.text};
  flex: 1;
`;

const StatusBadge = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  ${({ $status, theme }) => {
    switch ($status) {
      case 'REQUESTED':
        return `
          background-color: ${theme.info}20;
          color: ${theme.info};
          border: 1px solid ${theme.info}40;
        `;
      case 'SUBMITTED':
        return `
          background-color: ${theme.info}20;
          color: ${theme.info};
          border: 1px solid ${theme.info}40;
        `;
      case 'ASSIGNED':
        return `
          background-color: ${theme.warning}20;
          color: ${theme.warning};
          border: 1px solid ${theme.warning}40;
        `;
      case 'IN_PROGRESS':
        return `
          background-color: ${theme.primary}20;
          color: ${theme.primary};
          border: 1px solid ${theme.primary}40;
        `;
      case 'COMPLETED':
        return `
          background-color: ${theme.success}20;
          color: ${theme.success};
          border: 1px solid ${theme.success}40;
        `;
      case 'APPROVED':
        return `
          background-color: ${theme.success}20;
          color: ${theme.success};
          border: 1px solid ${theme.success}40;
        `;
      case 'REJECTED':
        return `
          background-color: ${theme.error}20;
          color: ${theme.error};
          border: 1px solid ${theme.error}40;
        `;
      default:
        return `
          background-color: ${theme.backgroundAlt};
          color: ${theme.textSecondary};
          border: 1px solid ${theme.border};
        `;
    }
  }}
`;

const TareaMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;

  svg {
    color: ${({ theme }) => theme.textTertiary};
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0 8px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const TareaDescription = styled.div`
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const AttachmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 4px;
  font-size: 14px;

  a {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;

  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ActionButtonSecondary = styled(ActionButton)`
  background-color: transparent;
  color: ${({ theme }) => theme.textSecondary};
  border: 1px solid ${({ theme }) => theme.border};

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;

  h3 {
    margin: 16px 0 8px;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.textSecondary};
  }

  svg {
    color: ${({ theme }) => theme.primary};
    animation: ${({ theme }) => theme.name === 'dark' ? 'spin 1s linear infinite' : 'none'};

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
`;

// Función para formatear fechas
const formatDate = (dateString?: string) => {
  if (!dateString) return 'No especificada';

  try {
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
  } catch (error) {
    return dateString;
  }
};

// Función para obtener el texto de estado
const getStatusText = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return 'Solicitada';
    case 'SUBMITTED':
      return 'Enviada';
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
    case 'SUBMITTED':
      return <FiInfo size={14} />;
    case 'ASSIGNED':
      return <FiUser size={14} />;
    case 'IN_PROGRESS':
      return <FiPlay size={14} />;
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

  // Usar el hook personalizado para tareas
  const {
    startTask,
    completeTask,
    isStartingTask,
    isCompletingTask
  } = useTareas();

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
          const response = await api.get(`task-requests/${activityId}`).json<Activity>();
          console.log('Datos de solicitud cargados:', response);

          // Mapear los datos de TaskRequest a Activity para mantener consistencia
          const mappedTask: Activity = {
            id: response.id,
            title: response.title,
            description: response.description,
            category: response.category?.name || '',
            priority: response.priority,
            status: response.status,
            dueDate: response.dueDate,
            requestDate: response.requestDate,
            requesterName: response.requesterName,
            assignerId: response.assignerId,
            assignerName: response.assignerName,
            executorId: response.executorId,
            executorName: response.executorName,
            createdAt: response.requestDate,
            updatedAt: response.updatedAt || response.requestDate,
            attachments: response.attachments || []
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

  // Manejar el inicio de la tarea
  const handleIniciarTarea = () => {
    if (!activityId) return;

    startTask(activityId, {
      onSuccess: () => {
        toast.success('Tarea iniciada correctamente');
        // Recargar los detalles de la tarea
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      onError: (error) => {
        console.error('Error al iniciar la tarea:', error);
        toast.error('Error al iniciar la tarea. Inténtelo de nuevo.');
      }
    });
  };

  // Manejar la finalización de la tarea
  const handleCompletarTarea = () => {
    if (!activityId) return;

    completeTask({
      activityId,
      result: 'Tarea completada satisfactoriamente',
      actualHours: 1 // Valor por defecto para las horas reales
    }, {
      onSuccess: () => {
        toast.success('Tarea completada correctamente');
        // Recargar los detalles de la tarea
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      onError: (error) => {
        console.error('Error al completar la tarea:', error);
        toast.error('Error al completar la tarea. Inténtelo de nuevo.');
      }
    });
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
        <ActionButton onClick={() => navigate('/app/tareas/asignadas')} style={{ marginTop: '16px' }}>
          <FiArrowLeft size={16} />
          Volver a mis tareas
        </ActionButton>
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate('/app/tareas/asignadas')}>
          <FiArrowLeft size={20} />
        </BackButton>
        <PageTitle>Detalle de Tarea</PageTitle>
      </PageHeader>

      <ContentGrid>
        <ContentSection>
          <TareaDetails>
            <TareaHeader>
              <TareaTitle>{tarea.title}</TareaTitle>
              <StatusBadge $status={tarea.status || 'ASSIGNED'}>
                {getStatusIcon(tarea.status || 'ASSIGNED')}
                {getStatusText(tarea.status || 'ASSIGNED')}
              </StatusBadge>
            </TareaHeader>

            <TareaMeta>
              <MetaItem>
                <FiUser size={16} />
                Solicitante: {tarea.requesterName || 'No especificado'}
              </MetaItem>
              <MetaItem>
                <FiUser size={16} />
                Asignador: {tarea.assignerName || 'No especificado'}
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
                    <AttachmentItem key={index}>
                      <a href={attachment.downloadUrl} target="_blank" rel="noopener noreferrer">
                        <FiDownload size={16} />
                        {attachment.fileName} ({(attachment.fileSize / 1024).toFixed(1)} KB)
                      </a>
                    </AttachmentItem>
                  ))}
                </AttachmentsList>
              </>
            )}

            <ActionButtonsContainer>
              {tarea.status === 'ASSIGNED' && (
                <ActionButton
                  onClick={handleIniciarTarea}
                  disabled={isStartingTask}
                >
                  {isStartingTask ? <FiLoader size={16} /> : <FiPlay size={16} />}
                  {isStartingTask ? 'Iniciando...' : 'Iniciar tarea'}
                </ActionButton>
              )}
              {tarea.status === 'IN_PROGRESS' && (
                <ActionButton
                  onClick={handleCompletarTarea}
                  disabled={isCompletingTask}
                >
                  {isCompletingTask ? <FiLoader size={16} /> : <FiCheck size={16} />}
                  {isCompletingTask ? 'Completando...' : 'Completar tarea'}
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
            placeholder="Escribe un comentario sobre esta tarea..."
          />
        </ContentSection>
      </ContentGrid>

      {/* Panel lateral con información adicional */}
      <SidePanel>
        {/* Componente para mostrar los usuarios conectados */}
        <ConnectedUsers refreshInterval={30000} />

        {/* Componente para mostrar las notificaciones de actividad */}
        <ActivityNotifications maxItems={5} />
      </SidePanel>

      {/* Componente para añadir el permiso EXECUTE_ACTIVITIES */}
      <AddExecutePermission />
    </PageContainer>
  );
};

export default DetalleTarea;
