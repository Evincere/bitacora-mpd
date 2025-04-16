import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { FiX, FiCheck, FiInfo, FiAlertTriangle } from 'react-icons/fi'
import { removeNotification } from '../../store/uiSlice'

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
`

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-left: 4px solid ${({ type, theme }) => {
    switch (type) {
      case 'success': return theme.success
      case 'error': return theme.error
      case 'warning': return theme.warning
      default: return theme.primary
    }
  }};
  border-radius: 4px;
  box-shadow: ${({ theme }) => theme.shadow};
  animation: slideIn 0.3s ease forwards;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 12px;
  color: ${({ type, theme }) => {
    switch (type) {
      case 'success': return theme.success
      case 'error': return theme.error
      case 'warning': return theme.warning
      default: return theme.primary
    }
  }};
`

const Content = styled.div`
  flex: 1;
`

const Title = styled.h4`
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
`

const Message = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-left: 8px;
  color: ${({ theme }) => theme.textSecondary};
  
  &:hover {
    color: ${({ theme }) => theme.text};
  }
`

const getIcon = (type) => {
  switch (type) {
    case 'success': return <FiCheck size={16} />
    case 'error': return <FiX size={16} />
    case 'warning': return <FiAlertTriangle size={16} />
    default: return <FiInfo size={16} />
  }
}

const NotificationCenter = () => {
  const dispatch = useDispatch()
  const { notifications } = useSelector(state => state.ui)
  
  useEffect(() => {
    if (notifications.length > 0) {
      const timers = notifications.map(notification => {
        return setTimeout(() => {
          dispatch(removeNotification(notification.id))
        }, notification.duration || 5000)
      })
      
      return () => {
        timers.forEach(timer => clearTimeout(timer))
      }
    }
  }, [notifications, dispatch])
  
  const handleClose = (id) => {
    dispatch(removeNotification(id))
  }
  
  return (
    <NotificationContainer>
      {notifications.map(notification => (
        <NotificationItem key={notification.id} type={notification.type}>
          <IconWrapper type={notification.type}>
            {getIcon(notification.type)}
          </IconWrapper>
          <Content>
            <Title>{notification.title}</Title>
            <Message>{notification.message}</Message>
          </Content>
          <CloseButton onClick={() => handleClose(notification.id)}>
            <FiX size={16} />
          </CloseButton>
        </NotificationItem>
      ))}
    </NotificationContainer>
  )
}

export default NotificationCenter
