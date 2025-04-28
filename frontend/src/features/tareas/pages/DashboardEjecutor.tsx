import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckSquare,
  FiClock,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiBarChart2,
  FiFileText,
  FiArrowRight,
  FiRefreshCw,
  FiFilter,
  FiFlag,
  FiUser
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Componentes
import { StatusBadge } from '@/shared/components/ui';
import { Button } from '@/components/ui';

// Hooks y servicios
import useTareas from '../hooks/useTareas';

// Tipos
import { Activity, ActivityStatus } from '@/types/models';

// Datos de ejemplo (se reemplazarán por datos reales del backend)
const MOCK_TAREAS = [
  {
    id: 1,
    title: 'Informe técnico para caso #12345',
    description: 'Elaborar informe técnico detallado sobre el caso #12345 para presentar en la audiencia del próximo mes.',
    category: 'LEGAL',
    priority: 'HIGH',
    requestDate: '2025-05-01T10:30:00',
    dueDate: '2025-05-15',
    status: 'ASSIGNED',
    requesterName: 'Juan Pérez',
    assignerName: 'Carlos Rodríguez',
    executorName: 'Ana Martínez'
  },
  {
    id: 2,
    title: 'Análisis de documentación caso #54321',
    description: 'Realizar análisis detallado de la documentación presentada por la contraparte en el caso #54321.',
    category: 'LEGAL',
    priority: 'MEDIUM',
    requestDate: '2025-04-28T14:15:00',
    dueDate: '2025-05-10',
    status: 'ASSIGNED',
    requesterName: 'María López',
    assignerName: 'Carlos Rodríguez',
    executorName: 'Ana Martínez'
  },
  {
    id: 3,
    title: 'Revisión de contrato de arrendamiento',
    description: 'Revisar contrato de arrendamiento para el local comercial y elaborar informe de observaciones.',
    category: 'LEGAL',
    priority: 'LOW',
    requestDate: '2025-04-25T09:45:00',
    dueDate: '2025-05-05',
    status: 'IN_PROGRESS',
    requesterName: 'Pedro Gómez',
    assignerName: 'Carlos Rodríguez',
    executorName: 'Ana Martínez',
    progress: 50
  }
];

// Datos de ejemplo para tareas en progreso
const MOCK_TAREAS_PROGRESO = [
  {
    id: 3,
    title: 'Revisión de contrato de arrendamiento',
    description: 'Revisar contrato de arrendamiento para el local comercial y elaborar informe de observaciones.',
    category: 'LEGAL',
    priority: 'LOW',
    requestDate: '2025-04-25T09:45:00',
    dueDate: '2025-05-05',
    status: 'IN_PROGRESS',
    requesterName: 'Pedro Gómez',
    assignerName: 'Carlos Rodríguez',
    executorName: 'Ana Martínez',
    progress: 50
  },
  {
    id: 4,
    title: 'Preparación de presentación para cliente',
    description: 'Preparar presentación para la reunión con el cliente del próximo viernes.',
    category: 'ADMINISTRATIVA',
    priority: 'HIGH',
    requestDate: '2025-04-20T11:00:00',
    dueDate: '2025-04-30',
    status: 'IN_PROGRESS',
    requesterName: 'Juan Pérez',
    assignerName: 'Carlos Rodríguez',
    executorName: 'Ana Martínez',
    progress: 75
  }
];

// Estilos
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

const RefreshButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const StatFooter = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 8px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
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

const TareasList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TareaItem = styled.div`
  background-color: ${({ theme }) => theme.backgroundPrimary};
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

const TareaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const TareaTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const TareaMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TareaDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TareaDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TareaFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`;

const TareaRequester = styled.div`
  color: ${({ theme }) => theme.textSecondary};
`;

const TareaAction = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
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

const ProgressContainer = styled.div`
  margin-top: 8px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const ProgressLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ProgressValue = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ProgressBar = styled.div`
  height: 6px;
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background-color: ${({ $color }) => $color};
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const CalendarContainer = styled.div`
  margin-top: 16px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CalendarTitle = styled.h3`
  font-size: 16px;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const CalendarDay = styled.div<{ $isToday?: boolean; $hasTask?: boolean; $isPast?: boolean }>`
  padding: 8px;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  
  ${({ $isToday, $hasTask, $isPast, theme }) => {
    if ($isToday) {
      return `
        background-color: ${theme.primary}20;
        font-weight: 600;
        color: ${theme.primary};
      `;
    } else if ($hasTask) {
      return `
        background-color: ${theme.backgroundAlt};
        color: ${theme.text};
        
        &::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: ${theme.primary};
        }
      `;
    } else if ($isPast) {
      return `
        color: ${theme.textSecondary};
      `;
    } else {
      return `
        color: ${theme.text};
        
        &:hover {
          background-color: ${theme.backgroundHover};
        }
      `;
    }
  }}
`;

