import React, { useState } from 'react';
import styled from 'styled-components';
import { FiCalendar, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (range: [Date | null, Date | null]) => void;
  startDatePlaceholder?: string;
  endDatePlaceholder?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  startDatePlaceholder = 'Fecha inicio',
  endDatePlaceholder = 'Fecha fin'
}) => {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onChange([date, endDate]);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onChange([startDate, date]);
  };

  const clearStartDate = () => {
    onChange([null, endDate]);
  };

  const clearEndDate = () => {
    onChange([startDate, null]);
  };

  const formatDateForDisplay = (date: Date | null) => {
    if (!date) return '';
    return format(date, 'dd/MM/yyyy', { locale: es });
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return format(date, 'yyyy-MM-dd');
  };

  return (
    <DateRangeContainer>
      <DateInputContainer>
        <DateInputLabel>
          <FiCalendar />
          {startDatePlaceholder}
        </DateInputLabel>
        <DateInputWrapper>
          <DateInput
            type="date"
            value={formatDateForInput(startDate)}
            onChange={handleStartDateChange}
            onFocus={() => setIsStartOpen(true)}
            onBlur={() => setIsStartOpen(false)}
          />
          {startDate && (
            <ClearButton onClick={clearStartDate}>
              <FiX />
            </ClearButton>
          )}
        </DateInputWrapper>
        {startDate && (
          <DateDisplay>
            {formatDateForDisplay(startDate)}
          </DateDisplay>
        )}
      </DateInputContainer>

      <DateSeparator>hasta</DateSeparator>

      <DateInputContainer>
        <DateInputLabel>
          <FiCalendar />
          {endDatePlaceholder}
        </DateInputLabel>
        <DateInputWrapper>
          <DateInput
            type="date"
            value={formatDateForInput(endDate)}
            onChange={handleEndDateChange}
            onFocus={() => setIsEndOpen(true)}
            onBlur={() => setIsEndOpen(false)}
            min={startDate ? formatDateForInput(startDate) : undefined}
          />
          {endDate && (
            <ClearButton onClick={clearEndDate}>
              <FiX />
            </ClearButton>
          )}
        </DateInputWrapper>
        {endDate && (
          <DateDisplay>
            {formatDateForDisplay(endDate)}
          </DateDisplay>
        )}
      </DateInputContainer>
    </DateRangeContainer>
  );
};

const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DateInputContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const DateInputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  margin-bottom: 5px;
  color: ${({ theme }) => theme.textSecondary};

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const DateInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const DateInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}30;
  }

  &::-webkit-calendar-picker-indicator {
    filter: ${({ theme }) => theme.background.includes('#1') || theme.background.includes('#2') || theme.background.includes('#0') ? 'invert(1)' : 'none'};
    cursor: pointer;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 30px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const DateDisplay = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 4px;
`;

const DateSeparator = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  padding: 0 5px;

  @media (max-width: 768px) {
    align-self: center;
    padding: 5px 0;
  }
`;

export default DateRangePicker;
