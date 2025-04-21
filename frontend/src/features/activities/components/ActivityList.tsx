import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiMoreVertical,
  FiCheckCircle,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';
import { useDeleteActivity } from '@/hooks/useActivities';
import ActivityDetail from './ActivityDetail';
import ActivityForm from './ActivityForm';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import VirtualList from '@/components/common/VirtualList';
import PresenceIndicator from '@/components/ui/Collaboration/PresenceIndicator';
import { useActivityPresence } from '@/hooks/useActivityPresence';
import { Activity, ActivityStatus, ActivityType } from '@/types/models';

const ListContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.backgroundSecondary};

  th {
    padding: 16px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    color: ${({ theme }) => theme.textSecondary};
    border-bottom: 1px solid ${({ theme }) => theme.border};

    &:last-child {
      text-align: center;
    }
  }
`;

const TableRow = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.backgroundSecondary};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }

  td {
    padding: 16px;
    font-size: 14px;

    &:last-child {
      text-align: center;
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;

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

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ status, theme }) => {
    switch (status) {
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
  color: ${({ status, theme }) => {
    switch (status) {
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

const TypeBadge = styled.span<{ type: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ type, theme }) => {
    switch (type) {
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
  color: ${({ type, theme }) => {
    switch (type) {
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
  display: inline-block;
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

const ActionsMenu = styled.div<{ show: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  min-width: 160px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 4px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  display: ${({ show }) => (show ? 'block' : 'none')};
`;

