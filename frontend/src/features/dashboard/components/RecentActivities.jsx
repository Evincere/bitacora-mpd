import styled from 'styled-components'
import { FiMoreVertical, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`

const MenuButton = styled.button`
  color: ${({ theme }) => theme.textSecondary};
  
  &:hover {
    color: ${({ theme }) => theme.text};
  }
`

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
`

const StatusIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'completed': return `${theme.success}20`
      case 'pending': return `${theme.warning}20`
      case 'in-progress': return `${theme.primary}20`
      default: return `${theme.textSecondary}20`
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: ${({ status, theme }) => {
    switch (status) {
      case 'completed': return theme.success
      case 'pending': return theme.warning
      case 'in-progress': return theme.primary
      default: return theme.textSecondary
    }
  }};
`

const ActivityContent = styled.div`
  flex: 1;
`

const ActivityTitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px;
`

const ActivityMeta = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`

const ActivityTime = styled.span`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 4px;
  }
`

const ActivityUser = styled.span`
  margin-left: 12px;
  
  strong {
    font-weight: 500;
    color: ${({ theme }) => theme.text};
  }
`

const ViewAllButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.primary};
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
  }
`

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed': return <FiCheckCircle size={16} />
    case 'pending': return <FiAlertCircle size={16} />
    case 'in-progress': return <FiClock size={16} />
    default: return <FiClock size={16} />
  }
}

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      title: 'Atención telefónica a Juan Pérez',
      time: '2 horas atrás',
      user: 'María González',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Concurso evaluación de candidatos',
      time: '3 horas atrás',
      user: 'Carlos Rodríguez',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Solicitud de información sobre expediente',
      time: '5 horas atrás',
      user: 'Ana Martínez',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Registro de documentación recibida',
      time: '1 día atrás',
      user: 'Luis Sánchez',
      status: 'completed'
    }
  ]
  
  return (
    <Card>
      <CardHeader>
        <Title>Actividades recientes</Title>
        <MenuButton>
          <FiMoreVertical size={20} />
        </MenuButton>
      </CardHeader>
      
      <ActivityList>
        {activities.map(activity => (
          <ActivityItem key={activity.id}>
            <StatusIcon status={activity.status}>
              {getStatusIcon(activity.status)}
            </StatusIcon>
            <ActivityContent>
              <ActivityTitle>{activity.title}</ActivityTitle>
              <ActivityMeta>
                <ActivityTime>
                  <FiClock size={12} />
                  {activity.time}
                </ActivityTime>
                <ActivityUser>
                  por <strong>{activity.user}</strong>
                </ActivityUser>
              </ActivityMeta>
            </ActivityContent>
          </ActivityItem>
        ))}
      </ActivityList>
      
      <ViewAllButton>
        Ver todas las actividades
      </ViewAllButton>
    </Card>
  )
}

export default RecentActivities
