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
  FiAlertCircle,
  FiArrowLeft,
  FiCheck,
  FiLoader,
  FiUserPlus
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Hooks y servicios
import { api } from '@/core/api/api';
import { Activity } from '@/types/models';
import useAsignacion from '../hooks/useAsignacion';

// Definición del esquema de validación con Zod
const reasignacionSchema = z.object({
  executorId: z.string().min(1, 'Debe seleccionar un ejecutor'),
  notes: z.string().optional()
});

type ReasignacionFormData = z.infer<typeof reasignacionSchema>;

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
`;

const ContentSection = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 24px;
`;

const TareaInfo = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const TareaTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 12px 0;
  color: ${({ theme }) => theme.text};
`;

const TareaDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 8px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
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

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.error};
  font-size: 12px;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${({ $primary, theme }) => $primary ? theme.primary : 'transparent'};
  color: ${({ $primary, theme }) => $primary ? 'white' : theme.textSecondary};
  border: 1px solid ${({ $primary, theme }) => $primary ? 'transparent' : theme.border};

  &:hover {
    background-color: ${({ $primary, theme }) => $primary ? theme.primaryDark : theme.backgroundHover};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.span`
  display: inline-block;
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

// Componente principal
const ReasignarTarea: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const activityId = parseInt(id || '0');

  // Estado para almacenar los detalles de la tarea
  const [tarea, setTarea] = useState<Activity | null>(null);
  const [isLoadingTarea, setIsLoadingTarea] = useState(true);

  // Usar el hook personalizado para asignaciones
  const {
    availableExecutors,
    isLoadingExecutors,
    reassignTask,
    isReassigningTask
  } = useAsignacion();

  // Configurar el formulario con React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ReasignacionFormData>({
    resolver: zodResolver(reasignacionSchema),
    defaultValues: {
      executorId: '',
      notes: ''
    }
  });

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

  // Manejar el envío del formulario
  const onSubmit = async (data: ReasignacionFormData) => {
    if (!activityId || !tarea) return;

    try {
      // Determinar si es una solicitud de tarea o una actividad
      const isTaskRequest = tarea.status === 'REQUESTED' || tarea.status === 'SUBMITTED' || tarea.status === 'ASSIGNED';

      // Verificar que la tarea esté en estado ASSIGNED
      if (tarea.status !== 'ASSIGNED') {
        toast.error('Solo se pueden reasignar tareas en estado ASSIGNED');
        return;
      }

      // Verificar que el ejecutor seleccionado sea diferente al actual
      if (tarea.executorId && tarea.executorId.toString() === data.executorId) {
        toast.error('El nuevo ejecutor debe ser diferente al ejecutor actual');
        return;
      }

      if (isTaskRequest) {
        // Reasignar solicitud de tarea
        await reassignTask({
          taskId: activityId,
          executorId: parseInt(data.executorId),
          notes: data.notes || ''
        }, {
          onSuccess: () => {
            toast.success('Tarea reasignada correctamente');
            navigate(`/app/asignacion/detalle/${activityId}`);
          }
        });
      } else {
        // Reasignar actividad
        await api.post(`activities/${activityId}/reassign`, {
          json: {
            executorId: parseInt(data.executorId),
            notes: data.notes || ''
          }
        }).json();

        toast.success('Tarea reasignada correctamente');
        navigate(`/app/asignacion/detalle/${activityId}`);
      }
    } catch (error) {
      console.error('Error al reasignar la tarea:', error);
      toast.error('Error al reasignar la tarea. Inténtelo de nuevo.');
    }
  };

  if (isLoadingTarea || isLoadingExecutors) {
    return (
      <LoadingContainer>
        <FiLoader size={48} />
        <h3>Cargando información</h3>
        <p>Por favor, espere mientras se cargan los datos necesarios.</p>
      </LoadingContainer>
    );
  }

  if (!tarea) {
    return (
      <LoadingContainer>
        <FiAlertCircle size={48} />
        <h3>Tarea no encontrada</h3>
        <p>No se pudo encontrar la tarea con el ID especificado.</p>
        <Button $primary onClick={() => navigate('/app/asignacion/dashboard')} style={{ marginTop: '16px' }}>
          <FiArrowLeft size={16} />
          Volver al dashboard
        </Button>
      </LoadingContainer>
    );
  }

  // Verificar si la tarea está en estado ASSIGNED
  if (tarea.status !== 'ASSIGNED') {
    return (
      <LoadingContainer>
        <FiAlertCircle size={48} />
        <h3>No se puede reasignar esta tarea</h3>
        <p>Solo se pueden reasignar tareas en estado ASSIGNED (Asignadas).</p>
        <p>Esta tarea está en estado: {tarea.status}</p>
        <Button $primary onClick={() => navigate(`/app/asignacion/detalle/${activityId}`)} style={{ marginTop: '16px' }}>
          <FiArrowLeft size={16} />
          Volver a detalles
        </Button>
      </LoadingContainer>
    );
  }

  // Determinar si es una tarea de tipo Activity o TaskRequest
  const isTaskRequest = tarea.status === 'REQUESTED' || tarea.status === 'SUBMITTED' || tarea.status === 'ASSIGNED';

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate(`/app/asignacion/detalle/${activityId}`)}>
          <FiArrowLeft size={20} />
        </BackButton>
        <PageTitle>Reasignar {isTaskRequest ? 'Solicitud' : 'Tarea'}</PageTitle>
      </PageHeader>

      <ContentGrid>
        <ContentSection>
          <TareaInfo>
            <TareaTitle>{tarea.title}</TareaTitle>
            <TareaDetails>
              <DetailItem>
                <FiUser size={16} />
                Solicitante: {tarea.requesterName || (tarea.requesterId ? `Usuario #${tarea.requesterId}` : 'No especificado')}
              </DetailItem>
              <DetailItem>
                <FiUser size={16} />
                Ejecutor actual: {tarea.executorName || (tarea.executorId ? `Usuario #${tarea.executorId}` : 'No asignado')}
              </DetailItem>
              <DetailItem>
                <FiCalendar size={16} />
                Fecha límite: {formatDate(tarea.dueDate)}
              </DetailItem>
              <DetailItem>
                <FiFlag size={16} />
                Prioridad: {getPriorityText(tarea.priority || 'MEDIUM')}
              </DetailItem>
            </TareaDetails>
          </TareaInfo>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="executorId">Nuevo ejecutor</Label>
              <Controller
                name="executorId"
                control={control}
                render={({ field }) => (
                  <Select
                    id="executorId"
                    {...field}
                    disabled={isReassigningTask}
                  >
                    <option value="">Seleccione un ejecutor</option>
                    {availableExecutors.map(ejecutor => (
                      <option key={ejecutor.id} value={ejecutor.id}>
                        {ejecutor.name} ({ejecutor.username})
                      </option>
                    ))}
                  </Select>
                )}
              />
              {errors.executorId && <ErrorMessage>{errors.executorId.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="notes">Notas de reasignación</Label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextArea
                    id="notes"
                    {...field}
                    placeholder="Ingrese notas o instrucciones para el nuevo ejecutor"
                    disabled={isReassigningTask}
                  />
                )}
              />
              {errors.notes && <ErrorMessage>{errors.notes.message}</ErrorMessage>}
            </FormGroup>

            <ButtonGroup>
              <Button
                type="button"
                onClick={() => navigate(`/app/asignacion/detalle/${activityId}`)}
                disabled={isReassigningTask}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                $primary
                disabled={isReassigningTask}
              >
                {isReassigningTask ? (
                  <LoadingSpinner>
                    <FiLoader size={16} />
                  </LoadingSpinner>
                ) : (
                  <FiUserPlus size={16} />
                )}
                {isReassigningTask ? 'Reasignando...' : 'Reasignar tarea'}
              </Button>
            </ButtonGroup>
          </form>
        </ContentSection>
      </ContentGrid>
    </PageContainer>
  );
};

export default ReasignarTarea;
