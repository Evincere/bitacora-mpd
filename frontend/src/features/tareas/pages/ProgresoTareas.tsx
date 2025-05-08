import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiCalendar,
  FiEdit,
  FiCheck,
  FiPaperclip,
  FiMessageSquare,
  FiLoader,
  FiRefreshCw,
  FiShield
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import AddExecutePermission from '@/components/debug/AddExecutePermission';

// Hooks y servicios
import useTareas from '../hooks/useTareas';

// Datos de ejemplo para mostrar en la interfaz
const MOCK_TAREAS_EN_PROGRESO = [
  {
    id: 3,
    titulo: 'Análisis de caso',
    descripcion: 'Realizar un análisis detallado del caso #67890 para identificar fortalezas y debilidades.',
    categoria: 'LEGAL',
    prioridad: 'CRITICAL',
    fechaAsignacion: '2025-04-25T09:45:00',
    fechaLimite: '2025-05-05',
    estado: 'IN_PROGRESS',
    solicitante: 'Pedro Gómez',
    asignador: 'Carlos Rodríguez',
    notas: 'Este caso es prioritario debido a la proximidad de la audiencia.',
    progreso: 65,
    ultimaActualizacion: '2025-05-01T14:30:00',
    comentarios: [
      { id: 1, fecha: '2025-04-26T10:15:00', usuario: 'Ana Martínez', mensaje: 'He comenzado a revisar la documentación del caso.' },
      { id: 2, fecha: '2025-04-28T16:45:00', usuario: 'Pedro Gómez', mensaje: '¿Cómo va el avance? Necesitamos tener esto listo para la audiencia.' },
      { id: 3, fecha: '2025-04-29T09:30:00', usuario: 'Ana Martínez', mensaje: 'Estoy avanzando bien, ya tengo identificados los puntos principales. Terminaré a tiempo.' }
    ]
  },
  {
    id: 4,
    titulo: 'Análisis financiero',
    descripcion: 'Realizar un análisis financiero de la documentación del caso #24680.',
    categoria: 'FINANCIERA',
    prioridad: 'MEDIUM',
    fechaAsignacion: '2025-04-20T11:00:00',
    fechaLimite: '2025-05-12',
    estado: 'IN_PROGRESS',
    solicitante: 'María López',
    asignador: 'Carlos Rodríguez',
    notas: 'Verificar especialmente los movimientos bancarios de los últimos 6 meses.',
    progreso: 30,
    ultimaActualizacion: '2025-04-30T11:20:00',
    comentarios: [
      { id: 1, fecha: '2025-04-22T14:30:00', usuario: 'Ana Martínez', mensaje: 'He comenzado a revisar los estados financieros.' },
      { id: 2, fecha: '2025-04-25T10:15:00', usuario: 'María López', mensaje: 'Por favor, presta especial atención a las transferencias internacionales.' }
    ]
  }
];

const PageContainer = styled.div`
  padding: 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const TareasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const TareaCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

const TareaHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const TareaTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

const TareaMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  ${({ $status, theme }) => {
    switch ($status) {
      case 'REQUESTED':
        return `
          background-color: ${theme.infoLight};
          color: ${theme.info};
        `;
      case 'ASSIGNED':
        return `
          background-color: ${theme.warningLight};
          color: ${theme.warning};
        `;
      case 'IN_PROGRESS':
        return `
          background-color: ${theme.primaryLight};
          color: ${theme.primary};
        `;
      case 'COMPLETED':
        return `
          background-color: ${theme.successLight};
          color: ${theme.success};
        `;
      case 'APPROVED':
        return `
          background-color: ${theme.successLight};
          color: ${theme.success};
        `;
      case 'REJECTED':
        return `
          background-color: ${theme.errorLight};
          color: ${theme.error};
        `;
      default:
        return `
          background-color: ${theme.backgroundHover};
          color: ${theme.textSecondary};
        `;
    }
  }}
`;

