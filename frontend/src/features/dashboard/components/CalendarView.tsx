/**
 * @file CalendarView component
 * @description A reusable calendar component for displaying deadlines and events
 */

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiLoader,
  FiAlertCircle
} from 'react-icons/fi';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { glassCard } from '@/shared/styles';

// Styled components
const CalendarContainer = styled.div`
  ${glassCard}
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CalendarTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MonthTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  min-width: 120px;
  text-align: center;
`;

const NavButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.textPrimary};
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const DayHeader = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
  padding: 8px 0;
`;

interface DayProps {
  $isToday: boolean;
  $isCurrentMonth: boolean;
  $isPast: boolean;
  $hasEvent: boolean;
}

const Day = styled.div<DayProps>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;

  color: ${({ $isCurrentMonth, $isPast, theme }) =>
    !$isCurrentMonth ? theme.textTertiary :
    $isPast ? theme.textSecondary :
    theme.text
  };

  background-color: ${({ $isToday, theme }) =>
    $isToday ? `${theme.primary}20` : 'transparent'
  };

  font-weight: ${({ $isToday }) => $isToday ? '700' : '400'};

  &::after {
    content: '';
    display: ${({ $hasEvent }) => $hasEvent ? 'block' : 'none'};
    position: absolute;
    bottom: 4px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.primary};
  }

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;

  h4 {
    margin: 8px 0 4px;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 16px;
`;

const LoadingSpinner = styled(FiLoader)`
  animation: spin 1s linear infinite;
  color: ${({ theme }) => theme.primary};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Types
export interface CalendarEvent {
  id: number;
  date: string;
  title: string;
}

interface CalendarViewProps {
  title?: string;
  events: CalendarEvent[];
  isLoading?: boolean;
  emptyMessage?: string;
  onDateClick?: (date: Date) => void;
  onEventClick?: (eventId: number) => void;
}

/**
 * CalendarView component
 * @param props Component props
 * @returns {JSX.Element} The CalendarView component
 */
const CalendarView: React.FC<CalendarViewProps> = ({
  title = 'Calendario',
  events,
  isLoading = false,
  emptyMessage = 'No hay eventos para mostrar',
  onDateClick,
  onEventClick
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate days for the current month view
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const dateRange = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Create calendar days with metadata
    return dateRange.map(date => {
      // Check if there's an event on this day
      const hasEvent = events.some(event => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });

      return {
        date,
        day: date.getDate(),
        isCurrentMonth: isSameMonth(date, currentMonth),
        isToday: isToday(date),
        isPast: isBefore(date, new Date()) && !isToday(date),
        hasEvent
      };
    });
  }, [currentMonth, events]);

  // Navigation handlers
  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  // Click handlers
  const handleDayClick = (date: Date) => {
    if (onDateClick) {
      onDateClick(date);
    }
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          <FiCalendar size={18} />
          {title}
        </CalendarTitle>

        <MonthNavigation>
          <NavButton onClick={handlePreviousMonth}>
            <FiChevronLeft size={18} />
          </NavButton>
          <MonthTitle>
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </MonthTitle>
          <NavButton onClick={handleNextMonth}>
            <FiChevronRight size={18} />
          </NavButton>
        </MonthNavigation>
      </CalendarHeader>

      {isLoading ? (
        <LoadingState>
          <LoadingSpinner size={24} />
        </LoadingState>
      ) : events.length === 0 ? (
        <EmptyState>
          <FiAlertCircle size={24} />
          <h4>No hay fechas límite próximas</h4>
          <p>No tienes tareas con fechas de vencimiento próximas.</p>
          <p style={{ marginTop: '8px', fontSize: '13px' }}>
            Cuando recibas tareas con fechas límite, aparecerán en este calendario.
          </p>
        </EmptyState>
      ) : (
        <CalendarGrid>
          {/* Day headers */}
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
            <DayHeader key={index}>{day}</DayHeader>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => (
            <Day
              key={index}
              $isToday={day.isToday}
              $isCurrentMonth={day.isCurrentMonth}
              $isPast={day.isPast}
              $hasEvent={day.hasEvent}
              onClick={() => handleDayClick(day.date)}
            >
              {day.day}
            </Day>
          ))}
        </CalendarGrid>
      )}
    </CalendarContainer>
  );
};

export default CalendarView;
