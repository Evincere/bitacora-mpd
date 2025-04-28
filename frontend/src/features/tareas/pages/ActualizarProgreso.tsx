import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  FiClock
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Hooks y servicios
import useTareas from '../hooks/useTareas';
import { api } from '@/core/api/api';

// Tipos
import { Activity, ActivityStatus } from '@/types/models';

// Definición del esquema de validación con Zod
const progresoSchema = z.object({
  progress: z.number().min(0, 'El progreso no puede ser negativo').max(100, 'El progreso no puede ser mayor a 100'),
  notes: z.string().optional()
});

type ProgresoFormData = z.infer<typeof progresoSchema>;

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
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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

const TareaDetails = styled.div`
  margin-bottom: 24px;
`;

const TareaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const TareaTitle = styled.h2`
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
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const TareaDescription = styled.div`
  font-size: 15px;
  line-height: 1.5;
  color: ${({ theme }) => theme.text};
  margin-bottom: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  border-radius: 6px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundTertiary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}30`};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundTertiary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}30`};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $primary, theme }) =>
    $primary
      ? `
    background-color: ${theme.primary};
    color: white;
    border: none;

    &:hover {
      background-color: ${theme.primaryDark};
    }
  `
      : `
    background-color: transparent;
    color: ${theme.textSecondary};
    border: 1px solid ${theme.border};

    &:hover {
      background-color: ${theme.backgroundHover};
    }
  `}
