import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiTool, 
  FiRefreshCw, 
  FiXCircle, 
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiPlay,
  FiPlus,
  FiChevronDown,
  FiChevronUp,
  FiCalendar
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMaintenanceTasks, useExecuteMaintenanceTask } from '../hooks/useDiagnosticTools';
import { MaintenanceTask } from '../types/diagnosticTypes';

// Estilos
const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.cardBackground};
  color: ${({ theme, $primary }) => 
    $primary ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.border};

  &:hover {
    background-color: ${({ theme, $primary }) => 
      $primary ? theme.primaryDark : theme.hoverBackground};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TaskCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const TaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TaskTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TaskType = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const TaskStatus = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ $status, theme }) => 
    $status === 'COMPLETED' ? theme.success + '20' : 
    $status === 'FAILED' ? theme.error + '20' : 
    $status === 'RUNNING' ? theme.primary + '20' : 
    theme.warning + '20'};
  color: ${({ $status, theme }) => 
    $status === 'COMPLETED' ? theme.success : 
    $status === 'FAILED' ? theme.error : 
    $status === 'RUNNING' ? theme.primary : 
    theme.warning};
`;

const TaskActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TaskDetails = styled.div<{ $expanded: boolean }>`
  padding: ${({ $expanded }) => ($expanded ? '0 16px 16px' : '0')};
  max-height: ${({ $expanded }) => ($expanded ? '1000px' : '0')};
  overflow: hidden;
  transition: all 0.3s ease;
  border-top: ${({ $expanded, theme }) => ($expanded ? `1px solid ${theme.border}` : 'none')};
`;

const DetailSection = styled.div`
  margin-top: 16px;
`;

const DetailTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const DetailValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  word-break: break-word;
`;

const ResultContainer = styled.div<{ $success: boolean }>`
  background-color: ${({ $success, theme }) => 
    $success ? theme.success + '10' : theme.error + '10'};
  border: 1px solid ${({ $success, theme }) => 
    $success ? theme.success + '30' : theme.error + '30'};
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
`;

const ResultMessage = styled.div<{ $success: boolean }>`
  font-size: 14px;
  color: ${({ $success, theme }) => 
    $success ? theme.success : theme.error};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ResultDetails = styled.div`
  background-color: ${({ theme }) => theme.backgroundInput};
  border-radius: 4px;
  padding: 8px;
  font-family: monospace;
  font-size: 12px;
  color: ${({ theme }) => theme.text};
  max-height: 200px;
  overflow-y: auto;
`;

const NewTaskModal = styled.div`
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

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const LoadingSpinner = styled(FiRefreshCw)`
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.textTertiary};
`;

