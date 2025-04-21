import React, { useState } from 'react'
import styled from 'styled-components'
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiMoreVertical,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiUser,
  FiFileText,
  FiTag,
  FiPhone,
  FiMail,
  FiUsers,
  FiClipboard,
  FiInfo
} from 'react-icons/fi'
import { glassCard, glassExpandable } from '../../../styles/glassmorphism'
import { statusColors, typeColors } from '../../../styles/statusColors'
import { useDeleteActivity } from '@/hooks/useActivities'
import ActivityDetail from './ActivityDetail'
import ActivityForm from './ActivityForm'
import ExpandableActivityDetail from './ExpandableActivityDetail'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import StatusBadge from '../../../components/ui/StatusBadge'
import TypeBadge from '../../../components/ui/TypeBadge'

const ListContainer = styled.div`
  ${glassCard}
  overflow: hidden;
  transition: all 0.3s ease;
  border-radius: 12px;
  margin-bottom: 24px;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHead = styled.thead`
  background-color: rgba(42, 42, 48, 0.8);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 10;

  th {
    padding: 16px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    color: ${({ theme }) => theme.textSecondary};
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.2s ease;

    &:last-child {
      text-align: center;
    }
  }
`

const TableBody = styled.tbody`
  tr {
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      background-color: rgba(42, 42, 48, 0.5);
    }

    &:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }
  }

  td {
    padding: 16px;
    font-size: 14px;
    transition: all 0.2s ease;

    &:last-child {
      text-align: center;
    }
  }
`

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
`

// StatusBadge ahora se importa desde components/ui/StatusBadge

// TypeBadge ahora se importa desde components/ui/TypeBadge

const ActionsContainer = styled.div`
  position: relative;
  display: inline-block;
`

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
`

const ActionsMenu = styled.div`
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
`

const MenuItem = styled.button`
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
`

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
`

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
`

const getStatusIcon = (status) => {
  switch (status) {
    case 'Completado':
      return <FiCheckCircle size={16} />
    case 'En progreso':
      return <FiClock size={16} />
    case 'Pendiente':
      return <FiAlertCircle size={16} />
    default:
      return null
  }
}

const getTypeIcon = (type) => {
  switch (type) {
    case 'Atención Personal':
      return <FiUser size={16} />
    case 'Atención Telefónica':
      return <FiPhone size={16} />
    case 'Concursos':
      return <FiUsers size={16} />
    case 'Solicitud de info':
      return <FiInfo size={16} />
    case 'Mails':
      return <FiMail size={16} />
    case 'Multitareas':
      return <FiClipboard size={16} />
    case 'Tomo Nota':
      return <FiFileText size={16} />
    default:
      return <FiTag size={16} />
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }),
    time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }
}

const RowContainer = styled.tr`
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background-color: rgba(42, 42, 48, 0.5);
    transform: translateZ(5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  ${({ $expanded }) => $expanded && `
    background-color: rgba(42, 42, 48, 0.7) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 5;
  `}
`

const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(108, 92, 231, 0.1);
  color: ${({ theme }) => theme.primary};
  margin-right: 10px;
  transition: all 0.3s ease;
  transform: ${({ $expanded }) => $expanded ? 'rotate(180deg)' : 'rotate(0)'};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(108, 92, 231, 0.2);

  &:hover {
    background-color: rgba(108, 92, 231, 0.2);
    color: ${({ theme }) => theme.primary};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: ${({ $expanded }) => $expanded ? 'rotate(180deg) scale(1.1)' : 'rotate(0) scale(1.1)'};
  }

  &:active {
    transform: ${({ $expanded }) => $expanded ? 'rotate(180deg) scale(0.95)' : 'rotate(0) scale(0.95)'};
  }
`

const ActivityList = ({ activities }) => {
  const deleteActivity = useDeleteActivity()
  const [openMenuId, setOpenMenuId] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [expandedActivityId, setExpandedActivityId] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleMenuToggle = (id) => {
    setOpenMenuId(openMenuId === id ? null : id)
  }

  const handleToggleExpand = (activity) => {
    if (expandedActivityId === activity.id) {
      setExpandedActivityId(null)
    } else {
      setExpandedActivityId(activity.id)
      setSelectedActivity(activity)
    }
    setOpenMenuId(null)
  }

  const handleViewDetail = (activity) => {
    setSelectedActivity(activity)
    setShowDetail(true)
    setOpenMenuId(null)
  }

  const handleEdit = (activity) => {
    setSelectedActivity(activity)
    setShowEditForm(true)
    setOpenMenuId(null)
  }

  const handleDelete = (activity) => {
    setSelectedActivity(activity)
    setShowConfirmDelete(true)
    setOpenMenuId(null)
  }

  const confirmDelete = () => {
    deleteActivity.mutate(selectedActivity.id)
    setShowConfirmDelete(false)
  }

  if (activities.length === 0) {
    return (
      <ListContainer>
        <EmptyState>
          <FiAlertCircle size={48} color="#6C5CE7" />
          <h3>No hay actividades</h3>
          <p>No se encontraron actividades con los filtros actuales.</p>
        </EmptyState>
      </ListContainer>
    )
  }

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
          <TableBody>
            {activities.map(activity => {
              const formattedDate = formatDate(activity.date)

              return (
                <React.Fragment key={activity.id}>
                  <RowContainer onClick={() => handleToggleExpand(activity)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ExpandButton $expanded={expandedActivityId === activity.id}>
                          <FiChevronDown size={16} />
                        </ExpandButton>
                        <DateCell>
                          <span className="date">{formattedDate.date}</span>
                          <span className="time">{formattedDate.time}</span>
                        </DateCell>
                      </div>
                    </td>
                    <td>
                      <TypeBadge type={activity.type}>
                        {getTypeIcon(activity.type)}
                        {activity.type}
                      </TypeBadge>
                    </td>
                    <td>
                      <PersonCell>
                        <span className="name">{activity.person}</span>
                        <span className="role">{activity.role}</span>
                      </PersonCell>
                    </td>
                    <td>{activity.description.substring(0, 50)}...</td>
                    <td>
                      <StatusBadge status={activity.status}>
                        {getStatusIcon(activity.status)}
                        {activity.status}
                      </StatusBadge>
                    </td>
                    <td>
                      <ActionsContainer onClick={(e) => e.stopPropagation()}>
                        <ActionButton onClick={() => handleMenuToggle(activity.id)}>
                          <FiMoreVertical size={18} />
                        </ActionButton>
                        <ActionsMenu $show={openMenuId === activity.id}>
                          <MenuItem onClick={() => handleEdit(activity)}>
                            <FiEdit2 size={16} />
                            Editar
                          </MenuItem>
                          <MenuItem $danger onClick={() => handleDelete(activity)}>
                            <FiTrash2 size={16} />
                            Eliminar
                          </MenuItem>
                        </ActionsMenu>
                      </ActionsContainer>
                    </td>
                  </RowContainer>
                  {expandedActivityId === activity.id && (
                    <tr>
                      <td colSpan="6" style={{ padding: 0 }}>
                        <ExpandableActivityDetail
                          activity={activity}
                          expanded={expandedActivityId === activity.id}
                          onEdit={() => handleEdit(activity)}
                          onClose={() => setExpandedActivityId(null)}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </ListContainer>

      {showDetail && selectedActivity && (
        <ActivityDetail
          activity={selectedActivity}
          onClose={() => setShowDetail(false)}
          onEdit={() => {
            setShowDetail(false)
            setShowEditForm(true)
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
  )
}

export default ActivityList