`;

const InfoBox = styled.div`
  background-color: ${({ theme }) => `${theme.info}10`};
  border-left: 3px solid ${({ theme }) => theme.info};
  padding: 12px 16px;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  .icon {
    color: ${({ theme }) => theme.info};
    margin-top: 2px;
  }

  .content {
    flex: 1;

    h4 {
      margin: 0 0 4px;
      font-size: 14px;
      color: ${({ theme }) => theme.text};
    }

    p {
      margin: 0;
      font-size: 13px;
      color: ${({ theme }) => theme.textSecondary};
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;

  svg {
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 16px;
    animation: spin 1s linear infinite;
  }

  h3 {
    margin: 0 0 8px;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.textSecondary};
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ProgressContainer = styled.div`
  margin-bottom: 20px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ProgressLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const ProgressValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background-color: ${({ $color }) => $color};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const RangeInput = styled.input`
  width: 100%;
  margin: 16px 0;
  -webkit-appearance: none;
  appearance: none;
  height: 10px;
  border-radius: 5px;
  background: ${({ theme }) => theme.backgroundAlt};
  outline: none;
  border: 1px solid ${({ theme }) => theme.border};

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${({ theme }) => theme.primary};
    cursor: pointer;
    border: 2px solid ${({ theme }) => theme.backgroundSecondary};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  &::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${({ theme }) => theme.primary};
    cursor: pointer;
    border: 2px solid ${({ theme }) => theme.backgroundSecondary};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}30`};
  }
`;

const CommentsList = styled.div`
  margin-top: 20px;
`;

const CommentItem = styled.div`
  padding: 12px;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  border-radius: 6px;
  margin-bottom: 8px;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const CommentAuthor = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const CommentDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const CommentText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
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

const getProgressColor = (progress: number) => {
  if (progress < 30) return '#F44336'; // Rojo para progreso bajo
  if (progress < 70) return '#FF9800'; // Naranja para progreso medio
  return '#4CAF50'; // Verde para progreso alto
};

const ActualizarProgreso: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const activityId = parseInt(id || '0');

  // Estado para almacenar los detalles de la tarea
  const [tarea, setTarea] = useState<Activity | null>(null);
  const [isLoadingTarea, setIsLoadingTarea] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [comment, setComment] = useState('');

  // Usar el hook personalizado para tareas
  const {
    updateProgress,
    completeTask,
    addComment,
    isUpdatingProgress,
    isCompletingTask,
    isAddingComment
  } = useTareas();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProgresoFormData>({
    resolver: zodResolver(progresoSchema),
    defaultValues: {
      progress: 0,
      notes: ''
    }
  });

  // Observar el valor actual del progreso
  const progressValue = watch('progress');

  // Cargar los detalles de la tarea
  useEffect(() => {
    const fetchTarea = async () => {
      if (!activityId) return;

      try {
        setIsLoadingTarea(true);
        const response = await api.get(`activities/${activityId}`).json<Activity>();
        setTarea(response);
        setCurrentProgress(response.progress || 0);
        setValue('progress', response.progress || 0);
      } catch (error) {
        console.error('Error al cargar la tarea:', error);
        toast.error('Error al cargar los detalles de la tarea');
      } finally {
        setIsLoadingTarea(false);
      }
    };

    fetchTarea();
  }, [activityId, setValue]);

  const onSubmit = async (data: ProgresoFormData) => {
    if (!activityId) return;

    try {
      updateProgress({
        activityId,
        progress: data.progress,
        notes: data.notes
      }, {
        onSuccess: () => {
          setCurrentProgress(data.progress);
          toast.success('Progreso actualizado correctamente');
        }
      });
    } catch (error) {
      console.error('Error al actualizar el progreso:', error);
      toast.error('Error al actualizar el progreso. Inténtelo de nuevo.');
    }
  };

  const handleComplete = async () => {
    if (!activityId) return;

    try {
      completeTask({
        activityId,
        result: `Tarea completada con un progreso del ${currentProgress}%`,
        notes: watch('notes')
      }, {
        onSuccess: () => {
          toast.success('Tarea completada correctamente');
          navigate('/app/tareas/dashboard');
        }
      });
    } catch (error) {
      console.error('Error al completar la tarea:', error);
      toast.error('Error al completar la tarea. Inténtelo de nuevo.');
    }
  };

  const handleAddComment = async () => {
    if (!activityId || !comment.trim()) return;

    try {
      addComment({
        activityId,
        comment
      }, {
        onSuccess: () => {
          setComment('');
          toast.success('Comentario agregado correctamente');
          // Recargar los detalles de la tarea para mostrar el nuevo comentario
          const fetchTarea = async () => {
            const response = await api.get(`activities/${activityId}`).json<Activity>();
            setTarea(response);
          };
          fetchTarea();
        }
      });
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      toast.error('Error al agregar el comentario. Inténtelo de nuevo.');
    }
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
        <Button onClick={() => navigate('/app/tareas/dashboard')} style={{ marginTop: '16px' }}>
          <FiArrowLeft size={16} />
          Volver al dashboard
        </Button>
      </LoadingContainer>
    );
  }

  const isLoading = isUpdatingProgress || isCompletingTask || isAddingComment;

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate('/app/tareas/dashboard')}>
          <FiArrowLeft size={20} />
        </BackButton>
        <PageTitle>Actualizar Progreso</PageTitle>
      </PageHeader>

      <ContentGrid>
        <ContentSection>
          <TareaDetails>
            <TareaHeader>
              <TareaTitle>{tarea.title}</TareaTitle>
            </TareaHeader>

            <TareaMeta>
              <MetaItem>
                <FiUser size={16} />
                Solicitante: {tarea.requesterName}
              </MetaItem>
              <MetaItem>
                <FiUser size={16} />
                Asignador: {tarea.assignerName}
              </MetaItem>
              <MetaItem>
                <FiCalendar size={16} />
                Fecha límite: {formatDate(tarea.dueDate || '')}
              </MetaItem>
              <MetaItem>
                <FiFlag size={16} />
                Prioridad: {getPriorityText(tarea.priority || '')}
              </MetaItem>
              <MetaItem>
                <FiFileText size={16} />
                Categoría: {tarea.category}
              </MetaItem>
            </TareaMeta>

            <SectionTitle>
              <FiFileText size={18} />
              Descripción
            </SectionTitle>
            <TareaDescription>
              {tarea.description}
            </TareaDescription>

            {tarea.attachments && tarea.attachments.length > 0 && (
              <>
                <SectionTitle>
                  <FiFileText size={18} />
                  Archivos adjuntos
                </SectionTitle>
                <ul>
                  {tarea.attachments.map((attachment, index) => (
                    <li key={index}>
                      <a href={attachment.downloadUrl} target="_blank" rel="noopener noreferrer">
                        {attachment.fileName} ({(attachment.fileSize / 1024).toFixed(1)} KB)
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <SectionTitle style={{ marginTop: '20px' }}>
              <FiMessageSquare size={18} />
              Comentarios
            </SectionTitle>

            {tarea.commentList && tarea.commentList.length > 0 ? (
              <CommentsList>
                {tarea.commentList.map((comment, index) => (
                  <CommentItem key={index}>
                    <CommentHeader>
                      <CommentAuthor>{comment.userName} ({comment.userRole})</CommentAuthor>
                      <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
                    </CommentHeader>
                    <CommentText>{comment.comment}</CommentText>
                  </CommentItem>
                ))}
              </CommentsList>
            ) : (
              <p>No hay comentarios para esta tarea.</p>
            )}

            <FormGroup style={{ marginTop: '16px' }}>
              <Label htmlFor="comment">Agregar comentario</Label>
              <TextArea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escriba un comentario..."
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={handleAddComment}
                disabled={isLoading || !comment.trim()}
                style={{ marginTop: '8px' }}
              >
                {isAddingComment && (
                  <LoadingSpinner>
                    <FiLoader size={16} />
                  </LoadingSpinner>
                )}
                <FiMessageSquare size={16} />
                Agregar comentario
              </Button>
            </FormGroup>
          </TareaDetails>
        </ContentSection>

        <ContentSection>
          <SectionTitle>
            <FiClock size={18} />
            Actualizar Progreso
          </SectionTitle>

          <InfoBox>
            <div className="icon">
              <FiInfo size={20} />
            </div>
            <div className="content">
              <h4>Información sobre el progreso</h4>
              <p>
                Actualice el progreso de la tarea utilizando el control deslizante.
                Puede agregar notas para explicar el avance realizado.
                Cuando la tarea esté completada al 100%, puede marcarla como completada.
              </p>
            </div>
          </InfoBox>

          <ProgressContainer>
            <ProgressHeader>
              <ProgressLabel>Progreso actual</ProgressLabel>
              <ProgressValue>{currentProgress}%</ProgressValue>
            </ProgressHeader>
            <ProgressBar>
              <ProgressFill
                $percentage={currentProgress}
                $color={getProgressColor(currentProgress)}
              />
            </ProgressBar>
          </ProgressContainer>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="progress">Nuevo progreso: {progressValue}%</Label>
              <Controller
                name="progress"
                control={control}
                render={({ field }) => (
                  <RangeInput
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    disabled={isLoading}
                  />
                )}
              />
              {errors.progress && (
                <ErrorMessage>
                  <FiAlertCircle size={12} />
                  {errors.progress.message}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="notes">Notas de progreso</Label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextArea
                    id="notes"
                    {...field}
                    placeholder="Describa el avance realizado, problemas encontrados o próximos pasos..."
                    disabled={isLoading}
                  />
                )}
              />
            </FormGroup>

            <ButtonGroup>
              <Button
                type="button"
                onClick={() => navigate('/app/tareas/dashboard')}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                $primary
                disabled={isLoading || progressValue === currentProgress}
              >
                {isUpdatingProgress && (
                  <LoadingSpinner>
                    <FiLoader size={16} />
                  </LoadingSpinner>
                )}
                <FiClock size={16} />
                Actualizar progreso
              </Button>
              {progressValue === 100 && (
                <Button
                  type="button"
                  $primary
                  onClick={handleComplete}
                  disabled={isLoading}
                >
                  {isCompletingTask && (
                    <LoadingSpinner>
                      <FiLoader size={16} />
                    </LoadingSpinner>
                  )}
                  <FiCheck size={16} />
                  Completar tarea
                </Button>
              )}
            </ButtonGroup>
          </form>
        </ContentSection>
      </ContentGrid>
    </PageContainer>
  );
};

export default ActualizarProgreso;
