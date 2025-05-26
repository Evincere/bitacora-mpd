import React from 'react';
import { TextSkeleton, RectSkeleton, CircleSkeleton } from './Skeleton';

/**
 * Esqueleto para una tarjeta de actividad
 */
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

/**
 * Esqueleto para una lista de actividades
 */
export const ActivitiesListSkeleton = ({ count = 5 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <ActivityCardSkeleton key={index} />
    ))}
  </>
);

/**
 * Esqueleto para el detalle de una actividad
 */
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

/**
 * Esqueleto para el formulario de actividad
 */
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

/**
 * Esqueleto para el perfil de usuario
 */
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

/**
 * Esqueleto para tabla
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <div style={{ width: '100%' }}>
    {/* Header */}
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', padding: '0.5rem 0' }}>
      {Array.from({ length: columns }).map((_, index) => (
        <TextSkeleton key={index} width="100%" height="1.2rem" margin="0" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', padding: '0.5rem 0' }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <TextSkeleton key={colIndex} width="100%" height="1rem" margin="0" />
        ))}
      </div>
    ))}
  </div>
);

/**
 * Esqueleto para lista de usuarios
 */
export const UserListSkeleton = ({ count = 3 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', marginBottom: '0.5rem', border: '1px solid var(--border-color, #e0e0e0)', borderRadius: '8px' }}>
        <CircleSkeleton size="48px" />
        <div style={{ flex: 1 }}>
          <TextSkeleton width="60%" height="1.2rem" margin="0 0 0.5rem 0" />
          <TextSkeleton width="40%" height="1rem" margin="0" />
        </div>
        <TextSkeleton width="80px" height="1rem" />
      </div>
    ))}
  </>
);
