import React from 'react';
import styled from 'styled-components';
import { FiEdit2, FiEye, FiCalendar, FiUser, FiMapPin, FiTag, FiClock } from 'react-icons/fi';
import { Activity, ActivityStatus, ActivityType } from '@/core/types/models';
import { formatDate } from '@/core/utils/dateUtils';
import PresenceIndicator from '@/shared/components/ui/Collaboration/PresenceIndicator';
import { useActivityPresence } from '@/features/activities/hooks';

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
  onEdit?: () => void;
  expanded?: boolean;
}

const Card = styled.div<{ status: ActivityStatus; expanded: boolean }>`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 16px;
  margin-bottom: 16px;
  position: relative;
  transition: all 0.3s ease;
  border-left: 4px solid ${({ status, theme }) => {
    switch (status) {
      case ActivityStatus.COMPLETADA:
        return theme.success;
      case ActivityStatus.EN_PROGRESO:
        return theme.warning;
      case ActivityStatus.PENDIENTE:
        return theme.info;
      case ActivityStatus.CANCELADA:
        return theme.error;
      default:
        return theme.border;
    }
  }};

  ${({ expanded }) => expanded && `
    transform: scale(1.01);
    box-shadow: ${({ theme }) => theme.shadowHover};
  `}

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: transparent;
  color: ${({ theme }) => theme.textSecondary};
  border: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};
  }
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
`;

const StatusBadge = styled.span<{ status: ActivityStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  ${({ status, theme }) => {
    switch (status) {
      case ActivityStatus.COMPLETADA:
        return `
          background-color: ${theme.successLight};
          color: ${theme.success};
        `;
      case ActivityStatus.EN_PROGRESO:
        return `
          background-color: ${theme.warningLight};
          color: ${theme.warning};
        `;
      case ActivityStatus.PENDIENTE:
        return `
          background-color: ${theme.infoLight};
          color: ${theme.info};
        `;
      case ActivityStatus.CANCELADA:
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

const TypeBadge = styled.span<{ type: ActivityType }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.backgroundHover};
  color: ${({ theme }) => theme.textSecondary};
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  margin: 0 0 12px 0;
  line-height: 1.5;
`;

const CardDetails = styled.div<{ expanded: boolean }>`
  display: ${({ expanded }) => expanded ? 'block' : 'none'};
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const DetailSection = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.text};
`;

const DetailContent = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  margin: 0;
  line-height: 1.5;
`;

const EmptyDetail = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0;
  font-style: italic;
`;

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onClick,
  onEdit,
  expanded = false
}) => {
  const { userNames } = useActivityPresence(activity.id);

  const handleCardClick = () => {
    if (onClick) onClick();
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit();
  };

  return (
    <Card
      status={activity.status as ActivityStatus}
      expanded={expanded}
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle>{activity.description.substring(0, 50)}{activity.description.length > 50 ? '...' : ''}</CardTitle>
        <CardActions>
          {activity.id && userNames.length > 0 && (
            <PresenceIndicator
              activityId={activity.id}
              userNames={userNames}
              size="small"
            />
          )}
          <ActionButton onClick={handleEditClick}>
            <FiEdit2 size={16} />
          </ActionButton>
        </CardActions>
      </CardHeader>

      <CardMeta>
        <MetaItem>
          <FiCalendar size={14} />
          {formatDate(activity.date)}
        </MetaItem>

        {activity.person && (
          <MetaItem>
            <FiUser size={14} />
            {activity.person}
          </MetaItem>
        )}

        {activity.dependency && (
          <MetaItem>
            <FiMapPin size={14} />
            {activity.dependency}
          </MetaItem>
        )}

        <MetaItem>
          <FiTag size={14} />
          <TypeBadge type={activity.type as ActivityType}>
            {activity.type}
          </TypeBadge>
        </MetaItem>

        <MetaItem>
          <FiClock size={14} />
          <StatusBadge status={activity.status as ActivityStatus}>
            {activity.status}
          </StatusBadge>
        </MetaItem>
      </CardMeta>

      <CardDescription>
        {activity.description}
      </CardDescription>

      {expanded && (
        <CardDetails expanded={expanded}>
          {activity.situation && (
            <DetailSection>
              <DetailTitle>Situación</DetailTitle>
              <DetailContent>{activity.situation}</DetailContent>
            </DetailSection>
          )}

          {activity.result && (
            <DetailSection>
              <DetailTitle>Resultado</DetailTitle>
              <DetailContent>{activity.result}</DetailContent>
            </DetailSection>
          )}

          {activity.comments && (
            <DetailSection>
              <DetailTitle>Comentarios</DetailTitle>
              <DetailContent>{activity.comments}</DetailContent>
            </DetailSection>
          )}

          {!activity.situation && !activity.result && !activity.comments && (
            <EmptyDetail>No hay detalles adicionales para mostrar</EmptyDetail>
          )}
        </CardDetails>
      )}
    </Card>
  );
};

export default ActivityCard;