const MenuItem = styled.button<{ danger?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 16px;
  font-size: 14px;
  text-align: left;
  color: ${({ theme, danger }) => danger ? theme.error : theme.text};

  svg {
    margin-right: 8px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
  }
`;

const DateCell = styled.div`
  display: flex;
  flex-direction: column;

  .date {
    font-weight: 500;
  }

  .time {
    font-size: 12px;
    color: ${({ theme }) => theme.textSecondary};
    margin-top: 4px;
  }
`;

const PersonCell = styled.div`
  display: flex;
  flex-direction: column;

  .name {
    font-weight: 500;
  }

  .role {
    font-size: 12px;
    color: ${({ theme }) => theme.textSecondary};
    margin-top: 4px;
  }
`;

const VirtualTableContainer = styled.div`
  width: 100%;
  overflow: hidden;
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

interface ActivityListProps {
  activities: Activity[];
}

const ActivityList = ({ activities }: ActivityListProps) => {
  const deleteActivity = useDeleteActivity();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Agregar log para ver las actividades recibidas en el componente
  useEffect(() => {
    console.log('ActivityList recibió actividades:', activities);
    console.log('Cantidad de actividades:', activities.length);

    if (activities.length > 0) {
      console.log('Primera actividad en ActivityList:', activities[0]);

      // Verificar si las actividades tienen la estructura esperada
      const firstActivity = activities[0];
      console.log('Propiedades de la primera actividad:', Object.keys(firstActivity));

      // Verificar propiedades requeridas
      const requiredProps = ['id', 'date', 'type', 'description', 'status'];
      const missingProps = requiredProps.filter(prop => !(prop in firstActivity));

      if (missingProps.length > 0) {
        console.error('Faltan propiedades requeridas en la actividad:', missingProps);
      } else {
        console.log('La actividad tiene todas las propiedades requeridas');
      }

      // Verificar tipos de datos
      console.log('Tipo de id:', typeof firstActivity.id);
      console.log('Tipo de date:', typeof firstActivity.date);
      console.log('Tipo de type:', typeof firstActivity.type);
      console.log('Tipo de description:', typeof firstActivity.description);
      console.log('Tipo de status:', typeof firstActivity.status);
    } else {
      console.warn('No hay actividades para mostrar en ActivityList');
    }

    // Verificar si hay errores en la renderización
    try {
      // Intentar renderizar la primera actividad (simulación)
      if (activities.length > 0) {
        const activity = activities[0];
        const formattedDate = formatDate(activity.date);
        console.log('Fecha formateada:', formattedDate);
      }
    } catch (error) {
      console.error('Error al intentar procesar una actividad:', error);
    }
  }, [activities]);

  const handleMenuToggle = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleViewDetail = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowDetail(true);
    setOpenMenuId(null);
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowEditForm(true);
    setOpenMenuId(null);
  };

  const handleDelete = (activity: Activity) => {
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
      <ListContainer>
        <EmptyState>
          <FiAlertCircle size={48} color="#6C5CE7" />
          <h3>No hay actividades</h3>
          <p>No se encontraron actividades con los filtros actuales.</p>
        </EmptyState>
      </ListContainer>
    );
  }

  const renderActivityRow = (activity: Activity) => {
    // Verificar que la actividad tenga los campos necesarios
    if (!activity || !activity.id) {
      console.error('Actividad inválida:', activity);
      return null;
    }

    // Usar el hook de presencia para esta actividad
    const { userNames } = useActivityPresence(activity.id);

    try {
      // Intentar formatear la fecha con manejo de errores
      let formattedDate = { date: 'N/A', time: 'N/A' };
      try {
        if (activity.date) {
          formattedDate = formatDate(activity.date);
        } else if (activity.createdAt) {
          formattedDate = formatDate(activity.createdAt);
          console.warn('Usando createdAt en lugar de date para la actividad:', activity.id);
        }
      } catch (error) {
        console.error('Error al formatear fecha:', error);
      }

      // Asegurar que la descripción sea una cadena
      const description = typeof activity.description === 'string'
        ? activity.description
        : 'Sin descripción';

      // Truncar la descripción de manera segura
      const truncatedDescription = description.length > 50
        ? `${description.substring(0, 50)}...`
        : description;

      return (
        <TableRow key={activity.id}>
          <td style={{ position: 'relative' }}>
            <DateCell>
              <span className="date">{formattedDate.date}</span>
              <span className="time">{formattedDate.time}</span>
            </DateCell>
            <PresenceIndicator
              activityId={activity.id}
              size="small"
              position="top-right"
              userNames={userNames}
            />
          </td>
          <td>
            <TypeBadge type={activity.type || 'OTRO'}>
              {activity.type || 'OTRO'}
            </TypeBadge>
          </td>
          <td>
            <PersonCell>
              <span className="name">{activity.person || 'N/A'}</span>
              <span className="role">{activity.role || 'N/A'}</span>
            </PersonCell>
          </td>
          <td>{truncatedDescription}</td>
          <td>
            <StatusBadge status={activity.status || 'PENDIENTE'}>
              {getStatusIcon(activity.status || 'PENDIENTE')}
              {activity.status || 'PENDIENTE'}
            </StatusBadge>
          </td>
          <td>
            <ActionsContainer>
              <ActionButton onClick={() => handleMenuToggle(activity.id)}>
                <FiMoreVertical size={18} />
              </ActionButton>
              <ActionsMenu show={openMenuId === activity.id}>
                <MenuItem onClick={() => handleViewDetail(activity)}>
                  <FiEye size={16} />
                  Ver detalle
                </MenuItem>
                <MenuItem onClick={() => handleEdit(activity)}>
                  <FiEdit2 size={16} />
                  Editar
                </MenuItem>
                <MenuItem danger onClick={() => handleDelete(activity)}>
                  <FiTrash2 size={16} />
                  Eliminar
                </MenuItem>
              </ActionsMenu>
            </ActionsContainer>
          </td>
        </TableRow>
      );
    } catch (error) {
      console.error('Error al renderizar actividad:', error, activity);
      return null;
    }
  };

  return (
    <>
      <ListContainer>
        <Table>
          <TableHead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Persona</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </TableHead>
        </Table>

        <VirtualTableContainer>
          <VirtualList
            items={activities}
            height={500}
            estimateSize={80}
            dynamicSize={true}
            renderItem={renderActivityRow}
            overscan={10}
            itemKey={(index) => activities[index]?.id || index}
          />
        </VirtualTableContainer>
      </ListContainer>

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

export default ActivityList;
