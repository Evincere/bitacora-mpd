import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface PageTransitionProps {
  children: ReactNode;
  type?: string;
  duration?: number;
}

const PageContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

// Variantes de animación para la transición de página
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -10,
  },
};

// Configuración de transición
const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

/**
 * Componente que envuelve las páginas para añadir animaciones de transición
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <PageContainer
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </PageContainer>
  );
};

export default PageTransition;
