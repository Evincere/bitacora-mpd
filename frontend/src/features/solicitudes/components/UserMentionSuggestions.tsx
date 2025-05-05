import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiUser, FiUsers } from 'react-icons/fi';

interface User {
  id: number;
  username: string;
  name: string;
  isSpecial?: boolean;
}

interface UserMentionSuggestionsProps {
  users: User[];
  isVisible: boolean;
  position: { top: number; left: number };
  onSelectUser: (user: User) => void;
  activeIndex: number;
  query: string;
}

const SuggestionsContainer = styled.div<{ top: number; left: number }>`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  width: 250px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  border: 1px solid ${({ theme }) => theme.border};
`;

const SuggestionItem = styled.div<{ isActive: boolean }>`
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background-color: ${({ theme, isActive }) => isActive ? theme.backgroundHover : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const UserAvatar = styled.div<{ initial?: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${({ theme, initial }) => {
    if (initial) {
      const colors = [
        theme.primary,
        theme.success,
        theme.info,
        theme.warning,
        theme.error
      ];
      const charCode = initial.charCodeAt(0);
      const colorIndex = charCode % colors.length;
      return `${colors[colorIndex]}30`;
    }
    return `${theme.primary}20`;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, initial }) => {
    if (initial) {
      const colors = [
        theme.primary,
        theme.success,
        theme.info,
        theme.warning,
        theme.error
      ];
      const charCode = initial.charCodeAt(0);
      const colorIndex = charCode % colors.length;
      return colors[colorIndex];
    }
    return theme.primary;
  }};
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  text-transform: uppercase;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const UserUsername = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const NoResults = styled.div`
  padding: 12px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const UserMentionSuggestions: React.FC<UserMentionSuggestionsProps> = ({
  users,
  isVisible,
  position,
  onSelectUser,
  activeIndex,
  query
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Combinar usuarios con opciones especiales
  const allOptions = React.useMemo(() => {
    const options = [...users];

    // Añadir opción @all si la consulta está vacía o comienza con "a"
    if (query === '' || query.toLowerCase().startsWith('a')) {
      options.unshift({
        id: -1,
        username: 'all',
        name: 'Mencionar a todos',
        isSpecial: true
      });
    }

    return options;
  }, [users, query]);

  // Scroll to active item when activeIndex changes
  useEffect(() => {
    if (containerRef.current && activeIndex >= 0 && activeIndex < allOptions.length) {
      const container = containerRef.current;
      const activeItem = container.children[activeIndex] as HTMLElement;

      if (activeItem) {
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;
        const itemTop = activeItem.offsetTop;
        const itemBottom = itemTop + activeItem.clientHeight;

        if (itemTop < containerTop) {
          container.scrollTop = itemTop;
        } else if (itemBottom > containerBottom) {
          container.scrollTop = itemBottom - container.clientHeight;
        }
      }
    }
  }, [activeIndex, allOptions.length]);

  if (!isVisible || allOptions.length === 0) {
    return null;
  }

  return (
    <SuggestionsContainer
      top={position.top}
      left={position.left}
      ref={containerRef}
    >
      {allOptions.length > 0 ? (
        allOptions.map((user, index) => (
          <SuggestionItem
            key={user.isSpecial ? `special-${user.username}` : user.id}
            onClick={() => onSelectUser(user)}
            isActive={index === activeIndex}
          >
            <UserAvatar initial={user.isSpecial ? undefined : user.name.charAt(0)}>
              {user.isSpecial ?
                <FiUsers size={14} /> :
                (user.name.charAt(0) || <FiUser size={14} />)
              }
            </UserAvatar>
            <UserInfo>
              <UserName>{user.name}</UserName>
              <UserUsername>@{user.username}</UserUsername>
              {user.isSpecial && user.username === 'all' && (
                <UserUsername style={{ color: '#666', fontSize: '10px' }}>
                  Notifica a todos los participantes
                </UserUsername>
              )}
            </UserInfo>
          </SuggestionItem>
        ))
      ) : (
        <NoResults>No se encontraron usuarios</NoResults>
      )}
    </SuggestionsContainer>
  );
};

export default UserMentionSuggestions;
