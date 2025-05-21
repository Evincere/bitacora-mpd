import React from 'react';
import styled from 'styled-components';
import { FiEdit2, FiArrowLeft, FiUser, FiMail, FiCalendar, FiTag, FiBriefcase, FiHome, FiCheck, FiX } from 'react-icons/fi';
import { User } from '@/core/types/models';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.cardBackground};
  color: ${({ theme, $primary }) => 
    $primary ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.border};

  &:hover {
    background-color: ${({ theme, $primary }) => 
      $primary ? theme.primaryDark : theme.hoverBackground};
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const UserRole = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 4px;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Section = styled.div`
  margin-top: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const PermissionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const PermissionBadge = styled.div`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.primary + '20'};
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary + '40'};
`;

const StatusBadge = styled.div<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ theme, $active }) => 
    $active ? theme.success + '20' : theme.danger + '20'};
  color: ${({ theme, $active }) => 
    $active ? theme.success : theme.danger};
  border: 1px solid ${({ theme, $active }) => 
    $active ? theme.success + '40' : theme.danger + '40'};
`;

interface UserDetailProps {
  user: User;
  onBack?: () => void;
  onEdit?: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, onBack, onEdit }) => {
  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Container>
      <Header>
        <Title>Detalle de Usuario</Title>
        <Actions>
          <Button onClick={onBack}>
            <FiArrowLeft size={16} />
            Volver
          </Button>
          <Button $primary onClick={onEdit}>
            <FiEdit2 size={16} />
            Editar
          </Button>
        </Actions>
      </Header>

      <Card>
        <CardHeader>
          <UserAvatar>
            {getInitials(user.fullName)}
          </UserAvatar>
          <UserInfo>
            <UserName>{user.fullName}</UserName>
            <UserRole>{user.role} - {user.position}</UserRole>
          </UserInfo>
        </CardHeader>

        <CardContent>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Nombre de usuario</InfoLabel>
              <InfoValue>
                <FiUser size={16} />
                {user.username}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Correo electrónico</InfoLabel>
              <InfoValue>
                <FiMail size={16} />
                {user.email}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Cargo</InfoLabel>
              <InfoValue>
                <FiBriefcase size={16} />
                {user.position || 'No especificado'}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Departamento</InfoLabel>
              <InfoValue>
                <FiHome size={16} />
                {user.department || 'No especificado'}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Rol</InfoLabel>
              <InfoValue>
                <FiTag size={16} />
                {user.role}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Estado</InfoLabel>
              <InfoValue>
                <StatusBadge $active={user.active}>
                  {user.active ? <FiCheck size={14} /> : <FiX size={14} />}
                  {user.active ? 'Activo' : 'Inactivo'}
                </StatusBadge>
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Fecha de creación</InfoLabel>
              <InfoValue>
                <FiCalendar size={16} />
                {formatDate(user.createdAt)}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Última actualización</InfoLabel>
              <InfoValue>
                <FiCalendar size={16} />
                {formatDate(user.updatedAt)}
              </InfoValue>
            </InfoItem>
          </InfoGrid>

          <Section>
            <SectionTitle>Permisos</SectionTitle>
            <PermissionsList>
              {user.permissions && user.permissions.length > 0 ? (
                user.permissions.map(permission => (
                  <PermissionBadge key={permission}>
                    {permission}
                  </PermissionBadge>
                ))
              ) : (
                <div>No tiene permisos específicos asignados</div>
              )}
            </PermissionsList>
          </Section>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserDetail;
