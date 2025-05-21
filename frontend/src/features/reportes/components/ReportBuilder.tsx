import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiFileText, 
  FiPlay, 
  FiSave, 
  FiClock,
  FiCalendar,
  FiMail,
  FiX,
  FiCheck,
  FiAlertTriangle
} from 'react-icons/fi';
import { 
  useAvailableFields, 
  useExecuteReport, 
  useSaveReport 
} from '../hooks/useCustomReports';
import { 
  ReportDefinition, 
  SavedReport, 
  ReportExportFormat 
} from '../types/customReportTypes';
import FieldSelector from './FieldSelector';
import FilterBuilder from './FilterBuilder';
import SortBuilder from './SortBuilder';
import GroupBySelector from './GroupBySelector';
import ReportResults from './ReportResults';

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.cardBackground};
  color: ${({ theme, $primary }) => 
    $primary ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.border};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme, $primary }) => 
      $primary ? theme.primaryDark : theme.hoverBackground};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BuilderContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const BuilderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const ResultsSection = styled.div`
  grid-column: 1 / -1;
`;

const SaveReportModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: 24px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Textarea = styled.textarea`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const ScheduleReportModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const RecipientsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  background-color: ${({ theme }) => theme.backgroundInput};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  min-height: 42px;
`;

const Recipient = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.primary + '10'};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 4px;
  font-size: 13px;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: none;
  color: ${({ theme }) => theme.textSecondary};
  border: none;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: ${({ theme }) => theme.error};
  }
