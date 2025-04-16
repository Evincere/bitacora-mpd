import styled from 'styled-components'
import { FiMoreVertical } from 'react-icons/fi'

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

const StatusTitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0 0 12px;
`

const MembersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const MemberItem = styled.div`
  display: flex;
  align-items: center;
`

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: white;
  font-weight: 600;
  font-size: 14px;
`

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ online, theme }) => online ? theme.success : theme.textSecondary};
  position: absolute;
  bottom: 0;
  right: 0;
  border: 2px solid ${({ theme }) => theme.cardBackground};
`

const AvatarWrapper = styled.div`
  position: relative;
`

const MemberInfo = styled.div`
  flex: 1;
`

const MemberName = styled.h5`
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 2px;
`

const MemberRole = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0;
`

const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

const getRandomColor = (index) => {
  const colors = ['#6C5CE7', '#00B8D4', '#FF3366', '#4CD964', '#FFCC00']
  return colors[index % colors.length]
}

const TeamMembers = () => {
  const onlineMembers = [
    {
      id: 1,
      name: 'Roberto Alex',
      role: 'Writer, Editor',
      online: true
    },
    {
      id: 2,
      name: 'Anthony Gomes',
      role: 'Designer',
      online: true
    },
    {
      id: 3,
      name: 'Roberto Thuan',
      role: 'UX Designer',
      online: true
    }
  ]
  
  const offlineMembers = [
    {
      id: 4,
      name: 'Mogen Polchin',
      role: 'UI Designer',
      online: false
    },
    {
      id: 5,
      name: 'Jonathan Doe',
      role: 'UI Engineer',
      online: false
    }
  ]
  
  return (
    <Card>
      <CardHeader>
        <Title>Equipo</Title>
        <MenuButton>
          <FiMoreVertical size={20} />
        </MenuButton>
      </CardHeader>
      
      <StatusTitle>ONLINE</StatusTitle>
      <MembersList>
        {onlineMembers.map((member, index) => (
          <MemberItem key={member.id}>
            <AvatarWrapper>
              <Avatar color={getRandomColor(index)}>
                {getInitials(member.name)}
              </Avatar>
              <StatusIndicator online={member.online} />
            </AvatarWrapper>
            <MemberInfo>
              <MemberName>{member.name}</MemberName>
              <MemberRole>{member.role}</MemberRole>
            </MemberInfo>
          </MemberItem>
        ))}
      </MembersList>
      
      <StatusTitle>OFFLINE</StatusTitle>
      <MembersList>
        {offlineMembers.map((member, index) => (
          <MemberItem key={member.id}>
            <AvatarWrapper>
              <Avatar color={getRandomColor(index + onlineMembers.length)}>
                {getInitials(member.name)}
              </Avatar>
              <StatusIndicator online={member.online} />
            </AvatarWrapper>
            <MemberInfo>
              <MemberName>{member.name}</MemberName>
              <MemberRole>{member.role}</MemberRole>
            </MemberInfo>
          </MemberItem>
        ))}
      </MembersList>
    </Card>
  )
}

export default TeamMembers
