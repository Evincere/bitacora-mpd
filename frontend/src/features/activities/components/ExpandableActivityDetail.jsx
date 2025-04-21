import React from 'react'
import styled from 'styled-components'
import {
  FiEdit2,
  FiCalendar,
  FiUser,
  FiMapPin,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiChevronUp,
  FiTag,
  FiPhone,
  FiMail,
  FiUsers,
  FiClipboard,
  FiInfo
} from 'react-icons/fi'
import { glassExpandable } from '../../../styles/glassmorphism'
import { statusColors, typeColors } from '../../../styles/statusColors'
import StatusBadge from '../../../components/ui/StatusBadge'
import TypeBadge from '../../../components/ui/TypeBadge'

const DetailContainer = styled.div`
  ${glassExpandable}
  position: relative;
  overflow: hidden;
  max-height: ${({ $expanded }) => ($expanded ? '1000px' : '0')};
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: ${({ $expanded }) => ($expanded ? '10px' : '0')};
  margin-bottom: ${({ $expanded }) => ($expanded ? '10px' : '0')};
  margin-left: 20px;
  margin-right: 20px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transform-origin: top center;
  transform: ${({ $expanded }) => ($expanded ? 'scaleY(1)' : 'scaleY(0)')};
  opacity: ${({ $expanded }) => ($expanded ? '1' : '0')};
  z-index: 4;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
  }
`

const DetailContent = styled.div`
  padding: 24px;
  overflow-y: auto;
  position: relative;
  z-index: 2;
`

const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 24px;
  white-space: pre-wrap;
  position: relative;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border-left: 3px solid ${({ theme }) => theme.primary};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

const MetaSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -14px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
  }
`

const MetaItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  svg {
    margin-right: 12px;
    color: ${({ theme }) => theme.primary};
    margin-top: 2px;
    flex-shrink: 0;
    font-size: 18px;
    opacity: 0.9;
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
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
`

const MetaValue = styled.span`
  font-size: 14px;
  font-weight: 600;
`

const Section = styled.div`
  margin-bottom: 28px;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -14px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
  }

  &:last-child::after {
    display: none;
  }
`

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 16px;
    background-color: ${({ theme }) => theme.primary};
    margin-right: 8px;
    border-radius: 2px;
  }
`

// StatusBadge ahora se importa desde components/ui/StatusBadge

const DetailFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
  }
`

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.8) 0%, rgba(90, 75, 210, 0.8) 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(108, 92, 231, 0.3);

  &:hover {
    background: linear-gradient(135deg, rgba(108, 92, 231, 0.9) 0%, rgba(90, 75, 210, 0.9) 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(108, 92, 231, 0.4);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(108, 92, 231, 0.3);
  }

  svg {
    font-size: 16px;
  }
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.textSecondary};
  border-radius: 8px;
  font-weight: 600;
  margin-right: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.text};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(1px);
  }

  svg {
    font-size: 16px;
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

const ExpandableActivityDetail = ({ activity, expanded, onEdit, onClose }) => {
  const formattedDate = formatDate(activity.date)
  const formattedStatusDate = formatDate(activity.lastStatusChangeDate)

  // Función para obtener el icono según el tipo de actividad
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Atención Personal':
        return <FiUser size={18} />
      case 'Atención Telefónica':
        return <FiPhone size={18} />
      case 'Concursos':
        return <FiUsers size={18} />
      case 'Solicitud de info':
        return <FiInfo size={18} />
      case 'Mails':
        return <FiMail size={18} />
      case 'Multitareas':
        return <FiClipboard size={18} />
      case 'Tomo Nota':
        return <FiFileText size={18} />
      default:
        return <FiTag size={18} />
    }
  }

  return (
    <DetailContainer $expanded={expanded}>
      <DetailContent>
        <Description>{activity.description}</Description>

        <MetaSection>
          <MetaItem>
            <FiCalendar size={18} />
            <MetaContent>
              <MetaLabel>Fecha y hora</MetaLabel>
              <MetaValue>{formattedDate.full}</MetaValue>
            </MetaContent>
          </MetaItem>

          <MetaItem>
            <FiUser size={18} />
            <MetaContent>
              <MetaLabel>Persona</MetaLabel>
              <MetaValue>{activity.person || 'N/A'}</MetaValue>
            </MetaContent>
          </MetaItem>

          <MetaItem>
            <FiTag size={18} />
            <MetaContent>
              <MetaLabel>Tipo</MetaLabel>
              <MetaValue>
                <TypeBadge type={activity.type}>
                  {getTypeIcon(activity.type)}
                  {activity.type}
                </TypeBadge>
              </MetaValue>
            </MetaContent>
          </MetaItem>

          <MetaItem>
            <FiUsers size={18} />
            <MetaContent>
              <MetaLabel>Cargo / Rol</MetaLabel>
              <MetaValue>{activity.role || 'N/A'}</MetaValue>
            </MetaContent>
          </MetaItem>

          <MetaItem>
            <FiMapPin size={18} />
            <MetaContent>
              <MetaLabel>Dependencia</MetaLabel>
              <MetaValue>{activity.dependency || 'N/A'}</MetaValue>
            </MetaContent>
          </MetaItem>
        </MetaSection>

        <Section>
          <SectionTitle>
            <FiInfo size={18} style={{ marginRight: '8px' }} />
            Situación
          </SectionTitle>
          <Description>{activity.situation || 'No hay información de situación'}</Description>
        </Section>

        <Section>
          <SectionTitle>
            <FiCheckCircle size={18} style={{ marginRight: '8px' }} />
            Resultado
          </SectionTitle>
          <Description>{activity.result || 'No hay información de resultado'}</Description>
        </Section>

        <Section>
          <SectionTitle>
            <FiClock size={18} style={{ marginRight: '8px' }} />
            Estado
          </SectionTitle>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
            <StatusBadge status={activity.status}>
              {getStatusIcon(activity.status)}
              {activity.status}
            </StatusBadge>
          </div>
          {activity.lastStatusChangeDate && (
            <MetaItem style={{ marginTop: '16px' }}>
              <FiClock size={18} />
              <MetaContent>
                <MetaLabel>Última actualización</MetaLabel>
                <MetaValue>{formattedStatusDate.full}</MetaValue>
              </MetaContent>
            </MetaItem>
          )}
        </Section>

        {activity.comments && (
          <Section>
            <SectionTitle>
              <FiFileText size={18} style={{ marginRight: '8px' }} />
              Comentarios
            </SectionTitle>
            <Description>{activity.comments}</Description>
          </Section>
        )}

        <Section>
          <SectionTitle>
            <FiUser size={18} style={{ marginRight: '8px' }} />
            Agente
          </SectionTitle>
          <MetaItem>
            <FiUser size={18} />
            <MetaContent>
              <MetaLabel>Responsable</MetaLabel>
              <MetaValue>{activity.agent || 'No especificado'}</MetaValue>
            </MetaContent>
          </MetaItem>
        </Section>
      </DetailContent>

      <DetailFooter>
        <CloseButton onClick={onClose}>
          <FiChevronUp size={16} />
          Cerrar
        </CloseButton>
        <EditButton onClick={onEdit}>
          <FiEdit2 size={16} />
          Editar
        </EditButton>
      </DetailFooter>
    </DetailContainer>
  )
}

export default ExpandableActivityDetail
