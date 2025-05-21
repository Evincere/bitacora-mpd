import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiSend, FiPaperclip, FiAlertCircle, FiInfo, FiLoader, FiX, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useFormDraft } from '@/core/hooks/useFormDraft';

// Hooks y servicios
import useSolicitudes from '../hooks/useSolicitudes';

// Definición del esquema de validación con Zod
const solicitudSchema = z.object({
  titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  categoria: z.string().min(1, 'Debe seleccionar una categoría'),
  prioridad: z.string().min(1, 'Debe seleccionar una prioridad'),
  fechaLimite: z.string().optional(),
  adjuntos: z.array(z.any()).optional()
});

type SolicitudFormData = z.infer<typeof solicitudSchema>;

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid ${({ theme }) => theme.border};
`;

const FormTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.text};
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

const AutosaveIndicator = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.textSecondary};
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? 0 : '20px')});
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 1000;
  border: 1px solid ${({ theme }) => theme.border};

  .icon {
    color: #4CD964;
    animation: fadeIn 0.5s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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

const FileInput = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;
`;

const HiddenInput = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
`;

const FileItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 13px;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    color: ${({ theme }) => theme.error};
    background-color: ${({ theme }) => `${theme.error}10`};
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

const SolicitudForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<any[]>([]);
  const [showAutosaveIndicator, setShowAutosaveIndicator] = useState(false);
  const [lastAutoSaved, setLastAutoSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const formChangedRef = useRef(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(isEditMode);
  const [solicitudRechazada, setSolicitudRechazada] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Usar el hook personalizado para solicitudes
  const {
    categories,
    priorities,
    isLoadingCategories,
    isLoadingPriorities,
    isCreatingSolicitud,
    isUploading,
    createSolicitud,
    updateSolicitud,
    resubmitTaskRequest,
    getTaskRequestById
  } = useSolicitudes();

  // Configurar el hook de borradores
  const draftKey = 'solicitud-form-draft';
  const {
    draftData,
    hasDraft,
    lastSaved,
    saveDraft,
    discardDraft
  } = useFormDraft<SolicitudFormData>({
    titulo: '',
    descripcion: '',
    categoria: '',
    prioridad: '',
    fechaLimite: '',
    adjuntos: []
  }, { key: draftKey });

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<SolicitudFormData>({
    resolver: zodResolver(solicitudSchema),
    defaultValues: hasDraft ? draftData : {
      titulo: '',
      descripcion: '',
      categoria: '',
      prioridad: '',
      fechaLimite: '',
      adjuntos: []
    }
  });

  // Observar cambios en el formulario para activar el autoguardado
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === 'change') {
        formChangedRef.current = true;

        // Reiniciar el temporizador de autoguardado cuando hay cambios
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }

        // Configurar un nuevo temporizador para autoguardar después de 3 segundos de inactividad
        autoSaveTimeoutRef.current = setTimeout(() => {
          if (formChangedRef.current) {
            try {
              // Obtener los valores actuales del formulario sin resetear
              const currentValues = getValues();

              // Guardar el borrador sin afectar el estado del formulario
              saveDraft(currentValues);

              // Actualizar solo los indicadores visuales
              setLastAutoSaved(new Date());
              setShowAutosaveIndicator(true);
              formChangedRef.current = false;

              // Ocultar el indicador después de 3 segundos
              setTimeout(() => {
                setShowAutosaveIndicator(false);
              }, 3000);

              console.log('Autoguardado completado:', currentValues);
            } catch (error) {
              console.error('Error durante el autoguardado:', error);
            }
          }
        }, 3000);
      }
    });

    // Limpiar la suscripción y el temporizador al desmontar
    return () => {
      subscription.unsubscribe();
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [watch, getValues, saveDraft]);

  // Usar el hook useTaskRequestDetails para obtener los detalles de la solicitud con caché
  const taskRequestId = isEditMode && id ? parseInt(id) : null;
  const {
    data: solicitudData,
    isLoading: isLoadingTaskRequest,
    error: taskRequestError
  } = useSolicitudes().useTaskRequestDetails(taskRequestId);

  // Procesar los datos de la solicitud cuando se cargan
  useEffect(() => {
    if (isEditMode && solicitudData) {
      try {
        setError(null);

        // Verificar si la solicitud está en estado REJECTED
        if (solicitudData.status !== 'REJECTED') {
          setError('Solo se pueden editar solicitudes en estado RECHAZADA');
          setIsLoadingDetails(false);
          return;
        }

        setSolicitudRechazada(solicitudData);
        setExistingAttachments(solicitudData.attachments || []);

        // Preparar los datos para el formulario
        reset({
          titulo: solicitudData.title,
          descripcion: solicitudData.description,
          categoria: solicitudData.category?.name || '',
          prioridad: solicitudData.priority,
          fechaLimite: solicitudData.dueDate ? new Date(solicitudData.dueDate).toISOString().split('T')[0] : '',
          adjuntos: []
        });

        setIsLoadingDetails(false);
      } catch (error) {
        console.error('Error al procesar los detalles de la solicitud:', error);
        setError('Error al procesar los detalles de la solicitud. Por favor, inténtelo de nuevo.');
        setIsLoadingDetails(false);
      }
    }
  }, [isEditMode, solicitudData, reset]);

  // Manejar errores de carga
  useEffect(() => {
    if (taskRequestError) {
      console.error('Error al cargar los detalles de la solicitud:', taskRequestError);
      setError('Error al cargar los detalles de la solicitud. Por favor, inténtelo de nuevo.');
      setIsLoadingDetails(false);
    }
  }, [taskRequestError]);

  // Cargar el borrador si existe y no estamos en modo edición
  useEffect(() => {
    if (hasDraft && !isEditMode) {
      // Solo resetear el formulario al cargar inicialmente, no durante el autoguardado
      reset(draftData);
      console.log('Borrador cargado inicialmente:', draftData);

      // Mostrar un indicador sutil en lugar de un toast intrusivo
      setLastAutoSaved(lastSaved || new Date());
      setShowAutosaveIndicator(true);
      setTimeout(() => {
        setShowAutosaveIndicator(false);
      }, 3000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      formChangedRef.current = true;
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    formChangedRef.current = true;
  };

  const handleDiscardDraft = () => {
    if (window.confirm('¿Está seguro de que desea descartar el borrador? Esta acción no se puede deshacer.')) {
      discardDraft();
      reset({
        titulo: '',
        descripcion: '',
        categoria: '',
        prioridad: '',
        fechaLimite: '',
        adjuntos: []
      });
      setFiles([]);
      toast.info('Borrador descartado');
    }
  };

  const onSubmit = async (data: SolicitudFormData) => {
    try {
      console.log('SolicitudForm: Enviando datos del formulario:', data);

      if (isEditMode && id && solicitudRechazada) {
        // Actualizar la solicitud rechazada
        const solicitudId = parseInt(id);

        // Para solicitudes rechazadas, usamos directamente el endpoint de reenvío
        // en lugar de intentar actualizar la solicitud, ya que el endpoint PUT está fallando

        // Primero subir nuevos archivos adjuntos si hay
        if (files.length > 0) {
          await createSolicitud({
            solicitud: {
              titulo: data.titulo,
              descripcion: data.descripcion,
              categoria: data.categoria,
              prioridad: data.prioridad,
              fechaLimite: data.fechaLimite
            },
            files,
            submitImmediately: false,
            taskRequestId: solicitudId
          });
        }

        // Luego reenviar la solicitud con los cambios
        await resubmitTaskRequest({
          taskRequestId: solicitudId,
          notes: `Solicitud actualizada: ${data.titulo}\n` +
            `Descripción: ${data.descripcion}\n` +
            `Categoría: ${data.categoria}\n` +
            `Prioridad: ${data.prioridad}\n` +
            (data.fechaLimite ? `Fecha límite: ${data.fechaLimite}` : '')
        });

        toast.success('Solicitud actualizada y reenviada correctamente.');

        // Invalidar consultas para actualizar la UI
        queryClient.invalidateQueries({ queryKey: ['mySolicitudes'] });
        queryClient.invalidateQueries({ queryKey: ['taskRequest', solicitudId] });

        // Redirigir a la página de seguimiento
        navigate(`/app/solicitudes/seguimiento/${solicitudId}`);
      } else {
        // Crear una nueva solicitud
        createSolicitud({
          solicitud: {
            titulo: data.titulo,
            descripcion: data.descripcion,
            categoria: data.categoria,
            prioridad: data.prioridad,
            fechaLimite: data.fechaLimite
          },
          files,
          submitImmediately: true // Indicar que se debe enviar inmediatamente
        }, {
          onSuccess: (result) => {
            console.log('SolicitudForm: Solicitud creada exitosamente:', result);
            toast.success('Solicitud creada correctamente. Redirigiendo a la lista de solicitudes...');

            // Eliminar el borrador si existe
            if (hasDraft) {
              discardDraft();
            }

            // Esperar un momento antes de redirigir para que se complete la invalidación de la caché
            setTimeout(() => {
              // Forzar una recarga de las solicitudes antes de navegar
              queryClient.invalidateQueries({ queryKey: ['mySolicitudes'] });
              navigate('/app/solicitudes');
            }, 1000);
          }
        });
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      toast.error('Error al procesar la solicitud. Inténtelo de nuevo.');
    }
  };

  // Función para reenviar la solicitud después de editarla
  const handleResubmit = async () => {
    if (!isEditMode || !id || !solicitudRechazada) return;

    try {
      // Obtener los datos del formulario y reenviar directamente
      await handleSubmit(async (data) => {
        const solicitudId = parseInt(id);

        // Subir nuevos archivos si hay
        if (files.length > 0) {
          await createSolicitud({
            solicitud: {
              titulo: data.titulo,
              descripcion: data.descripcion,
              categoria: data.categoria,
              prioridad: data.prioridad,
              fechaLimite: data.fechaLimite
            },
            files,
            submitImmediately: false,
            taskRequestId: solicitudId
          });
        }

        // Reenviar la solicitud con los datos actualizados
        await resubmitTaskRequest({
          taskRequestId: solicitudId,
          notes: `Solicitud corregida y reenviada\n` +
            `Título: ${data.titulo}\n` +
            `Descripción: ${data.descripcion}\n` +
            `Categoría: ${data.categoria}\n` +
            `Prioridad: ${data.prioridad}\n` +
            (data.fechaLimite ? `Fecha límite: ${data.fechaLimite}` : '')
        });

        toast.success('Solicitud reenviada correctamente.');

        // Invalidar consultas para actualizar la UI
        queryClient.invalidateQueries({ queryKey: ['mySolicitudes'] });
        queryClient.invalidateQueries({ queryKey: ['taskRequest', solicitudId] });

        // Redirigir a la página de seguimiento
        navigate(`/app/solicitudes/seguimiento/${id}`);
      })();
    } catch (error) {
      console.error('Error al reenviar la solicitud:', error);
      toast.error('Error al reenviar la solicitud. Inténtelo de nuevo.');
    }
  };

  // Determinar si el formulario está en estado de carga
  const isLoading = isCreatingSolicitud || isUploading || isLoadingTaskRequest;

  // Función para eliminar un archivo adjunto existente
  const handleRemoveExistingAttachment = (attachmentId: number) => {
    // En una implementación real, aquí se llamaría a una API para eliminar el archivo
    // Por ahora, solo lo eliminamos del estado local
    setExistingAttachments(prevAttachments =>
      prevAttachments.filter(attachment => attachment.id !== attachmentId)
    );
  };

  // Mostrar un loader mientras se cargan los detalles
  if (isLoadingDetails) {
    return (
      <FormContainer>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <LoadingSpinner>
            <FiLoader size={30} />
          </LoadingSpinner>
          <span style={{ marginLeft: '10px' }}>Cargando detalles de la solicitud...</span>
        </div>
      </FormContainer>
    );
  }

  // Mostrar mensaje de error si hay alguno
  if (error) {
    return (
      <FormContainer>
        <FormTitle>{isEditMode ? 'Editar Solicitud Rechazada' : 'Nueva Solicitud'}</FormTitle>
        <div style={{
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          color: '#f44336',
          padding: '16px',
          borderRadius: '4px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <FiAlertCircle size={24} />
          <div>
            <h4 style={{ margin: '0 0 8px 0' }}>Error</h4>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        </div>
        <Button type="button" onClick={() => navigate('/app/solicitudes')}>
          Volver a mis solicitudes
        </Button>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <FormTitle>{isEditMode ? 'Editar Solicitud Rechazada' : 'Nueva Solicitud'}</FormTitle>

      {isEditMode && solicitudRechazada && (
        <InfoBox style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)', borderColor: '#f44336' }}>
          <div className="icon" style={{ color: '#f44336' }}>
            <FiInfo size={20} />
          </div>
          <div className="content">
            <h4>Solicitud Rechazada</h4>
            <p>
              Esta solicitud fue rechazada por el asignador. Motivo: {solicitudRechazada.notes}
              <br />
              Puede editar la solicitud para corregir los problemas señalados y reenviarla.
            </p>
          </div>
        </InfoBox>
      )}

      {!isEditMode && (
        <InfoBox>
          <div className="icon">
            <FiInfo size={20} />
          </div>
          <div className="content">
            <h4>Información sobre solicitudes</h4>
            <p>
              Complete el formulario con todos los detalles necesarios para su solicitud.
              Las solicitudes son revisadas por un asignador que distribuirá la tarea al equipo correspondiente.
              Recibirá notificaciones sobre el estado de su solicitud.
            </p>
          </div>
        </InfoBox>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="titulo">Título de la solicitud</Label>
          <Controller
            name="titulo"
            control={control}
            render={({ field }) => <Input id="titulo" {...field} placeholder="Ingrese un título descriptivo" />}
          />
          {errors.titulo && (
            <ErrorMessage>
              <FiAlertCircle size={12} />
              {errors.titulo.message}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="descripcion">Descripción detallada</Label>
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <TextArea
                id="descripcion"
                {...field}
                placeholder="Describa en detalle lo que necesita"
              />
            )}
          />
          {errors.descripcion && (
            <ErrorMessage>
              <FiAlertCircle size={12} />
              {errors.descripcion.message}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="categoria">Categoría</Label>
          <Controller
            name="categoria"
            control={control}
            render={({ field }) => (
              <Select
                id="categoria"
                {...field}
                disabled={isLoadingCategories || isLoading}
              >
                <option value="">Seleccione una categoría</option>
                {categories?.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.description}
                  </option>
                ))}
              </Select>
            )}
          />
          {errors.categoria && (
            <ErrorMessage>
              <FiAlertCircle size={12} />
              {errors.categoria.message}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="prioridad">Prioridad</Label>
          <Controller
            name="prioridad"
            control={control}
            render={({ field }) => (
              <Select
                id="prioridad"
                {...field}
                disabled={isLoadingPriorities || isLoading}
              >
                <option value="">Seleccione una prioridad</option>
                {priorities?.map(priority => (
                  <option key={priority.name} value={priority.name}>
                    {priority.displayName}
                  </option>
                ))}
              </Select>
            )}
          />
          {errors.prioridad && (
            <ErrorMessage>
              <FiAlertCircle size={12} />
              {errors.prioridad.message}
            </ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="fechaLimite">Fecha límite (opcional)</Label>
          <Controller
            name="fechaLimite"
            control={control}
            render={({ field }) => (
              <Input id="fechaLimite" type="date" {...field} />
            )}
          />
        </FormGroup>

        <FormGroup>
          <Label>Archivos adjuntos (opcional)</Label>
          <FileInput>
            <Button type="button" disabled={isLoading}>
              <FiPaperclip size={16} />
              Adjuntar archivos
            </Button>
            <HiddenInput
              type="file"
              multiple
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </FileInput>

          {/* Mostrar archivos adjuntos existentes */}
          {existingAttachments.length > 0 && (
            <>
              <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                <Label as="span">Archivos adjuntos existentes:</Label>
              </div>
              <FileList>
                {existingAttachments.map((attachment) => (
                  <FileItem key={attachment.id}>
                    <FileInfo>
                      <FiPaperclip size={14} />
                      {attachment.fileName} ({(attachment.fileSize / 1024).toFixed(1)} KB)
                    </FileInfo>
                    {!isLoading && (
                      <RemoveButton
                        type="button"
                        onClick={() => handleRemoveExistingAttachment(attachment.id)}
                        title="Eliminar archivo"
                      >
                        <FiX size={14} />
                      </RemoveButton>
                    )}
                  </FileItem>
                ))}
              </FileList>
            </>
          )}

          {/* Mostrar nuevos archivos a subir */}
          {files.length > 0 && (
            <>
              <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                <Label as="span">Nuevos archivos a subir:</Label>
              </div>
              <FileList>
                {files.map((file, index) => (
                  <FileItem key={index}>
                    <FileInfo>
                      <FiPaperclip size={14} />
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </FileInfo>
                    {!isLoading && (
                      <RemoveButton
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        title="Eliminar archivo"
                      >
                        <FiX size={14} />
                      </RemoveButton>
                    )}
                  </FileItem>
                ))}
              </FileList>
            </>
          )}
        </FormGroup>

        {hasDraft && (
          <InfoBox style={{ backgroundColor: 'rgba(0, 184, 212, 0.1)', borderColor: '#00B8D4' }}>
            <div className="icon" style={{ color: '#00B8D4' }}>
              <FiInfo size={20} />
            </div>
            <div className="content">
              <h4>Continuando desde donde lo dejaste</h4>
              <p>
                Tus cambios se guardan automáticamente mientras escribes.
                {lastSaved && (
                  <span> Última edición: {lastSaved.toLocaleString()}</span>
                )}
              </p>
              <Button
                type="button"
                onClick={handleDiscardDraft}
                style={{ marginTop: '8px', padding: '4px 8px', fontSize: '12px' }}
                disabled={isLoading}
              >
                Descartar borrador
              </Button>
            </div>
          </InfoBox>
        )}

        <ButtonGroup>
          <Button
            type="button"
            onClick={() => navigate('/app/solicitudes')}
            disabled={isLoading}
          >
            Cancelar
          </Button>

          {isEditMode && (
            <Button
              type="button"
              onClick={handleResubmit}
              $primary
              disabled={isLoading}
              style={{ backgroundColor: '#4caf50' }}
            >
              {isCreatingSolicitud && (
                <LoadingSpinner>
                  <FiLoader size={16} />
                </LoadingSpinner>
              )}
              <FiRefreshCw size={16} />
              {isCreatingSolicitud
                ? 'Procesando...'
                : isUploading
                  ? 'Subiendo archivos...'
                  : 'Guardar y reenviar'
              }
            </Button>
          )}

          <Button
            type="submit"
            $primary
            disabled={isLoading}
          >
            {isCreatingSolicitud && (
              <LoadingSpinner>
                <FiLoader size={16} />
              </LoadingSpinner>
            )}
            <FiSend size={16} />
            {isCreatingSolicitud
              ? 'Procesando...'
              : isUploading
                ? 'Subiendo archivos...'
                : isEditMode
                  ? 'Guardar cambios'
                  : 'Enviar solicitud'
            }
          </Button>
        </ButtonGroup>

        <AutosaveIndicator $visible={showAutosaveIndicator}>
          <div className="icon">
            <FiCheck size={16} />
          </div>
          <span>Guardado automáticamente {lastAutoSaved ? `a las ${lastAutoSaved.toLocaleTimeString()}` : ''}</span>
        </AutosaveIndicator>
      </form>
    </FormContainer>
  );
};

export default SolicitudForm;