const CalendarDayHeader = styled.div`
  padding: 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'CRITICAL':
      return '#F44336'; // Rojo
    case 'HIGH':
      return '#FF9800'; // Naranja
    case 'MEDIUM':
      return '#2196F3'; // Azul
    case 'LOW':
      return '#4CAF50'; // Verde
    case 'TRIVIAL':
      return '#9E9E9E'; // Gris
    default:
      return '#9E9E9E'; // Gris por defecto
  }
};

const getProgressColor = (progress: number) => {
  if (progress < 30) return '#F44336'; // Rojo para progreso bajo
  if (progress < 70) return '#FF9800'; // Naranja para progreso medio
  return '#4CAF50'; // Verde para progreso alto
};

// Función para generar un calendario simple
const generateCalendar = () => {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  // Ajustar para que la semana comience en lunes (0 = lunes, 6 = domingo)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const days = [];
  
  // Agregar días vacíos para alinear el primer día del mes
  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push({ day: '', isCurrentMonth: false });
  }
  
  // Agregar los días del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), i);
    days.push({
      day: i,
      isCurrentMonth: true,
      isToday: i === today.getDate(),
      isPast: date < new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      date
    });
  }
  
  return days;
};

const DashboardEjecutor: React.FC = () => {
  const navigate = useNavigate();
  
  // Usar el hook personalizado para tareas
  const {
    assignedTasks,
    inProgressTasks,
    isLoadingAssignedTasks,
    isLoadingInProgressTasks,
    refreshAllData,
    startTask
  } = useTareas();

  // Estado para filtros
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  
  // Estado para el calendario
  const [calendarDays, setCalendarDays] = useState(generateCalendar());
  
  // Usar datos reales o de ejemplo
  const tareas = assignedTasks || MOCK_TAREAS;
  const tareasProgreso = inProgressTasks || MOCK_TAREAS_PROGRESO;

  // Filtrar tareas
  const filteredTareas = tareas.filter(tarea => {
    if (categoryFilter && tarea.category !== categoryFilter) return false;
    if (priorityFilter && tarea.priority !== priorityFilter) return false;
    return true;
  });

  // Calcular estadísticas
  const totalTareasAsignadas = tareas.length;
  const totalTareasProgreso = tareasProgreso.length;
  const tareasUrgentes = tareas.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').length;
  const tareasVencidas = tareas.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  // Obtener categorías únicas para el filtro
  const uniqueCategories = Array.from(new Set(tareas.map(t => t.category)));
  
  // Obtener prioridades únicas para el filtro
  const uniquePriorities = Array.from(new Set(tareas.map(t => t.priority)));

  // Marcar días con tareas en el calendario
  useEffect(() => {
    const updatedCalendar = generateCalendar();
    
    // Marcar días con tareas
    const allTasks = [...tareas, ...tareasProgreso];
    allTasks.forEach(task => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        updatedCalendar.forEach((day, index) => {
          if (day.date && day.date.getDate() === dueDate.getDate() && 
              day.date.getMonth() === dueDate.getMonth() && 
              day.date.getFullYear() === dueDate.getFullYear()) {
            updatedCalendar[index] = { ...day, hasTask: true };
          }
        });
      }
    });
    
    setCalendarDays(updatedCalendar);
  }, [tareas, tareasProgreso]);

  const handleRefresh = () => {
    refreshAllData();
  };

  const handleStartTask = (id: number) => {
    startTask(id, {
      onSuccess: () => {
        toast.success('Tarea iniciada correctamente');
        refreshAllData();
      }
    });
  };

  const handleVerTarea = (id: number) => {
    navigate(`/app/tareas/detalle/${id}`);
  };

  const handleVerProgreso = (id: number) => {
    navigate(`/app/tareas/progreso/${id}`);
  };

  const handleVerTodasTareas = () => {
    navigate('/app/tareas/asignadas');
  };

  const handleVerTodoProgreso = () => {
    navigate('/app/tareas/progreso');
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Dashboard de Tareas</PageTitle>
        <RefreshButton onClick={handleRefresh}>
          <FiRefreshCw size={16} />
          Actualizar datos
        </RefreshButton>
      </PageHeader>

      <StatsContainer>
        <StatCard>
          <StatTitle>
            <FiCheckSquare size={16} />
            Tareas Asignadas
          </StatTitle>
          <StatValue>{totalTareasAsignadas}</StatValue>
          <StatFooter>
            {tareasUrgentes} urgentes, {tareasVencidas} vencidas
          </StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiClock size={16} />
            Tareas en Progreso
          </StatTitle>
          <StatValue>{totalTareasProgreso}</StatValue>
          <StatFooter>
            {tareasProgreso.reduce((acc, curr) => acc + (curr.progress || 0), 0) / Math.max(1, tareasProgreso.length)}% completado (promedio)
          </StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiCalendar size={16} />
            Próximos Vencimientos
          </StatTitle>
          <StatValue>
            {tareas.filter(t => {
              if (!t.dueDate) return false;
              const dueDate = new Date(t.dueDate);
              const today = new Date();
              const diffTime = dueDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays >= 0 && diffDays <= 7;
            }).length}
          </StatValue>
          <StatFooter>tareas vencen esta semana</StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>
            <FiBarChart2 size={16} />
            Rendimiento
          </StatTitle>
          <StatValue>85%</StatValue>
          <StatFooter>tareas completadas a tiempo</StatFooter>
        </StatCard>
      </StatsContainer>

      <ContentGrid>
        <ContentSection>
          <SectionTitle>
            <FiCheckSquare size={18} />
            Tareas Asignadas
          </SectionTitle>
          
          <FilterContainer>
            <FilterSelect 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </FilterSelect>
            
            <FilterSelect 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">Todas las prioridades</option>
              {uniquePriorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </FilterSelect>
          </FilterContainer>
          
          {filteredTareas.length > 0 ? (
            <TareasList>
              {filteredTareas.map((tarea) => (
                <TareaItem key={tarea.id} onClick={() => handleVerTarea(tarea.id)}>
                  <TareaHeader>
                    <TareaTitle>{tarea.title}</TareaTitle>
                    <TareaMeta>
                      <StatusBadge $status={tarea.status}>
                        {getStatusIcon(tarea.status)}
                        {getStatusText(tarea.status)}
                      </StatusBadge>
                      <TareaDate>
                        <FiCalendar size={12} />
                        {formatDate(tarea.dueDate || '')}
                      </TareaDate>
                    </TareaMeta>
                  </TareaHeader>
                  <TareaDescription>{tarea.description}</TareaDescription>
                  <TareaFooter>
                    <TareaRequester>
                      <FiUser size={12} style={{ marginRight: '4px' }} />
                      Solicitante: {tarea.requesterName}
                    </TareaRequester>
                    <TareaAction>
                      Iniciar tarea
                      <FiArrowRight size={14} />
                    </TareaAction>
                  </TareaFooter>
                </TareaItem>
              ))}
              
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Button onClick={handleVerTodasTareas}>
                  Ver todas las tareas asignadas
                </Button>
              </div>
            </TareasList>
          ) : (
            <EmptyState>
              <FiCheckSquare size={48} />
              <h3>No hay tareas asignadas</h3>
              <p>No tienes tareas pendientes de iniciar.</p>
            </EmptyState>
          )}
        </ContentSection>

        <ContentSection>
          <SectionTitle>
            <FiClock size={18} />
            Tareas en Progreso
          </SectionTitle>
          
          {tareasProgreso.length > 0 ? (
            <TareasList>
              {tareasProgreso.map((tarea) => (
                <TareaItem key={tarea.id} onClick={() => handleVerProgreso(tarea.id)}>
                  <TareaHeader>
                    <TareaTitle>{tarea.title}</TareaTitle>
                    <TareaMeta>
                      <StatusBadge $status={tarea.status}>
                        {getStatusIcon(tarea.status)}
                        {getStatusText(tarea.status)}
                      </StatusBadge>
                      <TareaDate>
                        <FiFlag size={12} />
                        {tarea.priority}
                      </TareaDate>
                    </TareaMeta>
                  </TareaHeader>
                  <TareaDescription>{tarea.description}</TareaDescription>
                  
                  <ProgressContainer>
                    <ProgressHeader>
                      <ProgressLabel>Progreso</ProgressLabel>
                      <ProgressValue>{tarea.progress || 0}%</ProgressValue>
                    </ProgressHeader>
                    <ProgressBar>
                      <ProgressFill 
                        $percentage={tarea.progress || 0} 
                        $color={getProgressColor(tarea.progress || 0)} 
                      />
                    </ProgressBar>
                  </ProgressContainer>
                  
                  <TareaFooter style={{ marginTop: '8px' }}>
                    <TareaRequester>
                      <FiCalendar size={12} style={{ marginRight: '4px' }} />
                      Vence: {formatDate(tarea.dueDate || '')}
                    </TareaRequester>
                    <TareaAction>
                      Actualizar progreso
                      <FiArrowRight size={14} />
                    </TareaAction>
                  </TareaFooter>
                </TareaItem>
              ))}
              
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Button onClick={handleVerTodoProgreso}>
                  Ver todas las tareas en progreso
                </Button>
              </div>
            </TareasList>
          ) : (
            <EmptyState>
              <FiClock size={48} />
              <h3>No hay tareas en progreso</h3>
              <p>No tienes tareas en curso actualmente.</p>
            </EmptyState>
          )}
          
          <CalendarContainer>
            <CalendarHeader>
              <CalendarTitle>
                <FiCalendar size={16} style={{ marginRight: '8px' }} />
                Calendario de Vencimientos
              </CalendarTitle>
            </CalendarHeader>
            
            <CalendarGrid>
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
                <CalendarDayHeader key={index}>{day}</CalendarDayHeader>
              ))}
              
              {calendarDays.map((day, index) => (
                <CalendarDay 
                  key={index}
                  $isToday={day.isToday}
                  $hasTask={day.hasTask}
                  $isPast={day.isPast}
                >
                  {day.day}
                </CalendarDay>
              ))}
            </CalendarGrid>
          </CalendarContainer>
        </ContentSection>
      </ContentGrid>
    </PageContainer>
  );
};

export default DashboardEjecutor;
