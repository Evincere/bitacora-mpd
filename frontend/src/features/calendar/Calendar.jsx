import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isToday,
  isSameMonth,
  startOfDay,
  endOfDay,
  differenceInMinutes,
  addMinutes,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
  getDay
} from 'date-fns';
import { es } from 'date-fns/locale';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiFilter, FiPlus, FiGrid, FiList, FiClock, FiRefreshCw, FiInfo } from 'react-icons/fi';
import { useActivitiesQuery } from '../../hooks/useActivitiesQuery';
import StatusBadge from '../../components/ui/StatusBadge';
import TypeBadge from '../../components/ui/TypeBadge';
import ActivityTooltip from '../../components/ui/ActivityTooltip';
import CalendarLegend from '../../components/ui/CalendarLegend';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../hooks/useToast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import activitiesService from '../../services/activitiesService';

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    min-width: 200px;
    text-align: center;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.backgroundPrimary};
    border: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: ${({ theme }) => theme.backgroundHover};
      color: ${({ theme }) => theme.primary};
    }
  }
`;

const CalendarActions = styled.div`
  display: flex;
  gap: 8px;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.backgroundSecondary};
    border: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.textSecondary};
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    height: 36px;

    &:hover {
      background-color: ${({ theme }) => theme.backgroundHover};
      color: ${({ theme }) => theme.text};
    }

    &[primary=true] {
      background-color: ${({ theme }) => theme.primary};
      border-color: ${({ theme }) => theme.primary};
      color: white;

      &:hover {
        background-color: ${({ theme }) => theme.primaryHover};
      }
    }

    svg {
      font-size: 16px;
    }
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  flex: 1;
  overflow-y: auto;
`;

const WeekdayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const DayCell = styled.div`
  min-height: 120px;
  border-right: 1px solid ${({ theme }) => theme.border};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 8px;
  background-color: ${({ theme, $isCurrentMonth, $isToday }) =>
    $isToday
      ? `${theme.primary}10`
      : $isCurrentMonth
        ? theme.backgroundPrimary
        : `${theme.backgroundSecondary}80`
  };
  position: relative;
  overflow-y: auto;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme, $isToday }) =>
      $isToday ? `${theme.primary}20` : theme.backgroundHover
    };
  }
`;

const DayNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-bottom: 8px;
  font-weight: ${({ $isToday }) => $isToday ? '600' : '400'};
  background-color: ${({ theme, $isToday }) => $isToday ? theme.primary : 'transparent'};
  color: ${({ theme, $isToday }) => $isToday ? '#fff' : theme.text};
`;

const ActivityItem = styled.div`
  margin-bottom: 6px;
  padding: 6px;
  border-radius: 4px;
  background-color: ${({ theme }) => `${theme.backgroundSecondary}90`};
  border-left: 3px solid ${({ theme, $status }) => {
    switch ($status) {
      case 'COMPLETADA':
        return theme.success;
      case 'EN_PROGRESO':
        return theme.primary;
      case 'PENDIENTE':
        return theme.warning;
      case 'CANCELADA':
        return theme.danger;
      default:
        return theme.border;
    }
  }};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);

  &:hover {
    background-color: ${({ theme }) => theme.backgroundSecondary};
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .activity-time {
    font-weight: 600;
    margin-bottom: 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .activity-title {
    margin-bottom: 4px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .activity-badges {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }
`;

const MoreActivities = styled.div`
  text-align: center;
  padding: 4px;
  background-color: ${({ theme }) => `${theme.backgroundSecondary}80`};
  border-radius: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundSecondary};
    color: ${({ theme }) => theme.text};
  }
`;

const ViewSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 16px;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.backgroundSecondary};
    border: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.textSecondary};
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    height: 36px;

    &:hover {
      background-color: ${({ theme }) => theme.backgroundHover};
      color: ${({ theme }) => theme.text};
    }

    &.active {
      background-color: ${({ theme }) => theme.primary};
      border-color: ${({ theme }) => theme.primary};
      color: white;
    }

    svg {
      font-size: 16px;
    }
  }
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  flex: 1;
  overflow-y: auto;
`;

const TimeColumn = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundSecondary};
`;

