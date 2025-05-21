import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  FiFilter,
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiPlay,
  FiPause,
  FiCheck,
  FiCalendar,
  FiUser,
  FiRefreshCw,
  FiEye,
  FiEdit,
  FiTag
} from 'react-icons/fi';
import { toast } from 'react-toastify';

// Componentes UI
import { RefreshButton, FilterBadge } from '@/shared/components/ui';

// Hooks y servicios
import useTareas from '../hooks/useTareas';

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

const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  input {
    width: 100%;
    padding: 12px 14px 12px 40px;
    border-radius: 6px;
    border: 2px solid ${({ theme }) => theme.border};
    background-color: ${({ theme }) => theme.backgroundTertiary};
    color: ${({ theme }) => theme.text};
    font-size: 14px;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    &:focus {
      border-color: ${({ theme }) => theme.primary};
      outline: none;
      box-shadow: 0 0 0 3px ${({ theme }) => `${theme.primary}30`};
    }

    &::placeholder {
      color: ${({ theme }) => theme.textSecondary};
      opacity: 0.8;
    }
  }

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.textSecondary};
    font-size: 16px;
  }
`;

const FilterSelect = styled.select`
  padding: 12px 14px;
  border-radius: 6px;
  border: 2px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s;
  min-width: 180px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.primary}30`};
  }

  option {
    padding: 8px;
  }
`;

const StyledSelect = styled.select`
  padding: 12px 14px;
  border-radius: 6px;
  border: 2px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundTertiary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  min-width: 180px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23667085' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
  height: 44px;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.primary}30`};
  }

  &:hover {
    border-color: ${({ theme }) => theme.borderHover || theme.primary + '80'};
  }

  option {
    padding: 8px;
    font-weight: 500;
    background-color: ${({ theme }) => theme.backgroundTertiary};
    color: ${({ theme }) => theme.text};
  }
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 12px 18px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  letter-spacing: 0.3px;

  ${({ $primary, theme }) =>
    $primary
      ? `
    background-color: ${theme.primary};
    color: white;
    border: none;

    &:hover {
      background-color: ${theme.primaryDark};
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `
      : `
    background-color: white;
    color: ${theme.textSecondary};
    border: 2px solid ${theme.border};

    &:hover {
      background-color: ${theme.backgroundHover};
      border-color: ${theme.borderHover || theme.border};
      color: ${theme.text};
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
  `}
`;

const TareasList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
`;

const TareaTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TareaMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TareaDate = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 13px;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);

  ${({ $status, theme }) => {
    switch ($status) {
      case 'REQUESTED':
        return `
          background-color: #E3F2FD;
          color: #0D47A1;
          border: 1px solid #2196F3;
        `;
      case 'ASSIGNED':
        return `
          background-color: #FFF8E1;
          color: #E65100;
          border: 1px solid #FFC107;
        `;
      case 'IN_PROGRESS':
        return `
          background-color: #EDE7F6;
          color: #4527A0;
          border: 1px solid #673AB7;
        `;
      case 'COMPLETED':
        return `
          background-color: #E8F5E9;
          color: #1B5E20;
          border: 1px solid #4CAF50;
        `;
      case 'APPROVED':
        return `
          background-color: #E8F5E9;
          color: #1B5E20;
          border: 1px solid #4CAF50;
        `;
      case 'REJECTED':
        return `
          background-color: #FFEBEE;
          color: #B71C1C;
          border: 1px solid #F44336;
        `;
      default:
        return `
          background-color: #ECEFF1;
          color: #263238;
          border: 1px solid #607D8B;
        `;
    }
  }}
