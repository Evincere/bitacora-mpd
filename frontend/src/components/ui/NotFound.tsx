import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Contenedor principal
const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 0 20px;
`;

// Título grande para el código de error
const ErrorCode = styled.h1`
  font-size: 8rem;
  margin: 0;
  color: var(--primary-color);
  font-weight: 700;
`;

// Mensaje de error
const ErrorMessage = styled.h2`
  font-size: 2rem;
  margin: 0 0 2rem;
  color: var(--text-color);
`;

// Descripción del error
const ErrorDescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  color: var(--text-secondary-color);
`;

// Botón de regreso
const BackButton = styled(Link)`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark-color);
  }
`;

/**
 * Componente para la página 404 Not Found
 */
const NotFound = () => {
  return (
    <NotFoundContainer>
      <ErrorCode>404</ErrorCode>
      <ErrorMessage>Página no encontrada</ErrorMessage>
      <ErrorDescription>
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </ErrorDescription>
      <BackButton to="/app">Volver al inicio</BackButton>
    </NotFoundContainer>
  );
};

export default NotFound;
