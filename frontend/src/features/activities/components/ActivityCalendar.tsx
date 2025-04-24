import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiList, FiGrid } from 'react-icons/fi';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Activity, ActivityStatus } from '@/types/models';

interface ActivityCalendarProps {
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
  onMoveActivity?: (activity: Activity, newDate: Date) => void;
}

type CalendarView = 'month' | 'week' | 'day';

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  activities,
  onSelectActivity,
  onMoveActivity
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [draggedActivity, setDraggedActivity] = useState<Activity | null>(null);

  const navigatePrevious = () => {
    if (currentView === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (currentView === 'week') {
      // Implementar navegación semanal
    } else if (currentView === 'day') {
      // Implementar navegación diaria
    }
  };

  const navigateNext = () => {
    if (currentView === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (currentView === 'week') {
      // Implementar navegación semanal
    } else if (currentView === 'day') {
      // Implementar navegación diaria
    }
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const handleDragStart = (e: React.DragEvent, activity: Activity) => {
    e.dataTransfer.setData('text/plain', activity.id.toString());
    setDraggedActivity(activity);
  };

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    const activityId = parseInt(e.dataTransfer.getData('text/plain'), 10);

    if (draggedActivity && onMoveActivity) {
      onMoveActivity(draggedActivity, date);
    }

    setDraggedActivity(null);
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Agrupar actividades por día
    const activitiesByDay: Record<string, Activity[]> = {};

    activities.forEach(activity => {
      const activityDate = parseISO(activity.date);
      const dateKey = format(activityDate, 'yyyy-MM-dd');

      if (!activitiesByDay[dateKey]) {
        activitiesByDay[dateKey] = [];
      }

      activitiesByDay[dateKey].push(activity);
    });

    return (
      <MonthGrid>
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}

        {days.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayActivities = activitiesByDay[dateKey] || [];
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <DayCell
              key={dateKey}
              $isCurrentMonth={isCurrentMonth}
              $isToday={isToday(day)}
              onDragOver={(e) => handleDragOver(e, day)}
              onDrop={(e) => handleDrop(e, day)}
            >
              <DayNumber>{format(day, 'd')}</DayNumber>
              <ActivitiesContainer>
                {dayActivities.slice(0, 3).map(activity => (
                  <ActivityItem
                    key={activity.id}
                    $status={activity.status}
                    onClick={() => onSelectActivity(activity)}
                    draggable={!!onMoveActivity}
                    onDragStart={(e) => handleDragStart(e, activity)}
                  >
                    {activity.description.length > 20
                      ? `${activity.description.substring(0, 20)}...`
                      : activity.description}
                  </ActivityItem>
                ))}
                {dayActivities.length > 3 && (
                  <MoreActivities>
                    +{dayActivities.length - 3} más
                  </MoreActivities>
                )}
              </ActivitiesContainer>
            </DayCell>
          );
        })}
      </MonthGrid>
    );
  };

  const renderWeekView = () => {
    // Implementación de vista semanal
    return <div>Vista semanal en desarrollo</div>;
  };

  const renderDayView = () => {
    // Implementación de vista diaria
    return <div>Vista diaria en desarrollo</div>;
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          <FiCalendar />
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </CalendarTitle>

        <CalendarControls>
          <ViewToggle>
            <ViewButton
              $active={currentView === 'month'}
              onClick={() => setCurrentView('month')}
            >
              <FiGrid />
              Mes
            </ViewButton>
            <ViewButton
              $active={currentView === 'week'}
              onClick={() => setCurrentView('week')}
            >
              <FiList />
              Semana
            </ViewButton>
            <ViewButton
              $active={currentView === 'day'}
              onClick={() => setCurrentView('day')}
            >
              <FiClock />
              Día
            </ViewButton>
          </ViewToggle>

          <NavigationControls>
            <NavButton onClick={navigatePrevious}>
              <FiChevronLeft />
            </NavButton>
            <TodayButton onClick={navigateToday}>
              Hoy
            </TodayButton>
            <NavButton onClick={navigateNext}>
              <FiChevronRight />
            </NavButton>
          </NavigationControls>
        </CalendarControls>
      </CalendarHeader>

      <CalendarContent>
        {currentView === 'month' && renderMonthView()}
        {currentView === 'week' && renderWeekView()}
        {currentView === 'day' && renderDayView()}
      </CalendarContent>
    </CalendarContainer>
  );
};

const CalendarContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const CalendarTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: capitalize;

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const CalendarControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  overflow: hidden;
`;

const ViewButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background-color: ${({ theme, $active }) => $active ? theme.primary : 'transparent'};
  color: ${({ theme, $active }) => $active ? 'white' : theme.text};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, $active }) => $active ? theme.primary : theme.inputBackground};
  }

  @media (max-width: 576px) {
    padding: 6px 8px;

    span {
      display: none;
    }
  }
`;

const NavigationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
  }
`;

const TodayButton = styled.button`
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
  }
`;

const CalendarContent = styled.div`
  padding: 20px;
`;

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: ${({ theme }) => theme.borderColor};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  overflow: hidden;
`;

const DayHeader = styled.div`
  padding: 10px;
  text-align: center;
  font-weight: 500;
  background-color: ${({ theme }) => theme.backgroundTertiary};
`;

const DayCell = styled.div<{ $isCurrentMonth: boolean; $isToday: boolean }>`
  min-height: 100px;
  padding: 5px;
  background-color: ${({ theme, $isCurrentMonth, $isToday }) =>
    $isToday
      ? `${theme.primary}15`
      : $isCurrentMonth
        ? theme.backgroundSecondary
        : theme.backgroundTertiary};
  opacity: ${({ $isCurrentMonth }) => $isCurrentMonth ? 1 : 0.5};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
  }
`;

const DayNumber = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
  text-align: right;
`;

const ActivitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const ActivityItem = styled.div<{ $status: ActivityStatus }>`
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${({ theme, $status }) => {
    switch ($status) {
      case ActivityStatus.COMPLETADA:
        return `${theme.success}20`;
      case ActivityStatus.EN_PROGRESO:
        return `${theme.warning}20`;
      case ActivityStatus.PENDIENTE:
      default:
        return `${theme.info}20`;
    }
  }};
  border-left: 3px solid ${({ theme, $status }) => {
    switch ($status) {
      case ActivityStatus.COMPLETADA:
        return theme.success;
      case ActivityStatus.EN_PROGRESO:
        return theme.warning;
      case ActivityStatus.PENDIENTE:
      default:
        return theme.info;
    }
  }};

  &:hover {
    filter: brightness(1.1);
  }
`;

const MoreActivities = styled.div`
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
`;

export default ActivityCalendar;
