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
  FiSave
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Hooks y servicios
import { api } from '@/core/api/api';
import { Activity } from '@/types/models';

// Definición del esquema de validación con Zod
const edicionSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  dueDate: z.string().optional(),
  priority: z.string().min(1, 'Debe seleccionar una prioridad'),
  category: z.string().optional()
});

type EdicionFormData = z.infer<typeof edicionSchema>;

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
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
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

// Componente principal
const EditarTarea: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const activityId = parseInt(id || '0');

  // Estado para almacenar los detalles de la tarea
  const [tarea, setTarea] = useState<Activity | null>(null);
  const [isLoadingTarea, setIsLoadingTarea] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Configurar el formulario con React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EdicionFormData>({
    resolver: zodResolver(edicionSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      priority: '',
      category: ''
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

          // Actualizar el formulario con los datos cargados
          reset({
            title: mappedTask.title || '',
            description: mappedTask.description || '',
            dueDate: mappedTask.dueDate || '',
            priority: mappedTask.priority || '',
            category: mappedTask.category || ''
          });

        } catch (taskError) {
          console.warn('No se pudo cargar como solicitud de tarea, intentando cargar como actividad:', taskError);

          // Si falla, intentamos cargar como una actividad (Activity)
          try {
            const response = await api.get(`activities/${activityId}`).json<Activity>();
            console.log('Datos de actividad cargados:', response);
            setTarea(response);

            // Actualizar el formulario con los datos cargados
            reset({
              title: response.title || '',
              description: response.description || '',
              dueDate: response.dueDate || '',
              priority: response.priority || '',
              category: response.category || ''
            });
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
  }, [activityId, reset]);

  // Manejar el envío del formulario
  const onSubmit = async (data: EdicionFormData) => {
    if (!activityId || !tarea) return;

    setIsUpdating(true);

    try {
      // Determinar si es una solicitud de tarea o una actividad
      const isTaskRequest = tarea.status === 'REQUESTED' || tarea.status === 'SUBMITTED' || tarea.status === 'ASSIGNED';

      // Verificar si la tarea está en un estado que permite la edición
      if (isTaskRequest && tarea.status !== 'SUBMITTED') {
        toast.error('Solo se pueden editar solicitudes en estado SUBMITTED');
        setIsUpdating(false);
        return;
      }

      if (isTaskRequest) {
        // Actualizar solicitud de tarea
        const updateData = {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          priority: data.priority,
          categoryId: data.category ? parseInt(data.category) : null
        };

        await api.put(`task-requests/${activityId}`, {
          json: updateData
        }).json();

        toast.success('Solicitud actualizada correctamente');
      } else {
        // Actualizar actividad
        const updateData = {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          priority: data.priority,
          category: data.category
        };

        await api.put(`activities/${activityId}`, {
          json: updateData
        }).json();

        toast.success('Tarea actualizada correctamente');
      }

      // Redirigir a la página de detalle
      navigate(`/app/asignacion/detalle/${activityId}`);
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      toast.error('Error al actualizar la tarea. Inténtelo de nuevo.');
    } finally {
      setIsUpdating(false);
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
        <Button $primary onClick={() => navigate('/app/asignacion/dashboard')} style={{ marginTop: '16px' }}>
          <FiArrowLeft size={16} />
          Volver al dashboard
        </Button>
      </LoadingContainer>
    );
  }

  // Determinar si es una tarea de tipo Activity o TaskRequest
  const isTaskRequest = tarea.status === 'REQUESTED' || tarea.status === 'SUBMITTED' || tarea.status === 'ASSIGNED';

  // Verificar si la tarea está en un estado que permite la edición
  const canEdit = !isTaskRequest || tarea.status === 'SUBMITTED';

  // Si no se puede editar, mostrar un mensaje y redirigir
  if (!canEdit) {
    return (
      <PageContainer>
        <PageHeader>
          <BackButton onClick={() => navigate(`/app/asignacion/detalle/${activityId}`)}>
            <FiArrowLeft size={20} />
          </BackButton>
          <PageTitle>No se puede editar</PageTitle>
        </PageHeader>

        <ContentGrid>
          <ContentSection>
            <LoadingContainer>
              <FiAlertCircle size={48} />
              <h3>No se puede editar esta solicitud</h3>
              <p>Solo se pueden editar solicitudes en estado SUBMITTED (Enviadas).</p>
              <p>Esta solicitud está en estado: {tarea.status}</p>
              <Button $primary onClick={() => navigate(`/app/asignacion/detalle/${activityId}`)} style={{ marginTop: '16px' }}>
                <FiArrowLeft size={16} />
                Volver a detalles
              </Button>
            </LoadingContainer>
          </ContentSection>
        </ContentGrid>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate(`/app/asignacion/detalle/${activityId}`)}>
          <FiArrowLeft size={20} />
        </BackButton>
        <PageTitle>Editar {isTaskRequest ? 'Solicitud' : 'Tarea'}</PageTitle>
      </PageHeader>

      <ContentGrid>
        <ContentSection>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="title">Título</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    id="title"
                    {...field}
                    placeholder="Ingrese el título de la tarea"
                    disabled={isUpdating}
                  />
                )}
              />
              {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Descripción</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextArea
                    id="description"
                    {...field}
                    placeholder="Ingrese una descripción detallada de la tarea"
                    disabled={isUpdating}
                  />
                )}
              />
              {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="dueDate">Fecha límite</Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <Input
                    id="dueDate"
                    type="date"
                    {...field}
                    disabled={isUpdating}
                  />
                )}
              />
              {errors.dueDate && <ErrorMessage>{errors.dueDate.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="priority">Prioridad</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    id="priority"
                    {...field}
                    disabled={isUpdating}
                  >
                    <option value="">Seleccione una prioridad</option>
                    <option value="CRITICAL">Crítica</option>
                    <option value="HIGH">Alta</option>
                    <option value="MEDIUM">Media</option>
                    <option value="LOW">Baja</option>
                    <option value="TRIVIAL">Trivial</option>
                  </Select>
                )}
              />
              {errors.priority && <ErrorMessage>{errors.priority.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="category">Categoría</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    id="category"
                    {...field}
                    disabled={isUpdating}
                  >
                    <option value="">Seleccione una categoría</option>
                    <option value="ADMINISTRATIVA">Administrativa</option>
                    <option value="LEGAL">Legal</option>
                    <option value="TECNICA">Técnica</option>
                    <option value="FINANCIERA">Financiera</option>
                    <option value="RECURSOS_HUMANOS">Recursos Humanos</option>
                    <option value="GENERAL">General</option>
                  </Select>
                )}
              />
              {errors.category && <ErrorMessage>{errors.category.message}</ErrorMessage>}
            </FormGroup>

            <ButtonGroup>
              <Button
                type="button"
                onClick={() => navigate(`/app/asignacion/detalle/${activityId}`)}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                $primary
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <LoadingSpinner>
                    <FiLoader size={16} />
                  </LoadingSpinner>
                ) : (
                  <FiSave size={16} />
                )}
                {isUpdating ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </ButtonGroup>
          </form>
        </ContentSection>
      </ContentGrid>
    </PageContainer>
  );
};

export default EditarTarea;