`;

const RecipientInput = styled.input`
  flex: 1;
  min-width: 100px;
  border: none;
  background: none;
  padding: 4px;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  
  &:focus {
    outline: none;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ValidationError = styled.div`
  color: ${({ theme }) => theme.error};
  font-size: 13px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LoadingSpinner = styled(FiClock)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

interface ReportBuilderProps {
  initialReport?: SavedReport;
}

/**
 * Componente principal para construir reportes personalizados
 */
const ReportBuilder: React.FC<ReportBuilderProps> = ({ initialReport }) => {
  // Estado para la definición del reporte
  const [reportDefinition, setReportDefinition] = useState<ReportDefinition>({
    fields: initialReport?.definition.fields || [],
    filters: initialReport?.definition.filters || [],
    sortBy: initialReport?.definition.sortBy || [],
    groupBy: initialReport?.definition.groupBy || [],
    limit: initialReport?.definition.limit || 100
  });
  
  // Estado para el modal de guardar reporte
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [reportName, setReportName] = useState(initialReport?.name || '');
  const [reportDescription, setReportDescription] = useState(initialReport?.description || '');
  
  // Estado para el modal de programar reporte
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleName, setScheduleName] = useState('');
  const [frequency, setFrequency] = useState<string>('DAILY');
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [time, setTime] = useState<string>('08:00');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState('');
  const [exportFormat, setExportFormat] = useState<ReportExportFormat>('PDF');
  
  // Estado para validación
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Consultas
  const { data: availableFields, isLoading: isLoadingFields } = useAvailableFields();
  const executeReport = useExecuteReport();
  const saveReport = useSaveReport();
  
  // Efecto para inicializar el reporte
  useEffect(() => {
    if (initialReport) {
      setReportDefinition(initialReport.definition);
      setReportName(initialReport.name);
      setReportDescription(initialReport.description || '');
    }
  }, [initialReport]);
  
  // Función para ejecutar el reporte
  const handleExecuteReport = () => {
    if (reportDefinition.fields.length === 0) {
      setValidationErrors({
        ...validationErrors,
        fields: 'Debes seleccionar al menos un campo para el reporte'
      });
      return;
    }
    
    setValidationErrors({});
    executeReport.mutate(reportDefinition);
  };
  
  // Función para guardar el reporte
  const handleSaveReport = () => {
    // Validar campos
    const errors: Record<string, string> = {};
    
    if (!reportName.trim()) {
      errors.name = 'El nombre del reporte es obligatorio';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    const report: SavedReport = {
      id: initialReport?.id || '',
      name: reportName,
      description: reportDescription,
      definition: reportDefinition,
      createdAt: initialReport?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveReport.mutate(report);
    setShowSaveModal(false);
  };
  
  // Función para programar el reporte
  const handleScheduleReport = () => {
    // Validar campos
    const errors: Record<string, string> = {};
    
    if (!scheduleName.trim()) {
      errors.scheduleName = 'El nombre de la programación es obligatorio';
    }
    
    if (recipients.length === 0) {
      errors.recipients = 'Debes agregar al menos un destinatario';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Aquí iría la lógica para programar el reporte
    console.log('Programar reporte:', {
      name: scheduleName,
      frequency,
      dayOfWeek,
      dayOfMonth,
      time,
      recipients,
      exportFormat
    });
    
    setShowScheduleModal(false);
  };
  
  // Función para agregar un destinatario
  const addRecipient = (email: string) => {
    if (email && !recipients.includes(email) && isValidEmail(email)) {
      setRecipients([...recipients, email]);
      setRecipientInput('');
      setValidationErrors({
        ...validationErrors,
        recipients: ''
      });
    } else if (email && !isValidEmail(email)) {
      setValidationErrors({
        ...validationErrors,
        recipientInput: 'Email inválido'
      });
    }
  };
  
  // Función para eliminar un destinatario
  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };
  
  // Función para validar email
  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Función para exportar el reporte
  const handleExportReport = (format: ReportExportFormat) => {
    // Aquí iría la lógica para exportar el reporte
    console.log('Exportar reporte en formato:', format);
  };
  
  return (
    <Container>
      <Header>
        <Title>
          <FiFileText size={24} />
          {initialReport ? 'Editar Reporte' : 'Nuevo Reporte'}
        </Title>
        
        <ActionButtons>
          <Button 
            onClick={handleExecuteReport}
            disabled={executeReport.isPending || reportDefinition.fields.length === 0}
            $primary
          >
            {executeReport.isPending ? (
              <>
                <LoadingSpinner size={16} />
                Ejecutando...
              </>
            ) : (
              <>
                <FiPlay size={16} />
                Ejecutar Reporte
              </>
            )}
          </Button>
          
          <Button onClick={() => setShowSaveModal(true)}>
            <FiSave size={16} />
            Guardar Reporte
          </Button>
          
          <Button onClick={() => setShowScheduleModal(true)}>
            <FiClock size={16} />
            Programar Reporte
          </Button>
        </ActionButtons>
      </Header>
      
      <BuilderContainer>
        <BuilderSection>
          <Card>
            <FieldSelector 
              availableFields={availableFields || []}
              selectedFields={reportDefinition.fields}
              onFieldsChange={(fields) => {
                setReportDefinition({
                  ...reportDefinition,
                  fields
                });
                setValidationErrors({
                  ...validationErrors,
                  fields: ''
                });
              }}
            />
            {validationErrors.fields && (
              <ValidationError>
                <FiAlertTriangle size={14} />
                {validationErrors.fields}
              </ValidationError>
            )}
          </Card>
          
          <Card>
            <FilterBuilder 
              availableFields={availableFields || []}
              filters={reportDefinition.filters}
              onFiltersChange={(filters) => {
                setReportDefinition({
                  ...reportDefinition,
                  filters
                });
              }}
            />
          </Card>
        </BuilderSection>
        
        <BuilderSection>
          <Card>
            <SortBuilder 
              availableFields={availableFields || []}
              sortBy={reportDefinition.sortBy || []}
              onSortChange={(sortBy) => {
                setReportDefinition({
                  ...reportDefinition,
                  sortBy
                });
              }}
            />
          </Card>
          
          <Card>
            <GroupBySelector 
              availableFields={availableFields || []}
              selectedFields={reportDefinition.fields}
              groupBy={reportDefinition.groupBy || []}
              onGroupByChange={(groupBy) => {
                setReportDefinition({
                  ...reportDefinition,
                  groupBy
                });
              }}
            />
          </Card>
        </BuilderSection>
        
        <ResultsSection>
          <Card>
            <ReportResults 
              result={executeReport.data}
              isLoading={executeReport.isPending}
              onRefresh={handleExecuteReport}
              onExport={handleExportReport}
            />
          </Card>
        </ResultsSection>
      </BuilderContainer>
      
      {/* Modal para guardar reporte */}
      {showSaveModal && (
        <SaveReportModal onClick={() => setShowSaveModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <FiSave size={18} />
                Guardar Reporte
              </ModalTitle>
              <CloseButton onClick={() => setShowSaveModal(false)}>
                <FiX size={20} />
              </CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <Label htmlFor="reportName">Nombre del Reporte *</Label>
              <Input 
                id="reportName"
                value={reportName}
                onChange={(e) => {
                  setReportName(e.target.value);
                  setValidationErrors({
                    ...validationErrors,
                    name: ''
                  });
                }}
                placeholder="Ingrese un nombre para el reporte"
              />
              {validationErrors.name && (
                <ValidationError>
                  <FiAlertTriangle size={14} />
                  {validationErrors.name}
                </ValidationError>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="reportDescription">Descripción</Label>
              <Textarea 
                id="reportDescription"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Ingrese una descripción para el reporte (opcional)"
              />
            </FormGroup>
            
            <ModalActions>
              <Button onClick={() => setShowSaveModal(false)}>
                Cancelar
              </Button>
              <Button 
                $primary 
                onClick={handleSaveReport}
                disabled={saveReport.isPending}
              >
                {saveReport.isPending ? (
                  <>
                    <LoadingSpinner size={16} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <FiCheck size={16} />
                    Guardar
                  </>
                )}
              </Button>
            </ModalActions>
          </ModalContent>
        </SaveReportModal>
      )}
      
      {/* Modal para programar reporte */}
      {showScheduleModal && (
        <ScheduleReportModal onClick={() => setShowScheduleModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <FiClock size={18} />
                Programar Reporte
              </ModalTitle>
              <CloseButton onClick={() => setShowScheduleModal(false)}>
                <FiX size={20} />
              </CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <Label htmlFor="scheduleName">Nombre de la Programación *</Label>
              <Input 
                id="scheduleName"
                value={scheduleName}
                onChange={(e) => {
                  setScheduleName(e.target.value);
                  setValidationErrors({
                    ...validationErrors,
                    scheduleName: ''
                  });
                }}
                placeholder="Ingrese un nombre para la programación"
              />
              {validationErrors.scheduleName && (
                <ValidationError>
                  <FiAlertTriangle size={14} />
                  {validationErrors.scheduleName}
                </ValidationError>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="frequency">Frecuencia</Label>
              <Select 
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="DAILY">Diaria</option>
                <option value="WEEKLY">Semanal</option>
                <option value="MONTHLY">Mensual</option>
                <option value="QUARTERLY">Trimestral</option>
                <option value="YEARLY">Anual</option>
              </Select>
            </FormGroup>
            
            {frequency === 'WEEKLY' && (
              <FormGroup>
                <Label htmlFor="dayOfWeek">Día de la Semana</Label>
                <Select 
                  id="dayOfWeek"
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
                >
                  <option value={1}>Lunes</option>
                  <option value={2}>Martes</option>
                  <option value={3}>Miércoles</option>
                  <option value={4}>Jueves</option>
                  <option value={5}>Viernes</option>
                  <option value={6}>Sábado</option>
                  <option value={0}>Domingo</option>
                </Select>
              </FormGroup>
            )}
            
            {(frequency === 'MONTHLY' || frequency === 'QUARTERLY' || frequency === 'YEARLY') && (
              <FormGroup>
                <Label htmlFor="dayOfMonth">Día del Mes</Label>
                <Select 
                  id="dayOfMonth"
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(parseInt(e.target.value))}
                >
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            )}
            
            <FormGroup>
              <Label htmlFor="time">Hora</Label>
              <Input 
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="recipients">Destinatarios *</Label>
              <RecipientsList>
                {recipients.map((email, index) => (
                  <Recipient key={index}>
                    {email}
                    <RemoveButton onClick={() => removeRecipient(email)}>
                      <FiX size={12} />
                    </RemoveButton>
                  </Recipient>
                ))}
                <RecipientInput 
                  value={recipientInput}
                  onChange={(e) => {
                    setRecipientInput(e.target.value);
                    setValidationErrors({
                      ...validationErrors,
                      recipientInput: ''
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addRecipient(recipientInput);
                    }
                  }}
                  placeholder={recipients.length === 0 ? "Ingrese emails y presione Enter..." : ""}
                />
              </RecipientsList>
              {validationErrors.recipients && (
                <ValidationError>
                  <FiAlertTriangle size={14} />
                  {validationErrors.recipients}
                </ValidationError>
              )}
              {validationErrors.recipientInput && (
                <ValidationError>
                  <FiAlertTriangle size={14} />
                  {validationErrors.recipientInput}
                </ValidationError>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="exportFormat">Formato de Exportación</Label>
              <Select 
                id="exportFormat"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as ReportExportFormat)}
              >
                <option value="PDF">PDF</option>
                <option value="EXCEL">Excel</option>
                <option value="CSV">CSV</option>
              </Select>
            </FormGroup>
            
            <ModalActions>
              <Button onClick={() => setShowScheduleModal(false)}>
                Cancelar
              </Button>
              <Button 
                $primary 
                onClick={handleScheduleReport}
              >
                <FiCalendar size={16} />
                Programar
              </Button>
            </ModalActions>
          </ModalContent>
        </ScheduleReportModal>
      )}
    </Container>
  );
};

export default ReportBuilder;
