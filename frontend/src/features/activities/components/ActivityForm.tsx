import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { FiX, FiSave, FiHelpCircle, FiAlertTriangle, FiFileText, FiInfo, FiPlus, FiStar } from 'react-icons/fi';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateActivity, useUpdateActivity, useActivities } from '@/hooks/useActivities';
import { activityCreateSchema, ActivityFormData } from '../schemas/activitySchema';
import { Activity, ActivityStatus, ActivityType } from '@/types/models';
import PresenceIndicator from '@/components/ui/Collaboration/PresenceIndicator';
import { useActivityPresence } from '@/hooks/useActivityPresence';
import useActivityTemplates, { ActivityTemplate } from '@/hooks/useActivityTemplates';
import useFrequentData from '@/hooks/useFrequentData';
import AutocompleteInput from '@/components/common/AutocompleteInput';
import TemplateSelector from './TemplateSelector';
import TemplateManager from './TemplateManager';
import SaveTemplateDialog from './SaveTemplateDialog';
import { useToast } from '@/hooks/useToast';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: ${({ theme }) => theme.textSecondary};

  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.text};
  }
`;

const FormContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  grid-column: ${({ fullWidth }) => fullWidth ? '1 / -1' : 'auto'};
`;

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;

  .tooltip {
    position: relative;
    display: inline-block;

    &:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
  }

  .tooltip-text {
    visibility: hidden;
    width: 200px;
    background-color: ${({ theme }) => theme.backgroundSecondary};
    color: ${({ theme }) => theme.text};
    text-align: center;
    border-radius: 6px;
    padding: 8px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.3s;
    box-shadow: ${({ theme }) => theme.shadow};
    font-weight: 400;
    font-size: 12px;

    &::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: ${({ theme }) => theme.backgroundSecondary} transparent transparent transparent;
    }
  }
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme, hasError }) => hasError ? theme.error : theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => hasError ? theme.error : theme.primary};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme, hasError }) => hasError ? theme.error : theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => hasError ? theme.error : theme.primary};
  }
`;

const Textarea = styled.textarea<{ hasError?: boolean }>`
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme, hasError }) => hasError ? theme.error : theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => hasError ? theme.error : theme.primary};
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.error};
  font-size: 12px;
  margin: 4px 0 0;
`;

const ContextualHint = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 4px;
  font-style: italic;
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
  gap: 16px;
  position: relative;
  z-index: 1;
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 4px;
  font-weight: 500;
  border: none;
  height: 36px;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.backgroundDisabled};
    color: ${({ theme }) => theme.textDisabled};
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border-radius: 4px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.border};
  height: 36px;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.primary};
  }
`;

const TemplateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.backgroundTertiary};
  color: ${({ theme }) => theme.primary};
  border-radius: 4px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.primary + '40'};
  height: 36px;
  font-size: 14px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: ${({ theme }) => theme.primary + '15'};
    border-color: ${({ theme }) => theme.primary};
  }

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const EditingWarning = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: ${({ theme }) => theme.warningLight};
  color: ${({ theme }) => theme.warning};
  font-size: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.warning}30;

  svg {
    flex-shrink: 0;
  }
