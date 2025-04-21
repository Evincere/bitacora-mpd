import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX } from 'react-icons/fi';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: ${({ theme }) => theme.textSecondary};
`;

const FormContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

// Animación de shimmer
const shimmerAnimation = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Componente de esqueleto para campos de formulario
const SkeletonItem = styled.div<{ width?: string, height?: string, marginBottom?: string }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '16px'};
  margin-bottom: ${({ marginBottom }) => marginBottom || '0'};
  border-radius: 4px;
  background: ${({ theme }) => theme.skeletonBackground || '#f0f0f0'};
  background-image: linear-gradient(
    90deg,
    ${({ theme }) => theme.skeletonBackground || '#f0f0f0'} 25%,
    ${({ theme }) => theme.skeletonHighlight || '#e0e0e0'} 50%,
    ${({ theme }) => theme.skeletonBackground || '#f0f0f0'} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmerAnimation} 1.5s infinite linear;
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

// Componente de esqueleto para formularios
const CustomSkeletonForm: React.FC<{
  fields?: number;
  fieldHeight?: number;
  labelHeight?: number;
  spacing?: number;
  withTitle?: boolean;
  withButtons?: boolean;
  buttonsAlign?: 'left' | 'center' | 'right';
  'aria-label'?: string;
}> = ({
  fields = 4,
  fieldHeight = 40,
  labelHeight = 16,
  spacing = 24,
  withTitle = true,
  withButtons = true,
  buttonsAlign = 'right',
  'aria-label': ariaLabel,
}) => {
  return (
    <div role="form" aria-label={ariaLabel || 'Formulario cargando'}>
      {withTitle && (
        <SkeletonItem
          width="60%"
          height="32px"
          marginBottom="16px"
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing}px` }}>
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SkeletonItem
              width="30%"
              height={`${labelHeight}px`}
            />
            <SkeletonItem
              height={`${fieldHeight}px`}
            />
          </div>
        ))}
      </div>

      {withButtons && (
        <div style={{
          display: 'flex',
          justifyContent: buttonsAlign === 'left' ? 'flex-start' : buttonsAlign === 'center' ? 'center' : 'flex-end',
          gap: '16px',
          marginTop: '24px'
        }}>
          <SkeletonItem width="120px" height="40px" />
          <SkeletonItem width="120px" height="40px" />
        </div>
      )}
    </div>
  );
};

const ActivityFormSkeleton: React.FC = () => {
  return (
    <Overlay>
      <FormContainer>
        <FormHeader>
          <Title>Cargando formulario...</Title>
          <CloseButton>
            <FiX size={20} />
          </CloseButton>
        </FormHeader>

        <FormContent>
          <CustomSkeletonForm
            fields={6}
            fieldHeight={40}
            labelHeight={16}
            spacing={24}
            withTitle={false}
            withButtons={false}
            aria-label="Formulario de actividad cargando"
          />
        </FormContent>

        <FormFooter>
          <CustomSkeletonForm
            fields={0}
            withTitle={false}
            withButtons={true}
            buttonsAlign="right"
            aria-label="Botones de formulario cargando"
          />
        </FormFooter>
      </FormContainer>
    </Overlay>
  );
};

export default ActivityFormSkeleton;