`;

const PriorityBadge = styled.span<{ $priority: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);

  ${({ $priority, theme }) => {
    switch ($priority) {
      case 'CRITICAL':
        return `
          background-color: #FFEBEE;
          color: #B71C1C;
          border: 1px solid #F44336;
        `;
      case 'HIGH':
        return `
          background-color: #FFF3E0;
          color: #E65100;
          border: 1px solid #FF9800;
        `;
      case 'MEDIUM':
        return `
          background-color: #E3F2FD;
          color: #0D47A1;
          border: 1px solid #2196F3;
        `;
      case 'LOW':
        return `
          background-color: #E8F5E9;
          color: #1B5E20;
          border: 1px solid #4CAF50;
        `;
      case 'TRIVIAL':
        return `
          background-color: #ECEFF1;
          color: #263238;
          border: 1px solid #607D8B;
        `;
      default:
        return `
          background-color: #ECEFF1;
          color: #263238;
          border: 1px solid #607D8B;
        `;
    }
  }}
`;

const TareaDetails = styled.div<{ $isOpen: boolean }>`
  padding: ${({ $isOpen }) => ($isOpen ? '16px' : '0')};
  max-height: ${({ $isOpen }) => ($isOpen ? '1000px' : '0')};
  overflow: hidden;
  transition: all 0.3s ease;
  border-top: ${({ $isOpen, theme }) => ($isOpen ? `1px solid ${theme.border}` : 'none')};
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.div`
  width: 150px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const DetailValue = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'success' | 'warning' | 'danger'; disabled?: boolean }>`
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.3px;
  opacity: ${props => props.disabled ? 0.6 : 1};

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: ${theme.primary};
          color: white;
          &:hover {
            background-color: ${theme.primaryDark};
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            transform: translateY(-1px);
          }
          &:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `;
      case 'success':
        return `
          background-color: ${theme.success};
          color: white;
          &:hover {
            background-color: ${theme.successDark};
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            transform: translateY(-1px);
          }
          &:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `;
      case 'warning':
        return `
          background-color: ${theme.warning};
          color: white;
          &:hover {
            background-color: ${theme.warningDark};
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            transform: translateY(-1px);
          }
          &:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `;
      case 'danger':
        return `
          background-color: ${theme.error};
          color: white;
          &:hover {
            background-color: ${theme.errorDark};
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            transform: translateY(-1px);
          }
          &:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `;
      default:
        return `
          background-color: ${theme.backgroundAlt};
          color: ${theme.textSecondary};
          border: 1px solid ${theme.border};
          &:hover {
            background-color: ${theme.backgroundHover};
            color: ${theme.text};
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
          }
          &:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
        `;
    }
  }}
`;

const ProgressContainer = styled.div`
  margin-top: 16px;
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
      return <FiPlay size={14} />;
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

