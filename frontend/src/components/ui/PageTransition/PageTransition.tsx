import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';

// Propiedades para el componente PageTransition
export interface PageTransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'zoom' | 'none';
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Animaciones
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-20px);
    opacity: 0;
  }
`;

const zoomIn = keyframes`
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const zoomOut = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(1.05);
    opacity: 0;
  }
`;

// Contenedor con animaciones
const TransitionContainer = styled.div<{
  $type: 'fade' | 'slide' | 'zoom' | 'none';
  $duration: number;
  $isEntering: boolean;
}>`
  width: 100%;

  ${({ $type, $duration, $isEntering }) => {
    if ($type === 'none') return css``;

    const enterAnimation = $type === 'fade' ? fadeIn : $type === 'slide' ? slideIn : zoomIn;
    const exitAnimation = $type === 'fade' ? fadeOut : $type === 'slide' ? slideOut : zoomOut;

    return css`
      animation: ${$isEntering ? enterAnimation : exitAnimation} ${$duration}ms ease-in-out;
      animation-fill-mode: both;
    `;
  }}
`;

/**
 * Componente PageTransition para animar transiciones entre páginas
 */
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  duration = 300,
  className,
  style,
}) => {
  const location = useLocation();
  const [isEntering, setIsEntering] = React.useState(true);
  const prevPathRef = useRef(location.pathname);

  // Detectar cambios de ruta
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      setIsEntering(false);

      // Programar la animación de entrada después de la animación de salida
      const timer = setTimeout(() => {
        setIsEntering(true);
        prevPathRef.current = location.pathname;
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, duration]);

  // Anunciar cambios de página para lectores de pantalla
  useEffect(() => {
    // Usar un timeout para asegurarse de que el anuncio ocurra después de que la página se haya cargado
    const timer = setTimeout(() => {
      const pageTitle = document.title;
      const announcement = `Navegado a ${pageTitle}`;

      // Crear un elemento para anunciar el cambio de página
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'assertive');
      announcer.setAttribute('role', 'status');
      announcer.className = 'sr-only';
      announcer.textContent = announcement;

      document.body.appendChild(announcer);

      // Eliminar el anunciador después de un tiempo
      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 1000);
    }, duration + 100);

    return () => clearTimeout(timer);
  }, [location.pathname, duration]);

  return (
    <TransitionContainer
      $type={type}
      $duration={duration}
      $isEntering={isEntering}
      className={className}
      style={style}
    >
      {children}
    </TransitionContainer>
  );
};

export default PageTransition;