const TimeSlot = styled.div`
  height: 60px;
  padding: 4px;
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const WeekDayColumn = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme, $isToday }) => $isToday ? `${theme.primary}10` : theme.backgroundPrimary};
`;

const WeekDayHeader = styled.div`
  padding: 8px;
  text-align: center;
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme, $isToday }) => $isToday ? `${theme.primary}20` : theme.backgroundSecondary};
  color: ${({ theme, $isToday }) => $isToday ? theme.primary : theme.text};
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .day-name {
    font-size: 14px;
  }

  .day-number {
    font-size: 18px;
    margin-top: 4px;
  }
`;

const WeekTimeSlot = styled.div`
  height: 60px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 2px;
  position: relative;
  background-color: ${({ theme, $isNow }) => $isNow ? `${theme.primary}10` : 'transparent'};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr;
  flex: 1;
  overflow-y: auto;
`;

const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.backgroundPrimary};
`;

const DayHeader = styled.div`
  padding: 16px;
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.text};
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CalendarEvent = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  z-index: 5;
  background-color: ${({ theme, $type }) => {
    switch ($type) {
      case 'Atención Personal':
        return 'rgba(108, 92, 231, 0.8)';
      case 'Atención Telefónica':
        return 'rgba(0, 184, 212, 0.8)';
      case 'Concursos':
        return 'rgba(255, 51, 102, 0.8)';
      case 'Solicitud de info':
        return 'rgba(46, 213, 115, 0.8)';
      case 'Mails':
        return 'rgba(255, 153, 0, 0.8)';
      case 'Multitareas':
        return 'rgba(156, 39, 176, 0.8)';
      case 'Tomo Nota':
        return 'rgba(3, 169, 244, 0.8)';
      case 'Reunión':
        return 'rgba(0, 206, 201, 0.8)';
      default:
        return 'rgba(116, 125, 140, 0.8)';
    }
  }};
  color: white;
  border-left: 3px solid ${({ theme, $status }) => {
    switch ($status) {
      case 'COMPLETADA':
        return theme.success;
      case 'EN_PROGRESO':
        return theme.primary;
      case 'PENDIENTE':
        return theme.warning;
      case 'CANCELADA':
        return theme.danger;
      default:
        return theme.border;
    }
  }};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  opacity: ${({ $isDragging }) => $isDragging ? '0.7' : '1'};
  transform: ${({ $isDragging }) => $isDragging ? 'scale(0.98)' : 'scale(1)'};

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }

  .event-time {
    font-weight: 600;
    margin-bottom: 2px;
  }

  .event-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const CurrentTimeIndicator = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: ${({ theme }) => theme.primary};
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    left: -5px;
    top: -4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.primary};
  }
`;

const FilterPanel = styled.div`
  position: absolute;
  top: 70px;
  right: 24px;
  width: 300px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  z-index: 100;
  display: ${({ $show }) => $show ? 'block' : 'none'};

  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 16px;
    color: ${({ theme }) => theme.text};
  }

  .filter-section {
    margin-bottom: 16px;

    h4 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 14px;
      color: ${({ theme }) => theme.textSecondary};
    }

    .filter-options {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }

  .filter-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;

    button {
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;

      &.apply {
        background-color: ${({ theme }) => theme.primary};
        color: white;
        border: none;

        &:hover {
          background-color: ${({ theme }) => theme.primaryHover};
        }
      }

      &.reset {
        background-color: transparent;
        color: ${({ theme }) => theme.textSecondary};
        border: 1px solid ${({ theme }) => theme.border};

        &:hover {
          background-color: ${({ theme }) => theme.backgroundHover};
          color: ${({ theme }) => theme.text};
        }
      }
    }
  }
`;

const FilterOption = styled.div`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  background-color: ${({ $selected, theme }) => $selected ? theme.primary : theme.backgroundPrimary};
  color: ${({ $selected, theme }) => $selected ? 'white' : theme.text};
  border: 1px solid ${({ $selected, theme }) => $selected ? theme.primary : theme.border};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $selected, theme }) => $selected ? theme.primaryHover : theme.backgroundHover};
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => `${theme.backgroundPrimary}80`};
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
  z-index: 10;
