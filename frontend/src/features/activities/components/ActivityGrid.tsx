import { useState } from 'react';
import styled from 'styled-components';
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiMoreVertical,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiCalendar,
  FiUser
} from 'react-icons/fi';
import { useDeleteActivity } from '@/hooks/useActivities';
import ActivityDetail from './ActivityDetail';
import ActivityForm from './ActivityForm';
import ConfirmDialog from '@/shared/components/common/ConfirmDialog';
import VirtualGrid from '@/components/common/VirtualGrid';
import { Activity, ActivityStatus, ActivityType } from '@/types/models';

const GridContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 20px;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadow};

  h3 {
    margin: 16px 0 8px;
    font-size: 18px;
    font-weight: 600;
  }

  p {
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 24px;
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const TypeBadge = styled.span<{ $type: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ $type, theme }) => {
    switch ($type) {
      case ActivityType.REUNION:
        return `${theme.primary}20`;
      case ActivityType.AUDIENCIA:
        return `${theme.secondary}20`;
      case ActivityType.ENTREVISTA:
        return `${theme.accent}20`;
      case ActivityType.INVESTIGACION:
        return `${theme.success}20`;
      default:
        return `${theme.textSecondary}20`;
    }
  }};
  color: ${({ $type, theme }) => {
    switch ($type) {
      case ActivityType.REUNION:
        return theme.primary;
      case ActivityType.AUDIENCIA:
        return theme.secondary;
      case ActivityType.ENTREVISTA:
        return theme.accent;
      case ActivityType.INVESTIGACION:
        return theme.success;
      default:
        return theme.textSecondary;
    }
  }};
`;

const ActionsContainer = styled.div`
  position: relative;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: ${({ theme }) => theme.textSecondary};

  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.text};
  }
`;

const ActionsMenu = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  min-width: 160px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 4px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  display: ${({ $show }) => ($show ? 'block' : 'none')};
`;

const MenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 16px;
  font-size: 14px;
  text-align: left;
  color: ${({ theme, $danger }) => $danger ? theme.error : theme.text};

  svg {
    margin-right: 8px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
  }
`;

const CardContent = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Description = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;

  svg {
    margin-right: 8px;
    color: ${({ theme }) => theme.textSecondary};
    flex-shrink: 0;
  }
`;

const PersonInfo = styled.div`
  display: flex;
  flex-direction: column;

  .name {
    font-weight: 500;
  }

  .role {
    font-size: 12px;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundSecondary};
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ $status, theme }) => {
    switch ($status) {
      case ActivityStatus.COMPLETADA:
        return `${theme.success}20`;
      case ActivityStatus.EN_PROGRESO:
        return `${theme.primary}20`;
      case ActivityStatus.PENDIENTE:
        return `${theme.warning}20`;
      default:
        return `${theme.textSecondary}20`;
    }
  }};
  color: ${({ $status, theme }) => {
    switch ($status) {
      case ActivityStatus.COMPLETADA:
        return theme.success;
      case ActivityStatus.EN_PROGRESO:
        return theme.primary;
      case ActivityStatus.PENDIENTE:
        return theme.warning;
      default:
        return theme.textSecondary;
    }
  }};
`;

const DateInfo = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const getStatusIcon = (status: string) => {
  switch (status) {
    case ActivityStatus.COMPLETADA:
      return <FiCheckCircle size={14} />;
    case ActivityStatus.EN_PROGRESO:
      return <FiClock size={14} />;
    case ActivityStatus.PENDIENTE:
      return <FiAlertCircle size={14} />;
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }),
    time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  };
};

interface ActivityGridProps {
  activities: Activity[];
}

const ActivityGrid = ({ activities }: ActivityGridProps) => {
  const deleteActivity = useDeleteActivity();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleMenuToggle = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleViewDetail = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowDetail(true);
    setOpenMenuId(null);
  };

  const handleEdit = (activity: Activity, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedActivity(activity);
    setShowEditForm(true);
    setOpenMenuId(null);
  };

  const handleDelete = (activity: Activity, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedActivity(activity);
    setShowConfirmDelete(true);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (selectedActivity) {
      deleteActivity.mutate(selectedActivity.id);
      setShowConfirmDelete(false);
    }
  };

  if (activities.length === 0) {
    return (
      <EmptyState>
        <FiAlertCircle size={48} color="#6C5CE7" />
        <h3>No hay actividades</h3>
        <p>No se encontraron actividades con los filtros actuales.</p>
      </EmptyState>
    );
  }

  const renderActivityCard = (activity: Activity) => {
    const formattedDate = formatDate(activity.date);

    return (
      <Card key={activity.id} onClick={() => handleViewDetail(activity)}>
        <CardHeader>
          <TypeBadge $type={activity.type}>
            {activity.type}
          </TypeBadge>
          <ActionsContainer onClick={e => e.stopPropagation()}>
            <ActionButton onClick={(e) => handleMenuToggle(activity.id, e)}>
              <FiMoreVertical size={18} />
            </ActionButton>
            <ActionsMenu $show={openMenuId === activity.id}>
              <MenuItem onClick={() => handleViewDetail(activity)}>
                <FiEye size={16} />
                Ver detalle
              </MenuItem>
              <MenuItem onClick={(e) => handleEdit(activity, e)}>
                <FiEdit2 size={16} />
                Editar
              </MenuItem>
              <MenuItem $danger onClick={(e) => handleDelete(activity, e)}>
                <FiTrash2 size={16} />
                Eliminar
              </MenuItem>
            </ActionsMenu>
          </ActionsContainer>
        </CardHeader>

        <CardContent>
          <Description>{activity.description}</Description>

          <MetaItem>
            <FiCalendar size={16} />
            <div>
              {formattedDate.date} - {formattedDate.time}
            </div>
          </MetaItem>

          <MetaItem>
            <FiUser size={16} />
            <PersonInfo>
              <span className="name">{activity.person || 'N/A'}</span>
              <span className="role">{activity.role || 'N/A'}</span>
            </PersonInfo>
          </MetaItem>
        </CardContent>

        <CardFooter>
          <StatusBadge $status={activity.status}>
            {getStatusIcon(activity.status)}
            {activity.status}
          </StatusBadge>

          <DateInfo>
            Actualizado: {formattedDate.date}
          </DateInfo>
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
      <GridContainer>
        <VirtualGrid
          items={activities}
          height={600}
          columnWidth={300}
          rowHeight={350}
          dynamicHeight={true}
          gap={20}
          renderItem={renderActivityCard}
          overscan={10}
          itemKey={(index) => activities[index]?.id || index}
        />
      </GridContainer>

      {showDetail && selectedActivity && (
        <ActivityDetail
          activity={selectedActivity}
          onClose={() => setShowDetail(false)}
          onEdit={() => {
            setShowDetail(false);
            setShowEditForm(true);
          }}
        />
      )}

      {showEditForm && selectedActivity && (
        <ActivityForm
          activity={selectedActivity}
          onClose={() => setShowEditForm(false)}
        />
      )}

      {showConfirmDelete && selectedActivity && (
        <ConfirmDialog
          title="Eliminar actividad"
          message={`¿Estás seguro de que deseas eliminar la actividad "${selectedActivity.description.substring(0, 30)}..."? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          danger
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
    </>
  );
};

export default ActivityGrid;
