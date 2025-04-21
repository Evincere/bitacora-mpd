import styled, { keyframes } from 'styled-components';

// Animación de pulso
const pulse = keyframes`
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
`;

// Estilos base para todos los esqueletos
const BaseSkeletonStyle = styled.div`
  background-color: var(--skeleton-color, #e0e0e0);
  border-radius: 4px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

// Propiedades para el esqueleto de texto
interface TextSkeletonProps {
  width?: string;
  height?: string;
  margin?: string;
}

// Esqueleto para texto
export const TextSkeleton = styled(BaseSkeletonStyle)<TextSkeletonProps>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '1rem'};
  margin: ${props => props.margin || '0.5rem 0'};
`;

// Propiedades para el esqueleto de círculo
interface CircleSkeletonProps {
  size?: string;
  margin?: string;
}

// Esqueleto para círculos (avatares, etc.)
export const CircleSkeleton = styled(BaseSkeletonStyle)<CircleSkeletonProps>`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: 50%;
  margin: ${props => props.margin || '0'};
`;

// Propiedades para el esqueleto de rectángulo
interface RectSkeletonProps {
  width?: string;
  height?: string;
  margin?: string;
  borderRadius?: string;
}

// Esqueleto para rectángulos (imágenes, tarjetas, etc.)
export const RectSkeleton = styled(BaseSkeletonStyle)<RectSkeletonProps>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '200px'};
  margin: ${props => props.margin || '0'};
  border-radius: ${props => props.borderRadius || '4px'};
`;

// Esqueleto para una tarjeta de actividad
export const ActivityCardSkeleton = () => (
  <div style={{ padding: '1rem', border: '1px solid var(--border-color, #e0e0e0)', borderRadius: '8px', marginBottom: '1rem' }}>
    <TextSkeleton width="60%" height="1.5rem" margin="0 0 1rem 0" />
    <TextSkeleton width="100%" height="1rem" margin="0.5rem 0" />
    <TextSkeleton width="100%" height="1rem" margin="0.5rem 0" />
    <TextSkeleton width="80%" height="1rem" margin="0.5rem 0" />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
      <TextSkeleton width="30%" height="1rem" />
      <TextSkeleton width="20%" height="1rem" />
    </div>
  </div>
);

// Esqueleto para una lista de actividades
export const ActivitiesListSkeleton = ({ count = 5 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <ActivityCardSkeleton key={index} />
    ))}
  </>
);

// Esqueleto para el detalle de una actividad
export const ActivityDetailSkeleton = () => (
  <div style={{ padding: '1.5rem' }}>
    <TextSkeleton width="70%" height="2rem" margin="0 0 2rem 0" />
    
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
      <TextSkeleton width="30%" height="1.2rem" />
      <TextSkeleton width="20%" height="1.2rem" />
    </div>
    
    <TextSkeleton width="100%" height="1.2rem" margin="1rem 0" />
    <TextSkeleton width="100%" height="1.2rem" margin="1rem 0" />
    <TextSkeleton width="90%" height="1.2rem" margin="1rem 0" />
    
    <RectSkeleton width="100%" height="150px" margin="2rem 0" />
    
    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
      <TextSkeleton width="120px" height="2rem" />
      <TextSkeleton width="120px" height="2rem" />
    </div>
  </div>
);

// Esqueleto para el formulario de actividad
export const ActivityFormSkeleton = () => (
  <div style={{ padding: '1.5rem' }}>
    <TextSkeleton width="50%" height="2rem" margin="0 0 2rem 0" />
    
    <TextSkeleton width="30%" height="1rem" margin="1rem 0 0.5rem 0" />
    <RectSkeleton width="100%" height="40px" margin="0 0 1.5rem 0" />
    
    <TextSkeleton width="30%" height="1rem" margin="1rem 0 0.5rem 0" />
    <RectSkeleton width="100%" height="40px" margin="0 0 1.5rem 0" />
    
    <TextSkeleton width="30%" height="1rem" margin="1rem 0 0.5rem 0" />
    <RectSkeleton width="100%" height="40px" margin="0 0 1.5rem 0" />
    
    <TextSkeleton width="30%" height="1rem" margin="1rem 0 0.5rem 0" />
    <RectSkeleton width="100%" height="100px" margin="0 0 1.5rem 0" />
    
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
      <RectSkeleton width="120px" height="40px" />
      <RectSkeleton width="120px" height="40px" />
    </div>
  </div>
);

// Esqueleto para el perfil de usuario
export const ProfileSkeleton = () => (
  <div style={{ padding: '1.5rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
      <CircleSkeleton size="80px" margin="0 1.5rem 0 0" />
      <div>
        <TextSkeleton width="200px" height="1.5rem" margin="0.5rem 0" />
        <TextSkeleton width="150px" height="1rem" margin="0.5rem 0" />
      </div>
    </div>
    
    <TextSkeleton width="30%" height="1rem" margin="1rem 0 0.5rem 0" />
    <RectSkeleton width="100%" height="40px" margin="0 0 1.5rem 0" />
    
    <TextSkeleton width="30%" height="1rem" margin="1rem 0 0.5rem 0" />
    <RectSkeleton width="100%" height="40px" margin="0 0 1.5rem 0" />
    
    <TextSkeleton width="30%" height="1rem" margin="1rem 0 0.5rem 0" />
    <RectSkeleton width="100%" height="40px" margin="0 0 1.5rem 0" />
    
    <RectSkeleton width="150px" height="40px" margin="2rem 0 0 0" />
  </div>
);
