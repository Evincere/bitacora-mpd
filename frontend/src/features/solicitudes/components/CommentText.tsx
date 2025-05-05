import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import userSearchService from '@/features/usuarios/services/userSearchService';

interface CommentTextProps {
  content: string;
  className?: string;
}

interface UserInfo {
  id: number;
  username: string;
  name: string;
  initial: string;
}

const StyledText = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
`;

const MentionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
  text-decoration: none;
  background-color: ${({ theme }) => `${theme.primary}10`};
  border-radius: 4px;
  padding: 0 4px;
  margin: 0 2px;

  &:hover {
    text-decoration: underline;
    background-color: ${({ theme }) => `${theme.primary}20`};
  }
`;

const UserAvatar = styled.div<{ initial?: string }>`
  width: 16px;
  height: 16px;
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
  font-size: 10px;
  flex-shrink: 0;
  text-transform: uppercase;
  margin-right: 4px;
`;

const MentionText = styled.span`
  margin-left: 2px;
`;

/**
 * Componente que renderiza el texto de un comentario con formato para menciones
 */
const CommentText: React.FC<CommentTextProps> = ({ content, className }) => {
  const [userInfoMap, setUserInfoMap] = useState<Record<string, UserInfo>>({});

  // Expresión regular para encontrar menciones con @
  const mentionRegex = /@([a-zA-Z0-9._-]+)/g;

  // Extraer todos los nombres de usuario mencionados
  useEffect(() => {
    const usernames: string[] = [];
    let match;

    // Crear una copia de la expresión regular para usarla en el efecto
    const regex = new RegExp(mentionRegex);

    // Encontrar todas las menciones en el texto
    while ((match = regex.exec(content)) !== null) {
      const username = match[1];
      if (username !== 'all' && !userInfoMap[username]) {
        usernames.push(username);
      }
    }

    // Si hay nombres de usuario para buscar, obtener su información
    if (usernames.length > 0) {
      const fetchUserInfo = async () => {
        try {
          // Buscar información de cada usuario mencionado
          const userInfoPromises = usernames.map(async (username) => {
            try {
              const users = await userSearchService.searchUsers(username, 1);
              if (users.length > 0 && users[0].username === username) {
                return {
                  username,
                  user: {
                    id: users[0].id,
                    username: users[0].username,
                    name: users[0].fullName || `${users[0].firstName} ${users[0].lastName}`.trim(),
                    initial: (users[0].firstName || users[0].username).charAt(0)
                  }
                };
              }
              return null;
            } catch (error) {
              console.error(`Error al buscar información del usuario ${username}:`, error);
              return null;
            }
          });

          // Esperar a que se resuelvan todas las promesas
          const userInfoResults = await Promise.all(userInfoPromises);

          // Crear un mapa con la información de los usuarios
          const newUserInfoMap = { ...userInfoMap };
          userInfoResults.forEach((result) => {
            if (result) {
              newUserInfoMap[result.username] = result.user;
            }
          });

          setUserInfoMap(newUserInfoMap);
        } catch (error) {
          console.error('Error al buscar información de usuarios:', error);
        }
      };

      fetchUserInfo();
    }
  }, [content, userInfoMap]);

  // Dividir el contenido en partes (texto normal y menciones)
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  // Crear una copia de la expresión regular para usarla en el renderizado
  const regex = new RegExp(mentionRegex);

  // Encontrar todas las menciones en el texto
  while ((match = regex.exec(content)) !== null) {
    // Agregar el texto antes de la mención
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    // Agregar la mención como un enlace
    const username = match[1];

    if (username === 'all') {
      // Mención especial @all
      parts.push(
        <MentionLink
          key={`mention-${match.index}`}
          to="#"
          onClick={(e) => e.preventDefault()}
        >
          <UserAvatar>
            <FiUser size={10} />
          </UserAvatar>
          <MentionText>@all</MentionText>
        </MentionLink>
      );
    } else {
      // Mención a un usuario específico
      const userInfo = userInfoMap[username];

      parts.push(
        <MentionLink
          key={`mention-${match.index}`}
          to={`/app/usuarios/${username}`}
          title={userInfo ? userInfo.name : username}
        >
          <UserAvatar initial={userInfo ? userInfo.initial : username.charAt(0)}>
            {userInfo ? userInfo.initial : username.charAt(0)}
          </UserAvatar>
          <MentionText>@{username}</MentionText>
        </MentionLink>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Agregar el texto restante después de la última mención
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return <StyledText className={className}>{parts}</StyledText>;
};

export default CommentText;
