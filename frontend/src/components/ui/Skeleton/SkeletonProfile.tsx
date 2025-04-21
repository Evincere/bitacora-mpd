import React from 'react';
import styled from 'styled-components';
import Skeleton from './Skeleton';
import SkeletonForm from './SkeletonForm';

// Propiedades para el componente SkeletonProfile
export interface SkeletonProfileProps {
  avatarSize?: string | number;
  animation?: 'shimmer' | 'pulse';
  className?: string;
  style?: React.CSSProperties;
}

const ProfileContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 16px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/**
 * Componente SkeletonProfile para mostrar un perfil de usuario en estado de carga
 */
const SkeletonProfile: React.FC<SkeletonProfileProps> = ({
  avatarSize = 80,
  animation = 'shimmer',
  className,
  style,
}) => {
  return (
    <ProfileContainer className={className} style={style} role="region" aria-label="Perfil de usuario cargando">
      <ProfileHeader>
        <Skeleton
          variant="circular"
          width={avatarSize}
          height={avatarSize}
          animation={animation}
          aria-label="Avatar de usuario cargando"
        />
        
        <ProfileInfo>
          <Skeleton
            width={200}
            height={24}
            animation={animation}
            aria-label="Nombre de usuario cargando"
          />
          <Skeleton
            width={150}
            height={16}
            animation={animation}
            aria-label="Rol de usuario cargando"
          />
          <Skeleton
            width={180}
            height={16}
            animation={animation}
            aria-label="Correo electrónico de usuario cargando"
          />
        </ProfileInfo>
      </ProfileHeader>

      <SkeletonForm
        fields={3}
        withTitle={true}
        titleWidth="40%"
        animation={animation}
        aria-label="Formulario de perfil cargando"
      />
    </ProfileContainer>
  );
};

export default SkeletonProfile;
