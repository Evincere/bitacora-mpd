import React from 'react';
import styled from 'styled-components';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';

// Propiedades para el componente SkeletonForm
export interface SkeletonFormProps {
  fields?: number;
  fieldHeight?: string | number;
  labelHeight?: string | number;
  spacing?: string | number;
  withTitle?: boolean;
  titleWidth?: string | number;
  withButtons?: boolean;
  buttonsAlign?: 'left' | 'center' | 'right';
  animation?: 'shimmer' | 'pulse';
  className?: string;
  style?: React.CSSProperties;
}

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ spacing }) => (typeof spacing === 'number' ? `${spacing}px` : spacing || '24px')};
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ButtonsContainer = styled.div<{ $align: 'left' | 'center' | 'right' }>`
  display: flex;
  justify-content: ${({ $align }) => {
    switch ($align) {
      case 'left': return 'flex-start';
      case 'center': return 'center';
      case 'right': return 'flex-end';
      default: return 'flex-end';
    }
  }};
  gap: 16px;
  margin-top: 16px;
`;

/**
 * Componente SkeletonForm para mostrar un formulario en estado de carga
 */
const SkeletonForm: React.FC<SkeletonFormProps> = ({
  fields = 4,
  fieldHeight = 40,
  labelHeight = 16,
  spacing = 24,
  withTitle = true,
  titleWidth = '60%',
  withButtons = true,
  buttonsAlign = 'right',
  animation = 'shimmer',
  className,
  style,
}) => {
  return (
    <FormContainer spacing={spacing} className={className} style={style} role="form" aria-label="Formulario cargando">
      {withTitle && (
        <Skeleton
          width={titleWidth}
          height="32px"
          margin="0 0 16px 0"
          animation={animation}
          aria-label="Título del formulario cargando"
        />
      )}

      {Array.from({ length: fields }).map((_, index) => (
        <FormField key={`field-${index}`}>
          <Skeleton
            width="30%"
            height={labelHeight}
            animation={animation}
            aria-label={`Etiqueta de campo ${index + 1} cargando`}
          />
          <Skeleton
            width="100%"
            height={fieldHeight}
            animation={animation}
            aria-label={`Campo de entrada ${index + 1} cargando`}
          />
        </FormField>
      ))}

      {/* Campo de texto largo (textarea) */}
      <FormField>
        <Skeleton
          width="40%"
          height={labelHeight}
          animation={animation}
          aria-label="Etiqueta de área de texto cargando"
        />
        <Skeleton
          width="100%"
          height={fieldHeight ? Number(fieldHeight) * 3 : 120}
          animation={animation}
          aria-label="Área de texto cargando"
        />
      </FormField>

      {withButtons && (
        <ButtonsContainer $align={buttonsAlign}>
          <Skeleton
            width={100}
            height={40}
            animation={animation}
            aria-label="Botón secundario cargando"
          />
          <Skeleton
            width={120}
            height={40}
            animation={animation}
            aria-label="Botón principal cargando"
          />
        </ButtonsContainer>
      )}
    </FormContainer>
  );
};

export default SkeletonForm;
