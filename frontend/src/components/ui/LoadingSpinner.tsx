import styled, { keyframes } from 'styled-components';

// Animación de rotación
const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Propiedades del spinner
interface SpinnerProps {
  size?: number;
  borderWidth?: number;
  color?: string;
  secondaryColor?: string;
}

// Componente de spinner estilizado
const Spinner = styled.div<SpinnerProps>`
  display: inline-block;
  width: ${props => `${props.size}px`};
  height: ${props => `${props.size}px`};
  border: ${props => `${props.borderWidth}px solid ${props.secondaryColor}`};
  border-radius: 50%;
  border-top: ${props => `${props.borderWidth}px solid ${props.color}`};
  animation: ${rotate} 1s linear infinite;
`;

// Contenedor para centrar el spinner
const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

/**
 * Componente de spinner de carga
 */
const LoadingSpinner = ({
  size = 40,
  borderWidth = 4,
  color = 'var(--primary-color, #3498db)',
  secondaryColor = 'var(--skeleton-color, #e0e0e0)',
  centered = true
}: SpinnerProps & { centered?: boolean }) => {
  const spinner = (
    <Spinner
      size={size}
      borderWidth={borderWidth}
      color={color}
      secondaryColor={secondaryColor}
    />
  );

  return centered ? <SpinnerContainer>{spinner}</SpinnerContainer> : spinner;
};

export default LoadingSpinner;
