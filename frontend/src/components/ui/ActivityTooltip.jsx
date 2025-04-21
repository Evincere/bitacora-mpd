import React from 'react';
import styled from 'styled-components';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import StatusBadge from './StatusBadge';
import TypeBadge from './TypeBadge';

const TooltipContainer = styled.div`
  position: absolute;
  z-index: 1000;
  background-color: ${({ theme }) => `${theme.backgroundSecondary}F0`};
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
  padding: 16px;
  min-width: 280px;
  max-width: 350px;
  pointer-events: none;
  border-left: 4px solid ${({ $type, theme }) => {
    switch ($type) {
      case 'REUNION': return theme.success;
      case 'LLAMADA': return theme.info;
      case 'RECORDATORIO': return theme.warning;
      case 'TAREA': return theme.secondary;
      default: return theme.textSecondary;
    }
  }};
  color: ${({ theme }) => theme.text};

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 15px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid ${({ theme }) => `${theme.backgroundSecondary}F0`};
  }
`;

const TooltipHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
  }
`;

const TooltipContent = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};

  p {
    margin: 6px 0;
    line-height: 1.5;
  }

  .label {
    font-weight: 600;
    color: ${({ theme }) => theme.text};
    margin-right: 6px;
  }
`;

const BadgesContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
`;

const ActivityTooltip = ({ activity, position }) => {
  if (!activity) return null;

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd MMMM yyyy, HH:mm', { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  return (
    <TooltipContainer
      style={{
        top: position?.top || 0,
        left: position?.left || 0
      }}
      $type={activity.type}
    >
      <TooltipHeader>
        <h4>{activity.title || activity.description}</h4>
      </TooltipHeader>

      <TooltipContent>
        <p>
          <span className="label">Fecha:</span>
          {formatDate(activity.date)}
        </p>

        {activity.person && (
          <p>
            <span className="label">Persona:</span>
            {activity.person}
          </p>
        )}

        {activity.dependency && (
          <p>
            <span className="label">Dependencia:</span>
            {activity.dependency}
          </p>
        )}

        {activity.comments && (
          <p>
            <span className="label">Comentarios:</span>
            {activity.comments}
          </p>
        )}

        <BadgesContainer>
          <StatusBadge status={activity.status} />
          <TypeBadge type={activity.type} />
        </BadgesContainer>
      </TooltipContent>
    </TooltipContainer>
  );
};

export default ActivityTooltip;
