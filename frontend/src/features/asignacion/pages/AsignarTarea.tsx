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
  FiDownload
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Hooks y servicios
import useAsignacion from '../hooks/useAsignacion';
import { api } from '@/core/api/api';

// Tipos
import { Activity, ActivityStatus } from '@/types/models';

// Definición del esquema de validación con Zod
const asignacionSchema = z.object({
  executorId: z.string().min(1, 'Debe seleccionar un ejecutor'),
  dueDate: z.string().optional(),
  priority: z.string().min(1, 'Debe seleccionar una prioridad'),
  notes: z.string().optional()
});

type AsignacionFormData = z.infer<typeof asignacionSchema>;

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

const SolicitudDetails = styled.div`
  margin-bottom: 24px;
`;

const SolicitudHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const SolicitudTitle = styled.h2`
  font-size: 20px;
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.text};
`;

const SolicitudMeta = styled.div`
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

const SolicitudDescription = styled.div`
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

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundTertiary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding-right: 30px;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}30`};
  }
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

const AttachmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s ease;
  border: 1px solid transparent;

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

const AsignarTarea: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const activityId = parseInt(id || '0');

  // Estado para almacenar los detalles de la solicitud
  const [solicitud, setSolicitud] = useState<Activity | null>(null);
  const [isLoadingSolicitud, setIsLoadingSolicitud] = useState(true);

  // Usar el hook personalizado para asignaciones
  const {
    availableExecutors,
    isLoadingExecutors,
    assignTask,
    isAssigningTask
  } = useAsignacion();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<AsignacionFormData>({
    resolver: zodResolver(asignacionSchema),
    defaultValues: {
      executorId: '',
      dueDate: solicitud?.dueDate || '',
      priority: solicitud?.priority || '',
      notes: ''
    }
  });

  // Cargar los detalles de la solicitud
  useEffect(() => {
    const fetchSolicitud = async () => {
      if (!activityId) return;

      try {
        setIsLoadingSolicitud(true);
        const response = await api.get(`activities/${activityId}`).json<Activity>();
        setSolicitud(response);
      } catch (error) {
        console.error('Error al cargar la solicitud:', error);
        toast.error('Error al cargar los detalles de la solicitud');
      } finally {
        setIsLoadingSolicitud(false);
      }
    };

    fetchSolicitud();
  }, [activityId]);

  const onSubmit = async (data: AsignacionFormData) => {
    if (!activityId) return;

    try {
      assignTask({
        activityId,
        executorId: parseInt(data.executorId),
        dueDate: data.dueDate,
        priority: data.priority,
        notes: data.notes
      }, {
        onSuccess: () => {
          navigate('/app/asignacion/dashboard');
        }
      });
    } catch (error) {
      console.error('Error al asignar la tarea:', error);
      toast.error('Error al asignar la tarea. Inténtelo de nuevo.');
    }
  };

  if (isLoadingSolicitud) {
    return (
      <LoadingContainer>
        <FiLoader size={48} />
        <h3>Cargando solicitud</h3>
        <p>Por favor, espere mientras se cargan los detalles de la solicitud.</p>
      </LoadingContainer>
    );
  }

  if (!solicitud) {
    return (
      <LoadingContainer>
        <FiAlertCircle size={48} />
        <h3>Solicitud no encontrada</h3>
        <p>No se pudo encontrar la solicitud con el ID especificado.</p>
        <Button onClick={() => navigate('/app/asignacion/dashboard')} style={{ marginTop: '16px' }}>
          <FiArrowLeft size={16} />
          Volver al dashboard
        </Button>
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate('/app/asignacion/dashboard')}>
          <FiArrowLeft size={20} />
        </BackButton>
        <PageTitle>Asignar Solicitud</PageTitle>
      </PageHeader>

      <ContentGrid>
        <ContentSection>
          <SolicitudDetails>
            <SolicitudHeader>
              <SolicitudTitle>{solicitud.title}</SolicitudTitle>
            </SolicitudHeader>

            <SolicitudMeta>
              <MetaItem>
                <FiUser size={16} />
                Solicitante: {solicitud.requesterName}
              </MetaItem>
              <MetaItem>
                <FiCalendar size={16} />
                Fecha de solicitud: {formatDate(solicitud.requestDate || solicitud.createdAt)}
              </MetaItem>
              <MetaItem>
                <FiFlag size={16} />
                Prioridad: {getPriorityText(solicitud.priority || '')}
              </MetaItem>
              <MetaItem>
                <FiFileText size={16} />
                Categoría: {solicitud.category}
              </MetaItem>
              {solicitud.dueDate && (
                <MetaItem>
                  <FiCalendar size={16} />
                  Fecha límite: {formatDate(solicitud.dueDate)}
                </MetaItem>
              )}
            </SolicitudMeta>

            <SectionTitle>
              <FiFileText size={18} />
              Descripción
            </SectionTitle>
            <SolicitudDescription>
              {solicitud.description}
            </SolicitudDescription>

            {solicitud.attachments && solicitud.attachments.length > 0 && (
              <>
                <SectionTitle>
                  <FiFileText size={18} />
                  Archivos adjuntos
                </SectionTitle>
                <AttachmentsList>
                  {solicitud.attachments.map((attachment, index) => (
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
          </SolicitudDetails>
        </ContentSection>

        <ContentSection>
          <SectionTitle>
            <FiUser size={18} />
            Asignar a Ejecutor
          </SectionTitle>

          <InfoBox>
            <div className="icon">
              <FiInfo size={20} />
            </div>
            <div className="content">
              <h4>Información sobre asignación</h4>
              <p>
                Seleccione un ejecutor para asignar esta solicitud. Puede ajustar la prioridad y la fecha límite si es necesario.
                También puede agregar notas para el ejecutor con instrucciones específicas.
              </p>
            </div>
          </InfoBox>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="executorId">Ejecutor</Label>
              <Controller
                name="executorId"
                control={control}
                render={({ field }) => (
                  <Select
                    id="executorId"
                    {...field}
                    disabled={isLoadingExecutors || isAssigningTask}
                  >
                    <option value="">Seleccione un ejecutor</option>
                    {availableExecutors?.map(executor => (
                      <option key={executor.id} value={executor.id.toString()}>
                        {executor.fullName}
                      </option>
                    ))}
                  </Select>
                )}
              />
              {errors.executorId && (
                <ErrorMessage>
                  <FiAlertCircle size={12} />
                  {errors.executorId.message}
                </ErrorMessage>
              )}
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
                    disabled={isAssigningTask}
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
              {errors.priority && (
                <ErrorMessage>
                  <FiAlertCircle size={12} />
                  {errors.priority.message}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="dueDate">Fecha límite (opcional)</Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <Input
                    id="dueDate"
                    type="date"
                    {...field}
                    disabled={isAssigningTask}
                  />
                )}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="notes">Notas para el ejecutor (opcional)</Label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextArea
                    id="notes"
                    {...field}
                    placeholder="Instrucciones o información adicional para el ejecutor"
                    disabled={isAssigningTask}
                  />
                )}
              />
            </FormGroup>

            <ButtonGroup>
              <Button
                type="button"
                onClick={() => navigate('/app/asignacion/dashboard')}
                disabled={isAssigningTask}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                $primary
                disabled={isAssigningTask}
              >
                {isAssigningTask && (
                  <LoadingSpinner>
                    <FiLoader size={16} />
                  </LoadingSpinner>
                )}
                <FiCheck size={16} />
                {isAssigningTask ? 'Asignando...' : 'Asignar tarea'}
              </Button>
            </ButtonGroup>
          </form>
        </ContentSection>
      </ContentGrid>
    </PageContainer>
  );
};

export default AsignarTarea;