`;

// Constantes para los tipos de vista
const VIEW_TYPES = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day'
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewType, setViewType] = useState(VIEW_TYPES.MONTH);
  const [draggedActivity, setDraggedActivity] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    assignee: null
  });

  // Estados para el diálogo de confirmación
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogData, setConfirmDialogData] = useState({
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Estados para el tooltip
  const [tooltipActivity, setTooltipActivity] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  // Estado para la leyenda
  const [showLegend, setShowLegend] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  // Referencias para drag and drop
  const dragSourceRef = useRef(null);
  const dragTimeoutRef = useRef(null);

  // Obtener actividades usando el hook correcto
  const { data: activities, isLoading, isError, refetch } = useActivitiesQuery({
    page: 0,
    size: 1000, // Obtener todas las actividades para el mes
  });

  // Añadir logs para depuración
  useEffect(() => {
    console.log('Estado de carga:', isLoading);
    console.log('Estado de error:', isError);
    console.log('Datos de actividades recibidos:', activities);

    if (activities?.activities) {
      console.log('Número de actividades:', activities.activities.length);
      console.log('Primera actividad:', activities.activities[0]);
    } else {
      console.log('No hay actividades disponibles o el formato es incorrecto');
    }
  }, [activities, isLoading, isError]);

  // Forzar recarga de actividades
  const handleRefreshActivities = () => {
    console.log('Forzando recarga de actividades...');
    refetch();
  };

  // Efecto para actualizar el indicador de tiempo actual cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      // Forzar actualización para mover el indicador de tiempo actual
      setCurrentDate(new Date());
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, []);

  // Efecto para limpiar el timeout de arrastre
  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);

  // Calcular días del mes actual
  const daysInMonth = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Comenzar desde el domingo
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // Terminar en sábado

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  // Calcular días de la semana actual
  const daysInWeek = useMemo(() => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  // Generar horas para la vista semanal y diaria
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      slots.push(i);
    }
    return slots;
  }, []);

  // Nombres de los días de la semana
  const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Navegar al período anterior (mes, semana o día)
  const goToPrevious = () => {
    switch (viewType) {
      case VIEW_TYPES.MONTH:
        setCurrentDate(prevDate => subMonths(prevDate, 1));
        break;
      case VIEW_TYPES.WEEK:
        setCurrentDate(prevDate => subWeeks(prevDate, 1));
        break;
      case VIEW_TYPES.DAY:
        setCurrentDate(prevDate => addDays(prevDate, -1));
        break;
      default:
        break;
    }
  };

  // Navegar al período siguiente (mes, semana o día)
  const goToNext = () => {
    switch (viewType) {
      case VIEW_TYPES.MONTH:
        setCurrentDate(prevDate => addMonths(prevDate, 1));
        break;
      case VIEW_TYPES.WEEK:
        setCurrentDate(prevDate => addWeeks(prevDate, 1));
        break;
      case VIEW_TYPES.DAY:
        setCurrentDate(prevDate => addDays(prevDate, 1));
        break;
      default:
        break;
    }
  };

  // Cambiar el tipo de vista
  const handleViewChange = (newViewType) => {
    setViewType(newViewType);
  };

  // Formatear el título del calendario según la vista
  const getCalendarTitle = () => {
    switch (viewType) {
      case VIEW_TYPES.MONTH:
        return format(currentDate, 'MMMM yyyy', { locale: es });
      case VIEW_TYPES.WEEK:
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        if (weekStart.getMonth() === weekEnd.getMonth()) {
          return `${format(weekStart, 'd')} - ${format(weekEnd, 'd')} de ${format(weekStart, 'MMMM yyyy', { locale: es })}`;
        } else if (weekStart.getFullYear() === weekEnd.getFullYear()) {
          return `${format(weekStart, 'd MMM', { locale: es })} - ${format(weekEnd, 'd MMM yyyy', { locale: es })}`;
        } else {
          return `${format(weekStart, 'd MMM yyyy', { locale: es })} - ${format(weekEnd, 'd MMM yyyy', { locale: es })}`;
        }
      case VIEW_TYPES.DAY:
        return format(currentDate, 'EEEE, d MMMM yyyy', { locale: es });
      default:
        return '';
    }
  };

  // Filtrar actividades por día
  const getActivitiesForDay = useCallback((day) => {
    if (!activities?.activities) {
      console.log('No hay contenido de actividades disponible para filtrar');
      return [];
    }

    console.log(`Filtrando actividades para el día ${format(day, 'yyyy-MM-dd')}`);
    console.log('Total de actividades antes de filtrar:', activities.activities.length);

    // Aplicar filtros si están activos
    let filteredActivities = activities.activities.filter(activity => {
      try {
        // Verificar si la actividad tiene una fecha válida
        if (!activity.date) {
          console.log('Actividad sin fecha:', activity);
          return false;
        }

        // Intentar parsear la fecha
        const activityDate = parseISO(activity.date);

        // Verificar si la fecha es válida
        if (isNaN(activityDate.getTime())) {
          console.log('Fecha inválida:', activity.date, 'para actividad:', activity);
          return false;
        }

        // Comparar las fechas
        const isSame = isSameDay(activityDate, day);
        if (isSame) {
          console.log('Actividad coincide con el día:', activity);
        }
        return isSame;
      } catch (error) {
        console.error('Error al procesar fecha de actividad:', error, activity);
        return false;
      }
    });

    console.log(`Actividades filtradas para el día ${format(day, 'yyyy-MM-dd')}:`, filteredActivities.length);

    // Aplicar filtros adicionales
    if (filters.status.length > 0) {
      filteredActivities = filteredActivities.filter(activity =>
        filters.status.includes(activity.status)
      );
    }

    if (filters.type.length > 0) {
      filteredActivities = filteredActivities.filter(activity =>
        filters.type.includes(activity.type)
      );
    }

    if (filters.assignee) {
      filteredActivities = filteredActivities.filter(activity =>
        activity.assignee === filters.assignee
      );
    }

    return filteredActivities;
  }, [activities, filters]);

  // Obtener actividades para una hora específica en un día
  const getActivitiesForTimeSlot = useCallback((day, hour) => {
    const activitiesForDay = getActivitiesForDay(day);

    return activitiesForDay.filter(activity => {
      const activityDate = parseISO(activity.date);
      return getHours(activityDate) === hour;
    });
  }, [getActivitiesForDay]);

  // Calcular la posición y altura de un evento en la vista semanal o diaria
  const calculateEventPosition = useCallback((activity) => {
    const activityDate = parseISO(activity.date);
    const hours = getHours(activityDate);
    const minutes = getMinutes(activityDate);

    // Calcular la posición vertical (top) basada en la hora y minutos
    const top = (hours * 60 + minutes) * (60 / 60); // 60px por hora

    // Duración predeterminada de 30 minutos si no se especifica
    const durationMinutes = activity.duration || 30;

    // Calcular la altura basada en la duración
    const height = (durationMinutes * (60 / 60));

    return { top, height };
  }, []);

  // Calcular la posición del indicador de tiempo actual
  const calculateCurrentTimePosition = useCallback(() => {
    const now = new Date();
    const hours = getHours(now);
    const minutes = getMinutes(now);

    // Calcular la posición vertical (top) basada en la hora y minutos actuales
    return (hours * 60 + minutes) * (60 / 60); // 60px por hora
  }, []);

  // Manejar inicio de arrastre de actividad
  const handleDragStart = (activity, e) => {
    console.log('Iniciando arrastre de actividad:', activity);

    // Configurar los datos de transferencia
    e.dataTransfer.setData('text/plain', JSON.stringify({
      activityId: activity.id,
      activityTitle: activity.title
    }));

    // Establecer el efecto de arrastre
    e.dataTransfer.effectAllowed = 'move';

    // Guardar la actividad que se está arrastrando
    setDraggedActivity(activity);
    setIsDragging(true);

    // Guardar la referencia al elemento de origen
    dragSourceRef.current = e.currentTarget;
  };

  // Manejar arrastre sobre un slot de tiempo
  const handleDragOver = (day, hour, e) => {
    // Prevenir comportamiento predeterminado para permitir soltar
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // Cambiar el estilo visual para indicar que se puede soltar
    e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
  };

  // Manejar salida del arrastre de un slot
  const handleDragLeave = (e) => {
    // Restaurar el estilo original
    e.currentTarget.style.backgroundColor = '';
  };

  // Actualizar actividad en el backend
  const updateActivityDate = async (activity, newDate) => {
    try {
      setIsUpdating(true);

      // Actualizar primero localmente para una experiencia de usuario más fluida
      if (activities?.activities) {
        // Encontrar y actualizar la actividad en el array local
        // Formatear la fecha en el formato que espera el backend (sin la Z al final)
        const formattedDate = newDate.toISOString().replace(/\.\d{3}Z$/, '');

        const updatedActivities = activities.activities.map(act => {
          if (act.id === activity.id) {
            return { ...act, date: formattedDate };
          }
          return act;
        });

        // Actualizar el estado local con las actividades modificadas
        const updatedData = { ...activities, activities: updatedActivities };
        queryClient.setQueryData(['activities'], updatedData);
      }

      // Crear objeto con los datos a actualizar
      // Formatear la fecha en el formato que espera el backend (sin la Z al final)
      const formattedDate = newDate.toISOString().replace(/\.\d{3}Z$/, '');

      const activityData = {
        date: formattedDate
      };

      console.log(`Actualizando actividad ${activity.id} a la fecha ${formattedDate}`);

      // Intentar actualizar en el backend
      const result = await activitiesService.updateActivity(activity.id, activityData);
      console.log('Respuesta del backend:', result);

      // Mostrar notificación de éxito
      const displayDate = format(newDate, 'dd/MM/yyyy HH:mm');
      toast.success(`Actividad movida al ${displayDate}`, 'Operación exitosa');

      // Invalidar la caché para refrescar los datos
      queryClient.invalidateQueries(['activities']);

      // Limpiar estados
      setDraggedActivity(null);
      setIsDragging(false);

      return true;
    } catch (error) {
      console.error('Error al actualizar la actividad:', error);
      toast.error('Error al mover la actividad. Por favor, inténtelo de nuevo.', 'Error');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Manejar soltar actividad
  const handleDrop = (day, hour, e) => {
    // Prevenir comportamiento predeterminado
    e.preventDefault();

    // Restaurar el estilo original
    e.currentTarget.style.backgroundColor = '';

    console.log('Soltando actividad en:', format(day, 'yyyy-MM-dd'), 'a las', hour + ':00');

    try {
      // Obtener los datos transferidos
      const transferData = e.dataTransfer.getData('text/plain');
      console.log('Datos transferidos:', transferData);

      if (!transferData) {
        console.error('No se encontraron datos en la transferencia');
        return;
      }

      const { activityId } = JSON.parse(transferData);
      console.log('ID de actividad a mover:', activityId);

      // Buscar la actividad en los datos
      const activityToMove = activities?.activities?.find(a => a.id === activityId);

      if (!activityToMove) {
        console.error('No se encontró la actividad con ID:', activityId);
        return;
      }

      // Crear una nueva fecha basada en el día y hora donde se soltó
      const newDate = new Date(day);
      newDate.setHours(hour);
      newDate.setMinutes(0);
      newDate.setSeconds(0);

      // Formatear fecha para mostrar en el mensaje
      const displayDate = format(newDate, 'dd/MM/yyyy HH:mm');

      // Configurar y mostrar el diálogo de confirmación
      setConfirmDialogData({
        title: 'Mover actividad',
        message: `¿Desea mover la actividad "${activityToMove.description || activityToMove.title}" al ${displayDate}?`,
        onConfirm: () => {
          // Actualizar la actividad con la nueva fecha
          updateActivityDate(activityToMove, newDate);
          setShowConfirmDialog(false);
        }
      });

      setShowConfirmDialog(true);
    } catch (error) {
      console.error('Error al procesar el evento de soltar:', error);
      toast.error('Error al mover la actividad. Por favor, inténtelo de nuevo.', 'Error');

      // Limpiar el estado de arrastre
      setDraggedActivity(null);
      setIsDragging(false);
    }
  };

  // Manejar fin de arrastre
  const handleDragEnd = (e) => {
    console.log('Fin de arrastre');

    // Limpiar el estado de arrastre después de un breve retraso
    // para permitir que handleDrop se ejecute primero
    dragTimeoutRef.current = setTimeout(() => {
      setDraggedActivity(null);
      setIsDragging(false);
    }, 100);
  };

  // Manejar clic en el botón de filtros
  const handleToggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  // Manejar clic en el botón de leyenda
  const handleToggleLegend = () => {
    setShowLegend(prev => !prev);
  };

  // Manejar cambio en los filtros
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'status' || filterType === 'type') {
        // Para filtros de tipo array (status, type)
        const currentValues = [...prev[filterType]];
        const valueIndex = currentValues.indexOf(value);

        if (valueIndex === -1) {
          // Añadir valor si no existe
          return {
            ...prev,
            [filterType]: [...currentValues, value]
          };
        } else {
          // Eliminar valor si ya existe
          currentValues.splice(valueIndex, 1);
          return {
            ...prev,
            [filterType]: currentValues
          };
        }
      } else {
        // Para filtros de tipo valor único (assignee)
        return {
          ...prev,
          [filterType]: prev[filterType] === value ? null : value
        };
      }
    });
  };

  // Resetear filtros
  const handleResetFilters = () => {
    setFilters({
      status: [],
      type: [],
      assignee: null
    });
  };

  // Manejar clic en una actividad
  const handleActivityClick = (activity) => {
    // Navegar a la vista de detalle o edición
    navigate(`/app/activities/${activity.id}`);
  };

  // Mostrar tooltip al pasar el cursor sobre una actividad
  const handleActivityMouseEnter = (activity, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      top: rect.bottom + window.scrollY + 10, // 10px debajo del elemento
      left: rect.left + window.scrollX
    };

    setTooltipActivity(activity);
    setTooltipPosition(position);
  };

  // Ocultar tooltip al quitar el cursor de una actividad
  const handleActivityMouseLeave = () => {
    setTooltipActivity(null);
  };

  // Manejar clic en el botón de nueva actividad
  const handleNewActivity = () => {
    navigate('/activities?new=true');
  };

  // Formatear hora de la actividad
  const formatActivityTime = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'HH:mm');
    } catch (error) {
      return '';
    }
  };

  // Renderizar vista mensual
  const renderMonthView = () => (
    <CalendarGrid>
      {/* Encabezados de días de la semana */}
      {weekdays.map(day => (
        <WeekdayHeader key={day}>{day}</WeekdayHeader>
      ))}

      {/* Celdas de días */}
      {daysInMonth.map(day => {
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
        const isToday = isSameDay(day, new Date());
        const dayActivities = getActivitiesForDay(day);
        const maxActivitiesToShow = 3;

        return (
          <DayCell
            key={day.toISOString()}
            $isCurrentMonth={isCurrentMonth}
            $isToday={isToday}
            onDragOver={(e) => handleDragOver(day, 9, e)} // Hora predeterminada para la vista mensual
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(day, 9, e)} // Hora predeterminada para la vista mensual
          >
            <DayNumber $isToday={isToday}>
              {day.getDate()}
            </DayNumber>

            {dayActivities.slice(0, maxActivitiesToShow).map(activity => (
              <ActivityItem
                key={activity.id}
                $status={activity.status}
                onClick={() => handleActivityClick(activity)}
                draggable="true"
                onDragStart={(e) => handleDragStart(activity, e)}
                onDragEnd={handleDragEnd}
                onMouseEnter={(e) => handleActivityMouseEnter(activity, e)}
                onMouseLeave={handleActivityMouseLeave}
              >
                <div className="activity-time">
                  {formatActivityTime(activity.date)}
                  <StatusBadge status={activity.status} />
                </div>
                <div className="activity-title">{activity.title}</div>
                <div className="activity-badges">
                  <TypeBadge type={activity.type} />
                </div>
              </ActivityItem>
            ))}

            {dayActivities.length > maxActivitiesToShow && (
              <MoreActivities>
                +{dayActivities.length - maxActivitiesToShow} más
              </MoreActivities>
            )}
          </DayCell>
        );
      })}
    </CalendarGrid>
  );

  // Renderizar vista semanal
  const renderWeekView = () => {
    const now = new Date();
    const currentTimePosition = calculateCurrentTimePosition();

    return (
      <WeekGrid>
        {/* Columna de horas */}
        <TimeColumn>
          <WeekDayHeader></WeekDayHeader>
          {timeSlots.map(hour => (
            <TimeSlot key={hour}>
              {hour}:00
            </TimeSlot>
          ))}
        </TimeColumn>

        {/* Columnas de días */}
        {daysInWeek.map(day => {
          const dayOfWeek = format(day, 'EEEE', { locale: es });
          const dayNumber = format(day, 'd');
          const isCurrentDay = isToday(day);

          return (
            <WeekDayColumn key={day.toISOString()} $isToday={isCurrentDay}>
              <WeekDayHeader $isToday={isCurrentDay}>
                <span className="day-name">{dayOfWeek}</span>
                <span className="day-number">{dayNumber}</span>
              </WeekDayHeader>

              {timeSlots.map(hour => {
                const isNow = isCurrentDay && getHours(now) === hour;
                const activitiesInSlot = getActivitiesForTimeSlot(day, hour);

                return (
                  <WeekTimeSlot
                    key={hour}
                    $isNow={isNow}
                    onDragOver={(e) => handleDragOver(day, hour, e)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(day, hour, e)}
                  >
                    {activitiesInSlot.map(activity => {
                      const { top, height } = calculateEventPosition(activity);
                      const topInHour = top % 60; // Posición relativa dentro de la hora

                      return (
                        <CalendarEvent
                          key={activity.id}
                          style={{ top: `${topInHour}px`, height: `${height}px` }}
                          $type={activity.type}
                          $status={activity.status}
                          $isDragging={isDragging && draggedActivity?.id === activity.id}
                          onClick={() => handleActivityClick(activity)}
                          draggable="true"
                          onDragStart={(e) => handleDragStart(activity, e)}
                          onDragEnd={handleDragEnd}
                          onMouseEnter={(e) => handleActivityMouseEnter(activity, e)}
                          onMouseLeave={handleActivityMouseLeave}
                        >
                          <div className="event-time">{formatActivityTime(activity.date)}</div>
                          <div className="event-title">{activity.title}</div>
                        </CalendarEvent>
                      );
                    })}

                    {isNow && (
                      <CurrentTimeIndicator style={{ top: `${currentTimePosition % 60}px` }} />
                    )}
                  </WeekTimeSlot>
                );
              })}
            </WeekDayColumn>
          );
        })}
      </WeekGrid>
    );
  };

  // Renderizar vista diaria
  const renderDayView = () => {
    const now = new Date();
    const currentTimePosition = calculateCurrentTimePosition();
    const isCurrentDay = isToday(currentDate);

    return (
      <DayGrid>
        {/* Columna de horas */}
        <TimeColumn>
          <DayHeader></DayHeader>
          {timeSlots.map(hour => (
            <TimeSlot key={hour}>
              {hour}:00
            </TimeSlot>
          ))}
        </TimeColumn>

        {/* Columna del día */}
        <DayColumn>
          <DayHeader>
            {format(currentDate, 'EEEE, d MMMM', { locale: es })}
          </DayHeader>

          {timeSlots.map(hour => {
            const isNow = isCurrentDay && getHours(now) === hour;
            const activitiesInSlot = getActivitiesForTimeSlot(currentDate, hour);

            return (
              <WeekTimeSlot
                key={hour}
                $isNow={isNow}
                onDragOver={(e) => handleDragOver(currentDate, hour, e)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(currentDate, hour, e)}
              >
                {activitiesInSlot.map(activity => {
                  const { top, height } = calculateEventPosition(activity);
                  const topInHour = top % 60; // Posición relativa dentro de la hora

                  return (
                    <CalendarEvent
                      key={activity.id}
                      style={{ top: `${topInHour}px`, height: `${height}px` }}
                      $type={activity.type}
                      $status={activity.status}
                      $isDragging={isDragging && draggedActivity?.id === activity.id}
                      onClick={() => handleActivityClick(activity)}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(activity, e)}
                      onDragEnd={handleDragEnd}
                      onMouseEnter={(e) => handleActivityMouseEnter(activity, e)}
                      onMouseLeave={handleActivityMouseLeave}
                    >
                      <div className="event-time">{formatActivityTime(activity.date)}</div>
                      <div className="event-title">{activity.title}</div>
                    </CalendarEvent>
                  );
                })}

                {isNow && (
                  <CurrentTimeIndicator style={{ top: `${currentTimePosition % 60}px` }} />
                )}
              </WeekTimeSlot>
            );
          })}
        </DayColumn>
      </DayGrid>
    );
  };

  // Renderizar el panel de filtros
  const renderFilterPanel = () => {
    // Obtener valores únicos para los filtros
    const statusOptions = activities?.activities ?
      [...new Set(activities.activities.map(a => a.status))] : [];

    const typeOptions = activities?.activities ?
      [...new Set(activities.activities.map(a => a.type))] : [];

    return (
      <FilterPanel $show={showFilters}>
        <h3>Filtros</h3>

        <div className="filter-section">
          <h4>Estado</h4>
          <div className="filter-options">
            {statusOptions.map(status => (
              <FilterOption
                key={status}
                $selected={filters.status.includes(status)}
                onClick={() => handleFilterChange('status', status)}
              >
                {status}
              </FilterOption>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h4>Tipo</h4>
          <div className="filter-options">
            {typeOptions.map(type => (
              <FilterOption
                key={type}
                $selected={filters.type.includes(type)}
                onClick={() => handleFilterChange('type', type)}
              >
                {type}
              </FilterOption>
            ))}
          </div>
        </div>

        <div className="filter-actions">
          <button className="reset" onClick={handleResetFilters}>Resetear</button>
          <button className="apply" onClick={handleToggleFilters}>Aplicar</button>
        </div>
      </FilterPanel>
    );
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <MonthNavigation>
          <button onClick={goToPrevious}>
            <FiChevronLeft size={20} />
          </button>
          <h2>{getCalendarTitle()}</h2>
          <button onClick={goToNext}>
            <FiChevronRight size={20} />
          </button>
        </MonthNavigation>

        <ViewSelector>
          <button
            className={viewType === VIEW_TYPES.MONTH ? 'active' : ''}
            onClick={() => handleViewChange(VIEW_TYPES.MONTH)}
          >
            <FiGrid size={16} />
            Mes
          </button>
          <button
            className={viewType === VIEW_TYPES.WEEK ? 'active' : ''}
            onClick={() => handleViewChange(VIEW_TYPES.WEEK)}
          >
            <FiList size={16} />
            Semana
          </button>
          <button
            className={viewType === VIEW_TYPES.DAY ? 'active' : ''}
            onClick={() => handleViewChange(VIEW_TYPES.DAY)}
          >
            <FiClock size={16} />
            Día
          </button>
        </ViewSelector>

        <CalendarActions>
          <button onClick={handleRefreshActivities}>
            <FiRefreshCw size={16} />
            Actualizar
          </button>
          <button onClick={handleToggleFilters}>
            <FiFilter size={16} />
            Filtros
          </button>
          <button onClick={handleToggleLegend}>
            <FiInfo size={16} />
            Leyenda
          </button>
          <button $primary onClick={handleNewActivity}>
            <FiPlus size={16} />
            Nueva Actividad
          </button>
        </CalendarActions>
      </CalendarHeader>

      {/* Renderizar la vista seleccionada */}
      {viewType === VIEW_TYPES.MONTH && renderMonthView()}
      {viewType === VIEW_TYPES.WEEK && renderWeekView()}
      {viewType === VIEW_TYPES.DAY && renderDayView()}

      {/* Panel de filtros */}
      {renderFilterPanel()}

      {/* Leyenda del calendario */}
      {showLegend && <CalendarLegend />}

      {isLoading && (
        <LoadingOverlay>
          <div className="spinner"></div>
        </LoadingOverlay>
      )}

      {/* Diálogo de confirmación para mover actividades */}
      {showConfirmDialog && (
        <ConfirmDialog
          title={confirmDialogData.title}
          message={confirmDialogData.message}
          confirmLabel="Mover"
          cancelLabel="Cancelar"
          onConfirm={confirmDialogData.onConfirm}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}

      {/* Overlay de carga durante la actualización */}
      {isUpdating && (
        <LoadingOverlay>
          <div className="spinner"></div>
        </LoadingOverlay>
      )}

      {/* Tooltip para mostrar detalles de actividades */}
      {tooltipActivity && (
        <ActivityTooltip
          activity={tooltipActivity}
          position={tooltipPosition}
        />
      )}
    </CalendarContainer>
  );
};

export default Calendar;
