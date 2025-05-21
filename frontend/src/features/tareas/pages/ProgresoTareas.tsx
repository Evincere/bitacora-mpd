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
  FiShield,
  FiTag,
  FiFilter,
  FiSearch
} from 'react-icons/fi';
import { toast } from 'react-toastify';

// Componentes UI
import { RefreshButton, FilterBadge } from '@/shared/components/ui';

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

const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 400px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.textSecondary};
  }

  input {
    width: 100%;
    padding: 10px 12px 10px 36px;
    border-radius: 20px;
    border: 1.5px solid ${({ theme }) => `${theme.primary}70`};
    background-color: ${({ theme }) => `${theme.primary}20`};
    color: ${({ theme }) => theme.text};
    font-size: 14px;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => `${theme.primary}30`};
    }

    &::placeholder {
      color: ${({ theme }) => theme.textSecondary};
    }
  }
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
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  text-transform: uppercase;
  letter-spacing: 0.7px;

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
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  text-transform: uppercase;
  letter-spacing: 0.7px;

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

const ProgressValue = styled.div<{ $percentage: number }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $percentage, theme }) => {
    if ($percentage < 25) return theme.error;
    if ($percentage < 50) return theme.warning;
    if ($percentage < 75) return theme.info;
    return theme.success;
  }};
  transition: color 0.3s ease;
`;

const ProgressBar = styled.div`
  height: 10px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 6px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background-color: ${({ $percentage, theme }) => {
    if ($percentage < 25) return theme.error;
    if ($percentage < 50) return theme.warning;
    if ($percentage < 75) return theme.info;
    return theme.success;
  }};
  border-radius: 6px;
  transition: width 0.3s ease, background-color 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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

const TimeRemainingBadge = styled.div<{ $isOverdue: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 4px;
  background-color: ${({ $isOverdue, theme }) =>
    $isOverdue ? theme.errorLight : theme.infoLight};
  color: ${({ $isOverdue, theme }) =>
    $isOverdue ? theme.error : theme.info};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  }
`;

const EstimatedCompletionDate = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 4px;
  background-color: ${({ theme }) => theme.backgroundTertiary};
  color: ${({ theme }) => theme.textSecondary};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  }
`;

const ProgressStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ProgressStat = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.border};
  margin: 12px 0;
  opacity: 0.5;
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
  if (!dateString) return 'Fecha no disponible';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Error en fecha';
  }
};

// Función para formatear fechas con hora
const formatDateTime = (dateString: string) => {
  if (!dateString) return 'Fecha no disponible';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error al formatear fecha y hora:', error);
    return 'Error en fecha';
  }
};

// Función para calcular días restantes hasta la fecha límite
const getDaysRemaining = (dueDate: string): { days: number; isOverdue: boolean; text: string } => {
  if (!dueDate) return { days: 0, isOverdue: false, text: 'Sin fecha límite' };

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDateObj = new Date(dueDate);
    dueDateObj.setHours(0, 0, 0, 0);

    if (isNaN(dueDateObj.getTime())) {
      return { days: 0, isOverdue: false, text: 'Fecha inválida' };
    }

    const diffTime = dueDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        days: Math.abs(diffDays),
        isOverdue: true,
        text: `Vencida hace ${Math.abs(diffDays)} día${Math.abs(diffDays) !== 1 ? 's' : ''}`
      };
    } else if (diffDays === 0) {
      return { days: 0, isOverdue: false, text: 'Vence hoy' };
    } else if (diffDays === 1) {
      return { days: 1, isOverdue: false, text: 'Vence mañana' };
    } else {
      return { days: diffDays, isOverdue: false, text: `${diffDays} días restantes` };
    }
  } catch (error) {
    console.error('Error al calcular días restantes:', error);
    return { days: 0, isOverdue: false, text: 'Error en cálculo' };
  }
};