`;

const formatDateForInput = (dateString?: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const formatTimeForInput = (dateString?: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toTimeString().slice(0, 5);
};

interface ActivityFormProps {
  activity?: Activity;
  onClose: () => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ activity, onClose }) => {
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const { data: activitiesData } = useActivities({ page: 0, size: 100 });
  const isEditing = !!activity;
  const toast = useToast();

  // Estados para gestionar plantillas
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);

  // Usar el hook de plantillas
  const { templates } = useActivityTemplates();

  // Usar el hook de datos frecuentes
  const {
    frequentData,
    processActivities,
    processActivity,
    getRolesForPerson,
    getDependenciesForPerson,
    addPersonRoleRelation,
    addPersonDependencyRelation,
    addValue
  } = useFrequentData();

  // Procesar actividades existentes para sugerencias
  useEffect(() => {
    if (activitiesData?.content && activitiesData.content.length > 0) {
      processActivities(activitiesData.content);
    }
  }, [activitiesData, processActivities]);

  // Usar el hook de presencia para esta actividad
  const {
    userNames,
    registerAsEditor,
    isSomeoneElseEditing
  } = useActivityPresence(activity?.id || 0);

  // Registrar al usuario como editor al montar el componente
  useEffect(() => {
    if (isEditing && activity?.id) {
      registerAsEditor();
    }
  }, [isEditing, activity?.id, registerAsEditor]);

  // Configurar React Hook Form con validación Zod
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
    reset,
    getValues,
    setValue,
    watch
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activityCreateSchema),
    defaultValues: {
      date: formatDateForInput(activity?.date) || formatDateForInput(new Date().toISOString()),
      time: formatTimeForInput(activity?.date) || formatTimeForInput(new Date().toISOString()),
      type: activity?.type || ActivityType.OTRO,
      description: activity?.description || '',
      person: activity?.person || '',
      role: activity?.role || '',
      dependency: activity?.dependency || '',
      situation: activity?.situation || '',
      result: activity?.result || '',
      status: activity?.status || ActivityStatus.PENDIENTE,
      comments: activity?.comments || '',
      agent: activity?.agent || ''
    },
    mode: 'onChange' // Validar al cambiar los campos
  });

  // Observar el campo de persona para sugerencias contextuales
  const currentPerson = watch('person');

  // Manejar la tecla Escape para cerrar el formulario
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Manejar el envío del formulario
  const onSubmit = async (data: ActivityFormData) => {
    try {
      // Combinar fecha y hora
      const dateTime = new Date(`${data.date}T${data.time}:00`);

      const activityData = {
        ...data,
        date: dateTime.toISOString().replace(/\.\d{3}Z$/, ''),
        lastStatusChangeDate: new Date().toISOString().replace(/\.\d{3}Z$/, '')
      };

      // Eliminar el campo time ya que está incluido en date
      delete (activityData as any).time;

      let savedActivity;

      if (isEditing && activity) {
        savedActivity = await updateActivity.mutateAsync({
          id: activity.id,
          activityData: activityData
        });
        toast.success('Actividad actualizada correctamente', 'Actividad actualizada');
      } else {
        savedActivity = await createActivity.mutateAsync(activityData);
        toast.success('Actividad creada correctamente', 'Actividad creada');
      }

      // Procesar la actividad para actualizar datos frecuentes
      if (savedActivity) {
        processActivity(savedActivity);
      }

      onClose();
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Error al guardar la actividad. Intente nuevamente.');
    }
  };

  // Manejar clic en el overlay para cerrar
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Manejar la selección de una plantilla
  const handleSelectTemplate = (template: ActivityTemplate) => {
    // Mantener la fecha y hora actuales
    const currentDate = getValues('date');
    const currentTime = getValues('time');

    // Aplicar la plantilla al formulario
    reset({
      ...template.data,
      date: currentDate,
      time: currentTime
    });

    toast.success(`Plantilla "${template.name}" aplicada correctamente`, 'Plantilla aplicada');
  };

  // Manejar guardar como plantilla
  const handleSaveAsTemplate = () => {
    setShowSaveTemplateDialog(true);
  };

  // Manejar gestión de plantillas
  const handleManageTemplates = () => {
    setShowTemplateManager(true);
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <FormContainer>
        <FormHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Title>{isEditing ? 'Editar actividad' : 'Nueva actividad'}</Title>
            {isEditing && activity?.id && (
              <PresenceIndicator
                activityId={activity.id}
                size="small"
                position="inline"
                userNames={userNames}
              />
            )}
          </div>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </FormHeader>

        {isEditing && isSomeoneElseEditing && (
          <EditingWarning>
            <FiAlertTriangle size={16} />
            <span>Otro usuario está editando esta actividad. Los cambios podrían sobrescribirse.</span>
          </EditingWarning>
        )}

        <FormContent>
          <form onSubmit={handleSubmit(onSubmit as any)}>
            <FormGrid>
              <FormGroup>
                <FormLabel htmlFor="date">
                  Fecha
                  <div className="tooltip">
                    <FiHelpCircle size={14} />
                    <span className="tooltip-text">Fecha en que se realizó la actividad</span>
                  </div>
                </FormLabel>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="date"
                      type="date"
                      hasError={!!errors.date}
                      {...field}
                    />
                  )}
                />
                {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="time">
                  Hora
                </FormLabel>
                <Controller
                  name="time"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="time"
                      type="time"
                      hasError={!!errors.time}
                      {...field}
                    />
                  )}
                />
                {errors.time && <ErrorMessage>{errors.time.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="type">
                  Tipo de actividad
                </FormLabel>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="type"
                      hasError={!!errors.type}
                      {...field}
                    >
                      <option value="">Seleccionar tipo</option>
                      {Object.values(ActivityType).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Select>
                  )}
                />
                {errors.type && <ErrorMessage>{errors.type.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="status">
                  Estado
                </FormLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="status"
                      hasError={!!errors.status}
                      {...field}
                    >
                      {Object.values(ActivityStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </Select>
                  )}
                />
                {errors.status && <ErrorMessage>{errors.status.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="person">
                  Persona
                  <div className="tooltip">
                    <FiHelpCircle size={14} />
                    <span className="tooltip-text">Persona relacionada con la actividad</span>
                  </div>
                </FormLabel>
                <Controller
                  name="person"
                  control={control}
                  render={({ field }) => (
                    <AutocompleteInput
                      id="person"
                      placeholder="Nombre de la persona relacionada"
                      error={errors.person?.message}
                      suggestions={frequentData.persons}
                      onSuggestionSelected={(suggestion) => {
                        // Al seleccionar una sugerencia, actualizar el campo
                        field.onChange(suggestion);
                      }}
                      {...field}
                    />
                  )}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="role">
                  Cargo / Rol
                  <div className="tooltip">
                    <FiHelpCircle size={14} />
                    <span className="tooltip-text">Cargo o rol de la persona</span>
                  </div>
                </FormLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <AutocompleteInput
                      id="role"
                      placeholder="Cargo o rol de la persona"
                      error={errors.role?.message}
                      suggestions={getRolesForPerson(currentPerson)}
                      onSuggestionSelected={(suggestion) => {
                        field.onChange(suggestion);
                        // Si hay una persona seleccionada, guardar la relación
                        if (currentPerson) {
                          addPersonRoleRelation(currentPerson, suggestion);
                        }
                      }}
                      {...field}
                    />
                  )}
                />
                {currentPerson && (
                  <ContextualHint>
                    <FiInfo size={12} />
                    Sugerencias basadas en el historial de {currentPerson}
                  </ContextualHint>
                )}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="dependency">
                  Dependencia
                  <div className="tooltip">
                    <FiHelpCircle size={14} />
                    <span className="tooltip-text">Dependencia o área relacionada</span>
                  </div>
                </FormLabel>
                <Controller
                  name="dependency"
                  control={control}
                  render={({ field }) => (
                    <AutocompleteInput
                      id="dependency"
                      placeholder="Dependencia o área"
                      error={errors.dependency?.message}
                      suggestions={getDependenciesForPerson(currentPerson)}
                      onSuggestionSelected={(suggestion) => {
                        field.onChange(suggestion);
                        // Si hay una persona seleccionada, guardar la relación
                        if (currentPerson) {
                          addPersonDependencyRelation(currentPerson, suggestion);
                        }
                      }}
                      {...field}
                    />
                  )}
                />
                {currentPerson && (
                  <ContextualHint>
                    <FiInfo size={12} />
                    Sugerencias basadas en el historial de {currentPerson}
                  </ContextualHint>
                )}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="agent">
                  Agente
                  <div className="tooltip">
                    <FiHelpCircle size={14} />
                    <span className="tooltip-text">Agente responsable de la actividad</span>
                  </div>
                </FormLabel>
                <Controller
                  name="agent"
                  control={control}
                  render={({ field }) => (
                    <AutocompleteInput
                      id="agent"
                      placeholder="Agente responsable"
                      error={errors.agent?.message}
                      suggestions={frequentData.agents}
                      onSuggestionSelected={(suggestion) => {
                        field.onChange(suggestion);
                      }}
                      {...field}
                    />
                  )}
                />
              </FormGroup>

              <FormGroup fullWidth>
                <FormLabel htmlFor="description">
                  Descripción
                </FormLabel>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="description"
                      placeholder="Descripción detallada de la actividad"
                      hasError={!!errors.description}
                      {...field}
                    />
                  )}
                />
                {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup fullWidth>
                <FormLabel htmlFor="situation">
                  Situación
                </FormLabel>
                <Controller
                  name="situation"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="situation"
                      placeholder="Situación o contexto"
                      hasError={!!errors.situation}
                      {...field}
                    />
                  )}
                />
                {errors.situation && <ErrorMessage>{errors.situation.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup fullWidth>
                <FormLabel htmlFor="result">
                  Resultado
                </FormLabel>
                <Controller
                  name="result"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="result"
                      placeholder="Resultado de la actividad"
                      hasError={!!errors.result}
                      {...field}
                    />
                  )}
                />
                {errors.result && <ErrorMessage>{errors.result.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup fullWidth>
                <FormLabel htmlFor="comments">
                  Comentarios
                </FormLabel>
                <Controller
                  name="comments"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="comments"
                      placeholder="Comentarios adicionales"
                      hasError={!!errors.comments}
                      {...field}
                    />
                  )}
                />
                {errors.comments && <ErrorMessage>{errors.comments.message}</ErrorMessage>}
              </FormGroup>
            </FormGrid>
          </form>
        </FormContent>

        <FormFooter>
          <div style={{ display: 'flex', gap: '12px', zIndex: 2 }}>
            <div style={{ width: '200px' }}>
              <TemplateSelector
                onSelectTemplate={handleSelectTemplate}
                onManageTemplates={handleManageTemplates}
              />
            </div>
            <TemplateButton onClick={handleSaveAsTemplate}>
              <FiStar size={16} />
              Guardar como plantilla
            </TemplateButton>
          </div>
          <div style={{ display: 'flex', gap: '12px', zIndex: 1 }}>
            <CancelButton onClick={onClose}>
              Cancelar
            </CancelButton>
            <SubmitButton
              onClick={handleSubmit(onSubmit as any)}
              disabled={isSubmitting || (!isDirty && isEditing)}
            >
              <FiSave size={18} />
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </SubmitButton>
          </div>
        </FormFooter>

        {/* Diálogos de plantillas */}
        {showSaveTemplateDialog && (
          <SaveTemplateDialog
            formData={getValues()}
            onClose={() => setShowSaveTemplateDialog(false)}
            onSaved={() => {
              setShowSaveTemplateDialog(false);
              toast.success('Plantilla guardada correctamente', 'Plantilla guardada');
            }}
          />
        )}

        {showTemplateManager && (
          <TemplateManager
            onClose={() => setShowTemplateManager(false)}
          />
        )}
      </FormContainer>
    </Overlay>
  );
};

export default ActivityForm;
