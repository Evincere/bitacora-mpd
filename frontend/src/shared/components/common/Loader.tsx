import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface LoaderContainerProps {
  size?: 'small' | 'medium' | 'large';
  $fullHeight?: boolean;
}

const LoaderContainer = styled.div<LoaderContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ $fullHeight }) => ($fullHeight ? '100%' : 'auto')};
  width: 100%;
  min-height: ${({ $fullHeight }) => ($fullHeight ? '200px' : 'auto')};
`;

interface SpinnerWrapperProps {
  size?: 'small' | 'medium' | 'large';
}

const SpinnerWrapper = styled.div<SpinnerWrapperProps>`
  width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '30px';
      case 'large':
        return '70px';
      default:
        return '50px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'small':
        return '30px';
      case 'large':
        return '70px';
      default:
        return '50px';
    }
  }};
  position: relative;
`;

const Spinner = styled.div`
  border: 4px solid rgba(108, 92, 231, 0.2);
  border-radius: 50%;
  border-top: 4px solid ${({ theme }) => theme.primary};
  width: 100%;
  height: 100%;
  animation: ${spin} 1s linear infinite;
`;

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  fullHeight?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  fullHeight = true,
  className,
  style
}) => {
  // Usamos transient props con el prefijo $ para evitar que se pasen al DOM
  return (
    <LoaderContainer size={size} $fullHeight={fullHeight} className={className} style={style}>
      <SpinnerWrapper size={size}>
        <Spinner />
      </SpinnerWrapper>
    </LoaderContainer>
  );
};

export default Loader;
