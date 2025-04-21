import React from 'react';
import { Routes, useLocation } from 'react-router-dom';
import { PageTransition } from './PageTransition';

// Propiedades para el componente AnimatedRoutes
interface AnimatedRoutesProps {
  children: React.ReactNode;
  transitionType?: 'fade' | 'slide' | 'zoom' | 'none';
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Componente AnimatedRoutes para animar transiciones entre rutas
 */
const AnimatedRoutes: React.FC<AnimatedRoutesProps> = ({
  children,
  transitionType = 'fade',
  duration = 300,
  className,
  style,
}) => {
  const location = useLocation();
  
  return (
    <PageTransition
      type={transitionType}
      duration={duration}
      className={className}
      style={style}
    >
      <Routes location={location}>
        {children}
      </Routes>
    </PageTransition>
  );
};

export default AnimatedRoutes;