const EmptyStateText = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
`;

/**
 * Componente para mostrar las tareas de mantenimiento
 */
const MaintenanceTasksCard: React.FC = () => {
  // Estado para el modal de nueva tarea
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskType, setNewTaskType] = useState('');
  
  // Estado para la tarea expandida
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  // Consultar tareas
  const { data: tasks, isLoading, isError, refetch } = useMaintenanceTasks();
  
  // Mutación para ejecutar tarea
  const executeTask = useExecuteMaintenanceTask();
  
  // Función para formatear fecha
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm:ss', { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };
  
  // Función para obtener icono de estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <FiCheckCircle size={12} />;
      case 'FAILED':
        return <FiXCircle size={12} />;
      case 'RUNNING':
        return <LoadingSpinner size={12} />;
      case 'SCHEDULED':
        return <FiClock size={12} />;
      default:
        return <FiAlertTriangle size={12} />;
    }
  };
  
  // Función para ejecutar una nueva tarea
  const handleExecuteTask = () => {
    if (!newTaskType) return;
    
    executeTask.mutate({ taskType: newTaskType });
    setShowNewTaskModal(false);
    setNewTaskType('');
  };
  
  // Renderizar detalles de una tarea
  const renderTaskDetails = (task: MaintenanceTask) => {
    return (
      <DetailSection>
        <DetailGrid>
          <DetailItem>
            <DetailLabel>ID</DetailLabel>
            <DetailValue>{task.id}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Tipo</DetailLabel>
            <DetailValue>{task.taskType}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Inicio</DetailLabel>
            <DetailValue>
              <FiCalendar size={12} style={{ marginRight: '4px' }} />
              {formatDate(task.startTime)}
            </DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Fin</DetailLabel>
            <DetailValue>
              <FiCalendar size={12} style={{ marginRight: '4px' }} />
              {formatDate(task.endTime)}
            </DetailValue>
          </DetailItem>
        </DetailGrid>
        
        {Object.keys(task.parameters).length > 0 && (
          <DetailSection>
            <DetailTitle>Parámetros</DetailTitle>
            <DetailGrid>
              {Object.entries(task.parameters).map(([key, value]) => (
                <DetailItem key={key}>
                  <DetailLabel>{key}</DetailLabel>
                  <DetailValue>
                    {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                  </DetailValue>
                </DetailItem>
              ))}
            </DetailGrid>
          </DetailSection>
        )}
        
        {task.result && (
          <ResultContainer $success={task.result.success}>
            <ResultMessage $success={task.result.success}>
              {task.result.success ? <FiCheckCircle size={16} /> : <FiXCircle size={16} />}
              {task.result.message}
            </ResultMessage>
            
            {task.result.details && Object.keys(task.result.details).length > 0 && (
              <ResultDetails>
                {JSON.stringify(task.result.details, null, 2)}
              </ResultDetails>
            )}
          </ResultContainer>
        )}
      </DetailSection>
    );
  };
  
  // Renderizar estado de carga
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <FiTool size={20} />
            Tareas de Mantenimiento
          </CardTitle>
        </CardHeader>
        <EmptyState>
          <LoadingSpinner size={48} />
          <EmptyStateText>Cargando tareas de mantenimiento...</EmptyStateText>
        </EmptyState>
      </Card>
    );
  }
  
  // Renderizar estado de error
  if (isError || !tasks) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <FiTool size={20} />
            Tareas de Mantenimiento
          </CardTitle>
          <ActionButtons>
            <Button onClick={() => refetch()}>
              <FiRefreshCw size={16} />
              Actualizar
            </Button>
          </ActionButtons>
        </CardHeader>
        <EmptyState>
          <EmptyStateIcon>
            <FiXCircle />
          </EmptyStateIcon>
          <EmptyStateText>Error al cargar las tareas de mantenimiento</EmptyStateText>
        </EmptyState>
      </Card>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <FiTool size={20} />
            Tareas de Mantenimiento
          </CardTitle>
          <ActionButtons>
            <Button onClick={() => refetch()}>
              <FiRefreshCw size={16} />
              Actualizar
            </Button>
            <Button $primary onClick={() => setShowNewTaskModal(true)}>
              <FiPlus size={16} />
              Nueva Tarea
            </Button>
          </ActionButtons>
        </CardHeader>
        
        {tasks.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>
              <FiTool />
            </EmptyStateIcon>
            <EmptyStateText>No hay tareas de mantenimiento</EmptyStateText>
          </EmptyState>
        ) : (
          <TasksContainer>
            {tasks.map((task) => {
              const isExpanded = expandedTaskId === task.id;
              
              return (
                <TaskCard key={task.id}>
                  <TaskHeader onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}>
                    <TaskInfo>
                      <TaskTitle>
                        <FiTool size={16} />
                        {task.taskType}
                      </TaskTitle>
                      <TaskType>
                        ID: {task.id}
                      </TaskType>
                    </TaskInfo>
                    
                    <TaskActions>
                      <TaskStatus $status={task.status}>
                        {getStatusIcon(task.status)}
                        {task.status}
                      </TaskStatus>
                      {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </TaskActions>
                  </TaskHeader>
                  
                  <TaskDetails $expanded={isExpanded}>
                    {renderTaskDetails(task)}
                  </TaskDetails>
                </TaskCard>
              );
            })}
          </TasksContainer>
        )}
      </Card>
      
      {showNewTaskModal && (
        <NewTaskModal onClick={() => setShowNewTaskModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Nueva Tarea de Mantenimiento</ModalTitle>
              <CloseButton onClick={() => setShowNewTaskModal(false)}>
                <FiXCircle />
              </CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <Label>Tipo de Tarea</Label>
              <Select 
                value={newTaskType} 
                onChange={(e) => setNewTaskType(e.target.value)}
              >
                <option value="">Seleccionar tipo de tarea</option>
                <option value="CLEAN_OLD_DATA">Limpiar datos antiguos</option>
                <option value="OPTIMIZE_DATABASE">Optimizar base de datos</option>
                <option value="REBUILD_INDEXES">Reconstruir índices</option>
                <option value="VACUUM_DATABASE">Vacuum de base de datos</option>
                <option value="CLEAR_CACHE">Limpiar caché</option>
                <option value="CHECK_INTEGRITY">Verificar integridad</option>
              </Select>
            </FormGroup>
            
            <ModalActions>
              <Button onClick={() => setShowNewTaskModal(false)}>
                Cancelar
              </Button>
              <Button 
                $primary 
                onClick={handleExecuteTask}
                disabled={!newTaskType || executeTask.isPending}
              >
                {executeTask.isPending ? (
                  <>
                    <LoadingSpinner size={16} />
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <FiPlay size={16} />
                    Ejecutar
                  </>
                )}
              </Button>
            </ModalActions>
          </ModalContent>
        </NewTaskModal>
      )}
    </>
  );
};

export default MaintenanceTasksCard;
