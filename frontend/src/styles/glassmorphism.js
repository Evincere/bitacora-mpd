import { css } from 'styled-components';

// Efecto glassmorphism básico
export const glassEffect = css`
  background: rgba(42, 42, 48, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

// Efecto glassmorphism para tarjetas
export const glassCard = css`
  ${glassEffect}
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
`;

// Efecto glassmorphism para modales
export const glassModal = css`
  ${glassEffect}
  border-radius: 16px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
`;

// Efecto glassmorphism para elementos expandibles
export const glassExpandable = css`
  ${glassEffect}
  border-radius: 0 0 12px 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
`;

// Efecto glassmorphism para botones
export const glassButton = css`
  background: rgba(108, 92, 231, 0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(108, 92, 231, 0.1);
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(108, 92, 231, 0.3);
    box-shadow: 0 5px 15px rgba(108, 92, 231, 0.2);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

// Efecto glassmorphism para inputs
export const glassInput = css`
  background: rgba(58, 58, 64, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  
  &:focus {
    background: rgba(58, 58, 64, 0.5);
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.3);
  }
`;