const PriorityBadge = styled.span<{ $priority: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  ${({ $priority, theme }) => {
    switch ($priority) {
      case 'CRITICAL':
        return `
          background-color: ${theme.errorLight};
          color: ${theme.error};
        `;
      case 'HIGH':
        return `
          background-color: ${theme.warningLight};
          color: ${theme.warning};
        `;
      case 'MEDIUM':
        return `
          background-color: ${theme.infoLight};
          color: ${theme.info};
        `;
      case 'LOW':
        return `
          background-color: ${theme.successLight};
          color: ${theme.success};
        `;
      case 'TRIVIAL':
        return `
          background-color: ${theme.backgroundHover};
          color: ${theme.textSecondary};
        `;
      default:
        return `
          background-color: ${theme.backgroundHover};
          color: ${theme.textSecondary};
        `;
    }
  }}
`;

const TareaDate = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 12px;
`;

const TareaContent = styled.div`
  padding: 16px;
`;

const ProgressContainer = styled.div`
  margin-bottom: 16px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ProgressLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ProgressValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background-color: ${({ theme }) => theme.primary};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const TareaDescription = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const TareaInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const TareaInfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
`;

const TareaInfoIcon = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 2px;
`;

const TareaInfoContent = styled.div`
  flex: 1;
`;

const TareaInfoLabel = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  margin-right: 4px;
`;

const TareaInfoValue = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const TareaActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'success' | 'warning' | 'danger' }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: ${theme.primary};
          color: white;
          &:hover {
            background-color: ${theme.primaryDark};
          }
        `;
      case 'success':
        return `
          background-color: ${theme.success};
          color: white;
          &:hover {
            background-color: ${theme.successDark};
          }
        `;
      case 'warning':
        return `
          background-color: ${theme.warning};
          color: white;
          &:hover {
            background-color: ${theme.warningDark};
          }
        `;
      case 'danger':
        return `
          background-color: ${theme.error};
          color: white;
          &:hover {
            background-color: ${theme.errorDark};
          }
        `;
      default:
        return `
          background-color: ${theme.backgroundAlt};
          color: ${theme.textSecondary};
          &:hover {
            background-color: ${theme.backgroundHover};
            color: ${theme.text};
          }
        `;
    }
  }}
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  text-align: center;

  svg {
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 16px;
  }

  h3 {
    margin: 0 0 8px;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0 0 20px;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

// Función para formatear fechas
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Función para formatear fechas con hora
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Función para obtener el texto de estado
const getStatusText = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return 'Solicitada';
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
      return <FiClock size={14} />;
    case 'ASSIGNED':
      return <FiClock size={14} />;
    case 'IN_PROGRESS':
      return <FiClock size={14} />;
    case 'COMPLETED':
      return <FiCheckCircle size={14} />;
    case 'APPROVED':
      return <FiCheckCircle size={14} />;
    case 'REJECTED':
      return <FiXCircle size={14} />;
    default:
      return <FiAlertCircle size={14} />;
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

// Función para obtener el texto de categoría
const getCategoryText = (category: string) => {
  switch (category) {
    case 'ADMINISTRATIVA':
      return 'Administrativa';
    case 'LEGAL':
      return 'Legal';
    case 'TECNICA':
      return 'Técnica';
    case 'FINANCIERA':
      return 'Financiera';
    case 'RECURSOS_HUMANOS':
      return 'Recursos Humanos';
    case 'OTRA':
      return 'Otra';
    default:
      return category;
  }
};

const ProgresoTareas: React.FC = () => {
  const navigate = useNavigate();

  // Usar el hook personalizado para tareas
  const {
    inProgressTasks = [],
    isLoadingInProgressTasks,
    refreshAllData,
    completeTask
  } = useTareas();

  // Convertir las tareas al formato esperado por el componente
  const tareas = (inProgressTasks || []).map(task => ({
    id: task.id,
    titulo: task.title || '',
    descripcion: task.description || '',
    categoria: task.category || '',
    prioridad: task.priority || 'MEDIUM',
    fechaAsignacion: task.requestDate || '',
    fechaLimite: task.dueDate || '',
    estado: task.status,
    solicitante: task.requesterName || '',
    asignador: task.assignerName || '',
    notas: task.comments || '',
    progreso: task.progress || 0,
    ultimaActualizacion: task.updatedAt || new Date().toISOString(),
    comentarios: task.comments ? [{ id: 1, fecha: task.updatedAt || '', usuario: task.requesterName || '', mensaje: task.comments }] : []
  }));

  // Cargar datos al montar el componente
  useEffect(() => {
    console.log('ProgresoTareas: Montando componente...');

    // Cargar datos iniciales
    refreshAllData();

    // Recargar datos después de un breve retraso para asegurar que estén actualizados
    setTimeout(() => {
      console.log('ProgresoTareas: Recarga adicional de datos...');
      refreshAllData();
    }, 2000);

    // Configurar un intervalo para actualizar los datos cada 15 segundos
    const intervalId = setInterval(() => {
      console.log('ProgresoTareas: Actualizando datos de tareas en progreso...');
      refreshAllData();
    }, 15000);

    // Limpiar el intervalo al desmontar el componente
    return () => {
      console.log('ProgresoTareas: Desmontando componente, limpiando intervalo');
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efecto para registrar cambios en las tareas en progreso
  useEffect(() => {
    console.log('ProgresoTareas: Tareas en progreso actualizadas:', inProgressTasks);
  }, [inProgressTasks]);

  const handleActualizarProgreso = (id: number) => {
    navigate(`/app/tareas/actualizar-progreso/${id}`);
  };

  const handleCompletarTarea = (id: number) => {
    completeTask({
      activityId: id,
      result: 'Completada satisfactoriamente',
      actualHours: 1 // Valor por defecto para las horas reales
    }, {
      onSuccess: () => {
        toast.success('Tarea completada correctamente');
        refreshAllData();
      }
    });
  };

  const handleRefresh = () => {
    refreshAllData();
    toast.info('Actualizando datos...');
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Tareas en Progreso</PageTitle>
        <ActionButton onClick={handleRefresh}>
          <FiRefreshCw size={16} />
          Actualizar
        </ActionButton>
      </PageHeader>

      {isLoadingInProgressTasks ? (
        <EmptyState>
          <FiLoader size={48} style={{ animation: 'spin 1s linear infinite' }} />
          <h3>Cargando tareas</h3>
          <p>Por favor, espere mientras se cargan las tareas en progreso.</p>
        </EmptyState>
      ) : tareas.length > 0 ? (
        <TareasGrid>
          {tareas.map((tarea) => (
            <TareaCard key={tarea.id}>
              <TareaHeader>
                <TareaTitle>{tarea.titulo}</TareaTitle>
                <TareaMeta>
                  <StatusBadge $status={tarea.estado}>
                    {getStatusIcon(tarea.estado)}
                    {getStatusText(tarea.estado)}
                  </StatusBadge>
                  <PriorityBadge $priority={tarea.prioridad}>
                    {getPriorityText(tarea.prioridad)}
                  </PriorityBadge>
                </TareaMeta>
              </TareaHeader>
              <TareaContent>
                <ProgressContainer>
                  <ProgressHeader>
                    <ProgressLabel>Progreso</ProgressLabel>
                    <ProgressValue>{tarea.progreso}%</ProgressValue>
                  </ProgressHeader>
                  <ProgressBar>
                    <ProgressFill $percentage={tarea.progreso} />
                  </ProgressBar>
                </ProgressContainer>

                <TareaDescription>{tarea.descripcion}</TareaDescription>

                <TareaInfoList>
                  <TareaInfoItem>
                    <TareaInfoIcon>
                      <FiCalendar size={14} />
                    </TareaInfoIcon>
                    <TareaInfoContent>
                      <TareaInfoLabel>Fecha límite:</TareaInfoLabel>
                      <TareaInfoValue>{formatDate(tarea.fechaLimite)}</TareaInfoValue>
                    </TareaInfoContent>
                  </TareaInfoItem>
                  <TareaInfoItem>
                    <TareaInfoIcon>
                      <FiClock size={14} />
                    </TareaInfoIcon>
                    <TareaInfoContent>
                      <TareaInfoLabel>Última actualización:</TareaInfoLabel>
                      <TareaInfoValue>{formatDateTime(tarea.ultimaActualizacion)}</TareaInfoValue>
                    </TareaInfoContent>
                  </TareaInfoItem>
                  <TareaInfoItem>
                    <TareaInfoIcon>
                      <FiMessageSquare size={14} />
                    </TareaInfoIcon>
                    <TareaInfoContent>
                      <TareaInfoLabel>Comentarios:</TareaInfoLabel>
                      <TareaInfoValue>{tarea.comentarios.length}</TareaInfoValue>
                    </TareaInfoContent>
                  </TareaInfoItem>
                </TareaInfoList>

                <TareaActions>
                  <ActionButton onClick={() => handleActualizarProgreso(tarea.id)}>
                    <FiEdit size={14} />
                    Actualizar progreso
                  </ActionButton>
                  <ActionButton $variant="success" onClick={() => handleCompletarTarea(tarea.id)}>
                    <FiCheck size={14} />
                    Completar
                  </ActionButton>
                </TareaActions>
              </TareaContent>
            </TareaCard>
          ))}
        </TareasGrid>
      ) : (
        <EmptyState>
          <FiAlertCircle size={48} />
          <h3>No hay tareas en progreso</h3>
          <p>Actualmente no tienes tareas en estado "En Progreso". Puedes iniciar una tarea desde la sección "Mis Tareas".</p>
          <ActionButton onClick={handleRefresh} style={{ marginTop: '16px' }}>
            <FiRefreshCw size={16} />
            Actualizar datos
          </ActionButton>
        </EmptyState>
      )}

      {/* Componente para añadir el permiso EXECUTE_ACTIVITIES */}
      <AddExecutePermission />
    </PageContainer>
  );
};

export default ProgresoTareas;