// Función para estimar la fecha de finalización basada en el progreso actual
const getEstimatedCompletionDate = (startDate: string, dueDate: string, progress: number): string => {
  if (!startDate || !dueDate || progress <= 0) return 'No disponible';

  try {
    const start = new Date(startDate);
    const due = new Date(dueDate);

    if (isNaN(start.getTime()) || isNaN(due.getTime())) {
      return 'Datos insuficientes';
    }

    // Si el progreso es 100%, la fecha estimada es ahora
    if (progress >= 100) return 'Completada';

    // Calcular el tiempo total asignado para la tarea
    const totalTaskTime = due.getTime() - start.getTime();

    // Calcular el tiempo que debería tomar completar el resto del trabajo
    const remainingWork = 100 - progress;
    const timePerProgressPoint = totalTaskTime / 100;
    const remainingTime = remainingWork * timePerProgressPoint;

    // Calcular la fecha estimada de finalización
    const now = new Date();
    const estimatedCompletionTime = now.getTime() + remainingTime;
    const estimatedCompletionDate = new Date(estimatedCompletionTime);

    // Formatear la fecha estimada
    return formatDate(estimatedCompletionDate.toISOString());
  } catch (error) {
    console.error('Error al calcular fecha estimada de finalización:', error);
    return 'Error en cálculo';
  }
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
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

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

  // Filtrar tareas según los criterios seleccionados
  const filteredTareas = tareas.filter(tarea => {
    // Filtrar por término de búsqueda
    const matchesSearch = searchTerm === '' ||
      tarea.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarea.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarea.solicitante.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtrar por categoría
    const matchesCategory = categoryFilter === '' || tarea.categoria === categoryFilter;

    // Filtrar por prioridad
    const matchesPriority = priorityFilter === '' || tarea.prioridad === priorityFilter;

    // Devolver true solo si cumple todos los criterios
    return matchesSearch && matchesCategory && matchesPriority;
  });

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
        <RefreshButton
          onClick={handleRefresh}
          isLoading={isLoadingInProgressTasks}
          label="Actualizar"
          title="Actualizar lista de tareas en progreso"
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
          icon={<FiClock size={14} />}
        />
      </FiltersContainer>

      {isLoadingInProgressTasks ? (
        <EmptyState>
          <FiLoader size={48} style={{ animation: 'spin 1s linear infinite' }} />
          <h3>Cargando tareas</h3>
          <p>Por favor, espere mientras se cargan las tareas en progreso.</p>
        </EmptyState>
      ) : filteredTareas.length > 0 ? (
        <TareasGrid>
          {filteredTareas.map((tarea) => (
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
                    <ProgressValue $percentage={tarea.progreso}>{tarea.progreso}%</ProgressValue>
                  </ProgressHeader>
                  <ProgressBar>
                    <ProgressFill $percentage={tarea.progreso} />
                  </ProgressBar>
                  <ProgressStats>
                    <ProgressStat>
                      <FiClock size={12} />
                      Inicio: {formatDate(tarea.fechaAsignacion)}
                    </ProgressStat>
                    <ProgressStat>
                      <FiCalendar size={12} />
                      Límite: {formatDate(tarea.fechaLimite)}
                    </ProgressStat>
                  </ProgressStats>
                </ProgressContainer>

                <TareaDescription>{tarea.descripcion}</TareaDescription>

                {/* Información de tiempo restante y estimación */}
                {(() => {
                  const timeRemaining = getDaysRemaining(tarea.fechaLimite);
                  const estimatedDate = getEstimatedCompletionDate(
                    tarea.fechaAsignacion,
                    tarea.fechaLimite,
                    tarea.progreso
                  );

                  return (
                    <>
                      <TimeRemainingBadge $isOverdue={timeRemaining.isOverdue}>
                        {timeRemaining.isOverdue ? <FiAlertCircle size={14} /> : <FiClock size={14} />}
                        {timeRemaining.text}
                      </TimeRemainingBadge>

                      <EstimatedCompletionDate>
                        <FiCalendar size={14} />
                        Finalización estimada: {estimatedDate}
                      </EstimatedCompletionDate>

                      <Divider />
                    </>
                  );
                })()}

                <TareaInfoList>
                  <TareaInfoItem>
                    <TareaInfoIcon>
                      <FiShield size={14} />
                    </TareaInfoIcon>
                    <TareaInfoContent>
                      <TareaInfoLabel>Categoría:</TareaInfoLabel>
                      <TareaInfoValue>{getCategoryText(tarea.categoria)}</TareaInfoValue>
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
      ) : tareas.length === 0 ? (
        <EmptyState>
          <FiAlertCircle size={48} />
          <h3>No hay tareas en progreso</h3>
          <p>Actualmente no tienes tareas en estado "En Progreso". Puedes iniciar una tarea desde la sección "Mis Tareas".</p>
          <RefreshButton
            onClick={handleRefresh}
            style={{ marginTop: '16px' }}
            label="Actualizar datos"
          />
        </EmptyState>
      ) : (
        <EmptyState>
          <FiFilter size={48} />
          <h3>No se encontraron tareas</h3>
          <p>No hay tareas que coincidan con los filtros seleccionados. Intenta cambiar los criterios de búsqueda.</p>
          <RefreshButton
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
              setPriorityFilter('');
            }}
            style={{ marginTop: '16px' }}
            label="Limpiar filtros"
            title="Limpiar todos los filtros"
          />
        </EmptyState>
      )}


    </PageContainer>
  );
};

export default ProgresoTareas;
