import { useEffect } from 'react'
import styled from 'styled-components'
import { 
  FiX, 
  FiEdit2, 
  FiCalendar, 
  FiUser, 
  FiMapPin, 
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`

const DetailContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`

const CloseButton = styled.button`
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

const DetailContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
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
  margin-bottom: 16px;
`

const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 24px;
  white-space: pre-wrap;
`

const MetaSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`

const MetaItem = styled.div`
  display: flex;
  align-items: flex-start;
  
  svg {
    margin-right: 8px;
    color: ${({ theme }) => theme.textSecondary};
    margin-top: 2px;
    flex-shrink: 0;
  }
`

const MetaContent = styled.div`
  display: flex;
  flex-direction: column;
`

const MetaLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 4px;
`

const MetaValue = styled.span`
  font-size: 14px;
  font-weight: 500;
`

const Section = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
  color: ${({ theme }) => theme.textSecondary};
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

const DetailFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
`

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
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
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    }),
    time: date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    full: date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const ActivityDetail = ({ activity, onClose, onEdit }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  
  const formattedDate = formatDate(activity.date)
  const formattedStatusDate = formatDate(activity.lastStatusChangeDate)
  
  return (
    <Overlay onClick={handleOverlayClick}>
      <DetailContainer>
        <DetailHeader>
          <Title>Detalle de actividad</Title>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </DetailHeader>
        
        <DetailContent>
          <TypeBadge type={activity.type}>
            {activity.type}
          </TypeBadge>
          
          <Description>{activity.description}</Description>
          
          <MetaSection>
            <MetaItem>
              <FiCalendar size={16} />
              <MetaContent>
                <MetaLabel>Fecha y hora</MetaLabel>
                <MetaValue>{formattedDate.full}</MetaValue>
              </MetaContent>
            </MetaItem>
            
            <MetaItem>
              <FiUser size={16} />
              <MetaContent>
                <MetaLabel>Persona</MetaLabel>
                <MetaValue>{activity.person || 'N/A'}</MetaValue>
              </MetaContent>
            </MetaItem>
            
            <MetaItem>
              <FiMapPin size={16} />
              <MetaContent>
                <MetaLabel>Cargo / Rol</MetaLabel>
                <MetaValue>{activity.role || 'N/A'}</MetaValue>
              </MetaContent>
            </MetaItem>
            
            <MetaItem>
              <FiMapPin size={16} />
              <MetaContent>
                <MetaLabel>Dependencia</MetaLabel>
                <MetaValue>{activity.dependency || 'N/A'}</MetaValue>
              </MetaContent>
            </MetaItem>
          </MetaSection>
          
          <Section>
            <SectionTitle>Situación</SectionTitle>
            <Description>{activity.situation || 'No hay información de situación'}</Description>
          </Section>
          
          <Section>
            <SectionTitle>Resultado</SectionTitle>
            <Description>{activity.result || 'No hay información de resultado'}</Description>
          </Section>
          
          <Section>
            <SectionTitle>Estado</SectionTitle>
            <MetaItem>
              <StatusBadge status={activity.status}>
                {getStatusIcon(activity.status)}
                {activity.status}
              </StatusBadge>
            </MetaItem>
            {activity.lastStatusChangeDate && (
              <MetaItem style={{ marginTop: '8px' }}>
                <FiClock size={16} />
                <MetaContent>
                  <MetaLabel>Última actualización</MetaLabel>
                  <MetaValue>{formattedStatusDate.full}</MetaValue>
                </MetaContent>
              </MetaItem>
            )}
          </Section>
          
          {activity.comments && (
            <Section>
              <SectionTitle>Comentarios</SectionTitle>
              <Description>{activity.comments}</Description>
            </Section>
          )}
          
          <Section>
            <SectionTitle>Agente</SectionTitle>
            <MetaValue>{activity.agent || 'No especificado'}</MetaValue>
          </Section>
        </DetailContent>
        
        <DetailFooter>
          <EditButton onClick={onEdit}>
            <FiEdit2 size={16} />
            Editar
          </EditButton>
        </DetailFooter>
      </DetailContainer>
    </Overlay>
  )
}

export default ActivityDetail
