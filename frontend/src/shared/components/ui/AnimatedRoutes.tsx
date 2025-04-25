import React, { ReactNode } from 'react';
import { Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';

interface AnimatedRoutesProps {
  children: ReactNode;
  transitionType?: 'fade' | 'slide' | 'scale' | 'none';
  duration?: number;
}

const PageTransition = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
`;

const getAnimationVariants = (type: string, duration: number) => {
  const durationInSeconds = duration / 1000;

  switch (type) {
    case 'fade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: durationInSeconds } },
        exit: { opacity: 0, transition: { duration: durationInSeconds } }
      };
    case 'slide':
      return {
        initial: { x: '100%', opacity: 0 },
        animate: { x: 0, opacity: 1, transition: { duration: durationInSeconds } },
        exit: { x: '-100%', opacity: 0, transition: { duration: durationInSeconds } }
      };
    case 'scale':
      return {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { duration: durationInSeconds } },
        exit: { scale: 0.9, opacity: 0, transition: { duration: durationInSeconds } }
      };
    case 'none':
    default:
      return {
        initial: {},
        animate: {},
        exit: {}
      };
  }
};

const AnimatedRoutes: React.FC<AnimatedRoutesProps> = ({
  children,
  transitionType = 'fade',
  duration = 300
}) => {
  const location = useLocation();
  const variants = getAnimationVariants(transitionType, duration);

  return (
    <AnimatePresence mode="wait">
      <PageTransition
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
      >
        <Routes location={location}>
          {children}
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