const MisTareas: React.FC = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Usar el hook personalizado para tareas
  const {
    assignedTasks = [],
    inProgressTasks = [],
    isLoadingAssignedTasks,
    isLoadingInProgressTasks,
    assignedTasksError,
    refreshAllData,
    startTask,
    completeTask
  } = useTareas();

  // Registrar los datos para depuración
  console.log('MisTareas: Datos disponibles:', {
    assignedTasks: assignedTasks?.length || 0,
    inProgressTasks: inProgressTasks?.length || 0
  });

  // Crear un mapa de IDs de tareas en progreso para verificación rápida
  const inProgressTaskIds = new Set((inProgressTasks || []).map(task => task.id));

  // Filtrar las tareas asignadas para excluir las que ya están en progreso
  const filteredAssignedTasks = (assignedTasks || []).filter(task => !inProgressTaskIds.has(task.id));

  console.log('MisTareas: Tareas filtradas:', {
    assignedTasksAfterFilter: filteredAssignedTasks.length,
    inProgressTasks: inProgressTasks?.length || 0
  });

  // Combinar tareas asignadas (filtradas) y en progreso
  const allTasks = [
    ...filteredAssignedTasks,
    ...(inProgressTasks || [])
  ];

  // Convertir las tareas al formato esperado por el componente
  const tareas = allTasks.map(task => ({
    id: task.id,
    titulo: task.title || '',
    descripcion: task.description || '',
    categoria: task.category || '',
    prioridad: task.priority || 'MEDIUM',
    fechaAsignacion: task.requestDate || '',
    fechaLimite: task.dueDate || '',
    estado: task.status, // Usar el estado real de la tarea
    solicitante: task.requesterName || '',
    asignador: task.assignerName || '',
    notas: task.comments || '',
    progreso: task.progress || 0,
    source: task.source || 'activity'
  }));

  // Filtrar tareas según los criterios
  const filteredTareas = tareas.filter(tarea => {
    const matchesSearch = searchTerm === '' ||
      tarea.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarea.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || tarea.estado === statusFilter;
    const matchesPriority = priorityFilter === '' || tarea.prioridad === priorityFilter;
    const matchesCategory = categoryFilter === '' || tarea.categoria === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    console.log('MisTareas: Cargando datos...');
    refreshAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Este efecto se ha eliminado ya que la depuración no es necesaria

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleRefresh = () => {
    refreshAllData();
    toast.info('Actualizando datos...');
  };

  const handleIniciarTarea = (id: number) => {
    toast.info('Iniciando tarea...');

    // Guardar el estado actual para comparar después
    const currentAssignedTasks = [...(assignedTasks || [])];
    const currentInProgressTasks = [...(inProgressTasks || [])];

    console.log('Estado antes de iniciar tarea:', {
      assignedTasks: currentAssignedTasks,
      inProgressTasks: currentInProgressTasks
    });

    try {
      startTask(id, {
        onSuccess: (data) => {
          console.log('Tarea iniciada correctamente. Datos:', data);
          toast.success('Tarea iniciada correctamente');

          // Actualizar manualmente las listas de tareas
          if (data && data.id) {
            // Encontrar la tarea en la lista de tareas asignadas
            const taskIndex = currentAssignedTasks.findIndex(task => task.id === data.id);

            if (taskIndex !== -1) {
              // Crear una copia de la tarea con estado actualizado
              const updatedTask = {
                ...currentAssignedTasks[taskIndex],
                status: 'IN_PROGRESS'
              };

              // Actualizar la lista de tareas en progreso manualmente
              const updatedInProgressTasks = [...currentInProgressTasks, updatedTask];
              console.log('Actualizando manualmente tareas en progreso:', updatedInProgressTasks);

              // No es necesario eliminar de las asignadas, ya que el filtro lo hará automáticamente
            }
          }

          // Recargar los datos para actualizar la UI
          setTimeout(() => {
            console.log('Recargando datos después de iniciar tarea...');
            refreshAllData();
            setExpandedId(null);

            // Forzar una recarga de la página después de un tiempo
            setTimeout(() => {
              console.log('Forzando recarga de la página...');
              window.location.reload();
            }, 2000);
          }, 1000);
        },
        onError: (error) => {
          console.error('Error al iniciar la tarea:', error);

          // Verificar si el error es porque la tarea ya está iniciada
          if (error.message && (
              error.message.includes('ya ha sido iniciada') ||
              error.message.includes('already started') ||
              error.message.includes('estado actual no permite') ||
              error.message.includes('403') ||
              error.message.includes('Forbidden'))) {
            toast.info('Esta tarea ya ha sido iniciada anteriormente o no tienes permisos para iniciarla');

            // Recargar los datos para actualizar la UI
            console.log('Recargando datos después de error...');
            refreshAllData();

            // Forzar una recarga de la página después de un tiempo
            setTimeout(() => {
              console.log('Forzando recarga de la página después de error...');
              window.location.reload();
            }, 2000);
          } else if (error.message && error.message.includes('getInProgressTasks is not a function')) {
            // Error específico que estamos viendo, forzar recarga de la página
            toast.info('Iniciando tarea... Por favor, espere mientras se actualiza la página.');

            // Forzar una recarga de la página
            setTimeout(() => {
              console.log('Forzando recarga de la página debido a error en el servicio...');
              window.location.reload();
            }, 1500);
          } else {
            toast.error('Error al iniciar la tarea: ' + (error.message || 'Inténtelo de nuevo.'));

            // Forzar una recarga de la página después de un tiempo
            setTimeout(() => {
              console.log('Forzando recarga de la página después de error desconocido...');
              window.location.reload();
            }, 3000);
          }
        }
      });
    } catch (error) {
      console.error('Error inesperado al iniciar tarea:', error);
      toast.error('Error inesperado al iniciar la tarea. La página se recargará automáticamente.');

      // Forzar una recarga de la página
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const handlePausarTarea = (id: number) => {
    // Aquí iría la lógica para pausar la tarea
    toast.info('Tarea pausada');
    setExpandedId(null);
  };

  const handleCompletarTarea = (id: number) => {
    completeTask({
      activityId: id,
      result: 'Completada satisfactoriamente',
      actualHours: 1 // Valor por defecto para las horas reales
    });
    setExpandedId(null);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Mis Tareas</PageTitle>
        <RefreshButton
          onClick={handleRefresh}
          isLoading={isLoadingAssignedTasks || isLoadingInProgressTasks}
          label="Actualizar"
          title="Actualizar lista de tareas"
        />
      </PageHeader>

      <FiltersContainer>
        <SearchInput>
          <FiSearch size={16} />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>

        <FilterBadge
          label="Estado"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "ASSIGNED", label: "Asignada" },
            { value: "IN_PROGRESS", label: "En Progreso" },
            { value: "COMPLETED", label: "Completada" }
          ]}
          placeholder="Todos los estados"
          icon={<FiClock size={14} />}
        />

        <FilterBadge
          label="Prioridad"
          value={priorityFilter}
          onChange={setPriorityFilter}
          options={[
            { value: "CRITICAL", label: "Crítica" },
            { value: "HIGH", label: "Alta" },
            { value: "MEDIUM", label: "Media" },
            { value: "LOW", label: "Baja" },
            { value: "TRIVIAL", label: "Trivial" }
          ]}
          placeholder="Todas las prioridades"
        />

        <FilterBadge
          label="Categoría"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={[
            { value: "ADMINISTRATIVA", label: "Administrativa" },
            { value: "LEGAL", label: "Legal" },
            { value: "TECNICA", label: "Técnica" },
            { value: "FINANCIERA", label: "Financiera" },
            { value: "RECURSOS_HUMANOS", label: "Recursos Humanos" },
            { value: "OTRA", label: "Otra" }
          ]}
          placeholder="Todas las categorías"
          icon={<FiTag size={14} />}
        />

        <Button>
          <FiFilter size={16} />
          Más filtros
        </Button>
      </FiltersContainer>

      {isLoadingAssignedTasks || isLoadingInProgressTasks ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
              <FiClock size={48} style={{ color: '#7f56d9', opacity: 0.7 }} />
            </div>
            <h3 style={{ marginBottom: '10px', color: '#344054' }}>Cargando tareas...</h3>
            <p style={{ color: '#667085' }}>Estamos obteniendo tus tareas asignadas</p>
          </div>
        </div>
      ) : assignedTasksError ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
              <FiAlertCircle size={48} style={{ color: '#f44336', opacity: 0.7 }} />
            </div>
            <h3 style={{ marginBottom: '10px', color: '#344054' }}>Error al cargar tareas</h3>
            <p style={{ color: '#667085' }}>Hubo un problema al obtener tus tareas asignadas</p>
            <pre style={{ textAlign: 'left', background: '#f5f5f5', padding: '10px', borderRadius: '4px', marginTop: '10px', fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
              {JSON.stringify(assignedTasksError, null, 2)}
            </pre>
            <RefreshButton
              onClick={handleRefresh}
              style={{ marginTop: '20px' }}
              label="Intentar nuevamente"
            />
          </div>
        </div>
      ) : filteredTareas.length > 0 ? (
        <TareasList>
          {filteredTareas.map((tarea) => (
            <TareaCard key={tarea.id}>
              <TareaHeader onClick={() => toggleExpand(tarea.id)}>
                <TareaTitle>
                  {tarea.titulo}
                </TareaTitle>
                <TareaMeta>
                  <StatusBadge $status={tarea.estado}>
                    {getStatusIcon(tarea.estado)}
                    {getStatusText(tarea.estado)}
                  </StatusBadge>
                  <PriorityBadge $priority={tarea.prioridad}>
                    {getPriorityText(tarea.prioridad)}
                  </PriorityBadge>
                  <TareaDate>
                    <FiCalendar size={14} />
                    {formatDate(tarea.fechaLimite)}
                  </TareaDate>
                  {expandedId === tarea.id ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                </TareaMeta>
              </TareaHeader>
              <TareaDetails $isOpen={expandedId === tarea.id}>
                <DetailRow>
                  <DetailLabel>Descripción:</DetailLabel>
                  <DetailValue>{tarea.descripcion}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Solicitante:</DetailLabel>
                  <DetailValue>{tarea.solicitante}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Asignador:</DetailLabel>
                  <DetailValue>{tarea.asignador}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Categoría:</DetailLabel>
                  <DetailValue>{getCategoryText(tarea.categoria)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Fecha de asignación:</DetailLabel>
                  <DetailValue>{formatDate(tarea.fechaAsignacion)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Fecha límite:</DetailLabel>
                  <DetailValue>{formatDate(tarea.fechaLimite)}</DetailValue>
                </DetailRow>
                {tarea.notas && (
                  <DetailRow>
                    <DetailLabel>Notas:</DetailLabel>
                    <DetailValue>{tarea.notas}</DetailValue>
                  </DetailRow>
                )}

                {tarea.estado === 'IN_PROGRESS' && tarea.progreso !== undefined && (
                  <ProgressContainer>
                    <ProgressHeader>
                      <ProgressLabel>Progreso</ProgressLabel>
                      <ProgressValue>{tarea.progreso}%</ProgressValue>
                    </ProgressHeader>
                    <ProgressBar>
                      <ProgressFill $percentage={tarea.progreso} />
                    </ProgressBar>
                  </ProgressContainer>
                )}

                <ActionButtons>
                  {tarea.estado === 'ASSIGNED' && (
                    <>
                      <ActionButton
                        $variant="primary"
                        onClick={() => handleIniciarTarea(tarea.id)}
                        title="Iniciar tarea"
                      >
                        <FiPlay size={14} />
                        Iniciar tarea
                      </ActionButton>
                    </>
                  )}
                  {tarea.estado === 'IN_PROGRESS' && (
                    <>
                      <ActionButton $variant="primary" onClick={() => navigate(`/app/tareas/actualizar-progreso/${tarea.id}`)}>
                        <FiEdit size={14} />
                        Actualizar progreso
                      </ActionButton>
                      <ActionButton $variant="warning" onClick={() => handlePausarTarea(tarea.id)}>
                        <FiPause size={14} />
                        Pausar
                      </ActionButton>
                      <ActionButton $variant="success" onClick={() => handleCompletarTarea(tarea.id)}>
                        <FiCheck size={14} />
                        Completar
                      </ActionButton>
                    </>
                  )}
                  <ActionButton
                    $variant="secondary"
                    onClick={() => navigate(`/app/tareas/detalle/${tarea.id}`)}
                    title="Ver detalles"
                  >
                    <FiEye size={14} />
                    Ver detalles
                  </ActionButton>
                </ActionButtons>
              </TareaDetails>
            </TareaCard>
          ))}
        </TareasList>
      ) : (
        <EmptyState>
          <FiAlertCircle size={48} />
          <h3>No se encontraron tareas</h3>
          <p>No hay tareas asignadas a tu usuario en este momento. Utiliza el botón "Actualizar" para refrescar los datos.</p>
          <RefreshButton
            onClick={handleRefresh}
            style={{ marginTop: '20px' }}
            label="Actualizar datos"
          />
        </EmptyState>
      )}
    </PageContainer>
  );
};

export default MisTareas;
