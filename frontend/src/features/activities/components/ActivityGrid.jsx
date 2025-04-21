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
  FiCalendar,
  FiUser
} from 'react-icons/fi'
import { useDeleteActivity } from '@/hooks/useActivities'
import ActivityDetail from './ActivityDetail'
import ActivityForm from './ActivityForm'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import StatusBadge from '../../../components/ui/StatusBadge'
import TypeBadge from '../../../components/ui/TypeBadge'

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`

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
`

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  height: 100%;
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

// Usando el componente global TypeBadge

const ActionsContainer = styled.div`
  position: relative;
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

const CardContent = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
`

const Description = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

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
`

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
`

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundSecondary};
`

// Usando el componente global StatusBadge

const DateInfo = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`

const getStatusIcon = (status) => {
  switch (status) {
    case 'Completado':
      return <FiCheckCircle size={14} />
    case 'En progreso':
      return <FiClock size={14} />
    case 'Pendiente':
      return <FiAlertCircle size={14} />
    default:
      return null
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }),
    time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }
}

const ActivityGrid = ({ activities }) => {
  const deleteActivity = useDeleteActivity()
  const [openMenuId, setOpenMenuId] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleMenuToggle = (id, e) => {
    e.stopPropagation()
    setOpenMenuId(openMenuId === id ? null : id)
  }

  const handleViewDetail = (activity) => {
    setSelectedActivity(activity)
    setShowDetail(true)
    setOpenMenuId(null)
  }

  const handleEdit = (activity, e) => {
    e.stopPropagation()
    setSelectedActivity(activity)
    setShowEditForm(true)
    setOpenMenuId(null)
  }

  const handleDelete = (activity, e) => {
    e.stopPropagation()
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
      <GridContainer>
        <EmptyState>
          <FiAlertCircle size={48} color="#6C5CE7" />
          <h3>No hay actividades</h3>
          <p>No se encontraron actividades con los filtros actuales.</p>
        </EmptyState>
      </GridContainer>
    )
  }

  return (
    <>
      <GridContainer>
        {activities.map(activity => {
          const formattedDate = formatDate(activity.date)

          return (
            <Card key={activity.id} onClick={() => handleViewDetail(activity)}>
              <CardHeader>
                <TypeBadge type={activity.type}>
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
                    <span className="name">{activity.person}</span>
                    <span className="role">{activity.role}</span>
                  </PersonInfo>
                </MetaItem>
              </CardContent>

              <CardFooter>
                <StatusBadge status={activity.status}>
                  {getStatusIcon(activity.status)}
                  {activity.status}
                </StatusBadge>

                <DateInfo>
                  Actualizado: {formattedDate.date}
                </DateInfo>
              </CardFooter>
            </Card>
          )
        })}
      </GridContainer>

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

export default ActivityGrid
