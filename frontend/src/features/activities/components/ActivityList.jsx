import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiMoreVertical,
  FiCheckCircle,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi'
import { deleteActivity } from '../activitiesSlice'
import ActivityDetail from './ActivityDetail'
import ActivityForm from './ActivityForm'
import ConfirmDialog from '../../../components/common/ConfirmDialog'

const ListContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

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
`

const TableBody = styled.tbody`
  tr {
    &:hover {
      background-color: ${({ theme }) => theme.backgroundSecondary};
    }
    
    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.border};
    }
  }
  
  td {
    padding: 16px;
    font-size: 14px;
    
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

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'Completado':
        return `${theme.success}20`
      case 'En progreso':
        return `${theme.primary}20`
      case 'Pendiente':
        return `${theme.warning}20`
      default:
        return `${theme.textSecondary}20`
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'Completado':
        return theme.success
      case 'En progreso':
        return theme.primary
      case 'Pendiente':
        return theme.warning
      default:
        return theme.textSecondary
    }
  }};
`

const TypeBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'Atención Personal':
        return `${theme.primary}20`
      case 'Atención Telefónica':
        return `${theme.secondary}20`
      case 'Concursos':
        return `${theme.accent}20`
      case 'Solicitud de info':
        return `${theme.success}20`
      default:
        return `${theme.textSecondary}20`
    }
  }};
  color: ${({ type, theme }) => {
    switch (type) {
      case 'Atención Personal':
        return theme.primary
      case 'Atención Telefónica':
        return theme.secondary
      case 'Concursos':
        return theme.accent
      case 'Solicitud de info':
        return theme.success
      default:
        return theme.textSecondary
    }
  }};
`

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
  display: ${({ show }) => (show ? 'block' : 'none')};
`

const MenuItem = styled.button`
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

const ActivityList = ({ activities }) => {
  const dispatch = useDispatch()
  const [openMenuId, setOpenMenuId] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  
  const handleMenuToggle = (id) => {
    setOpenMenuId(openMenuId === id ? null : id)
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
    dispatch(deleteActivity(selectedActivity.id))
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
                <tr key={activity.id}>
                  <td>
                    <DateCell>
                      <span className="date">{formattedDate.date}</span>
                      <span className="time">{formattedDate.time}</span>
                    </DateCell>
                  </td>
                  <td>
                    <TypeBadge type={activity.type}>
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
                </tr>
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
