import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiUser, FiUsers, FiClock, FiRefreshCw } from 'react-icons/fi';
import { useCollaboration } from '@/services/collaborationService';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 16px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const UserList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const UserItem = styled.li`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const LastActivity = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

interface ConnectedUsersProps {
  refreshInterval?: number; // en milisegundos
}

/**
 * Componente que muestra los usuarios conectados actualmente.
 */
const ConnectedUsers: React.FC<ConnectedUsersProps> = ({ refreshInterval = 30000 }) => {
  const collaboration = useCollaboration();
  const [users, setUsers] = useState<{ userId: number, userName: string, lastActivity: number }[]>([]);
  
  // Función para actualizar la lista de usuarios
  const refreshUsers = () => {
    const connectedUsers = collaboration.getConnectedUsers();
    setUsers(connectedUsers);
  };
  
  // Actualizar la lista de usuarios al montar el componente
  useEffect(() => {
    refreshUsers();
    
    // Configurar intervalo para actualizar la lista periódicamente
    const interval = setInterval(refreshUsers, refreshInterval);
    
    return () => {
      clearInterval(interval);
    };
  }, [refreshInterval]);
  
  // Si no hay usuarios conectados, mostrar mensaje
  if (users.length === 0) {
    return (
      <Container>
        <Header>
          <Title>
            <FiUsers size={18} />
            Usuarios conectados
          </Title>
          <RefreshButton onClick={refreshUsers}>
            <FiRefreshCw size={16} />
          </RefreshButton>
        </Header>
        <div>No hay usuarios conectados actualmente.</div>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <Title>
          <FiUsers size={18} />
          Usuarios conectados ({users.length})
        </Title>
        <RefreshButton onClick={refreshUsers}>
          <FiRefreshCw size={16} />
        </RefreshButton>
      </Header>
      
      <UserList>
        {users.map(user => (
          <UserItem key={user.userId}>
            <UserIcon>
              <FiUser size={16} />
            </UserIcon>
            <UserInfo>
              <UserName>{user.userName}</UserName>
              <LastActivity>
                <FiClock size={12} style={{ marginRight: '4px' }} />
                Activo {formatDistanceToNow(user.lastActivity, { addSuffix: true, locale: es })}
              </LastActivity>
            </UserInfo>
          </UserItem>
        ))}
      </UserList>
    </Container>
  );
};

export default ConnectedUsers;
