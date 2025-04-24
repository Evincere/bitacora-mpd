import React from 'react';
import styled from 'styled-components';
import { StatusBadge, TypeBadge } from '@/shared/components/ui';

const LegendContainer = styled.div`
  background-color: ${({ theme }) => `${theme.backgroundSecondary}F0`};
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  padding: 20px;
  margin-top: 20px;
  width: 100%;
  border-top: 3px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text};
`;

const LegendTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 18px;
    background-color: ${({ theme }) => theme.primary};
    margin-right: 10px;
    border-radius: 2px;
  }
`;

const LegendSection = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  h4 {
    margin: 0 0 12px 0;
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.textSecondary};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    padding-bottom: 8px;
  }
`;

const LegendItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0 4px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  background-color: ${({ theme }) => `${theme.backgroundPrimary}80`};
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundPrimary};
    color: ${({ theme }) => theme.text};
    transform: translateY(-2px);
  }
`;

const ColorBox = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background-color: ${({ $color }) => $color};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CalendarLegend = () => {
  // Definir los tipos de actividades
  const activityTypes = [
    { type: 'REUNION', label: 'Reunión' },
    { type: 'LLAMADA', label: 'Llamada' },
    { type: 'RECORDATORIO', label: 'Recordatorio' },
    { type: 'TAREA', label: 'Tarea' },
    { type: 'OTRO', label: 'Otro' }
  ];

  // Definir los estados de actividades
  const activityStatuses = [
    { status: 'PENDIENTE', label: 'Pendiente' },
    { status: 'EN_PROGRESO', label: 'En progreso' },
    { status: 'COMPLETADA', label: 'Completada' },
    { status: 'CANCELADA', label: 'Cancelada' }
  ];

  return (
    <LegendContainer>
      <LegendTitle>Leyenda del Calendario</LegendTitle>

      <LegendSection>
        <h4>Tipos de Actividades</h4>
        <LegendItems>
          {activityTypes.map(item => (
            <LegendItem key={item.type}>
              <TypeBadge type={item.type} />
              {item.label}
            </LegendItem>
          ))}
        </LegendItems>
      </LegendSection>

      <LegendSection>
        <h4>Estados de Actividades</h4>
        <LegendItems>
          {activityStatuses.map(item => (
            <LegendItem key={item.status}>
              <StatusBadge status={item.status} />
              {item.label}
            </LegendItem>
          ))}
        </LegendItems>
      </LegendSection>
    </LegendContainer>
  );
};

export default CalendarLegend;
