import { Link } from 'react-router-dom'
import styled from 'styled-components'

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  text-align: center;
  padding: 20px;
`

const Title = styled.h1`
  font-size: 120px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin: 0;
  line-height: 1;
`

const Subtitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 20px 0;
`

const Description = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  max-width: 500px;
  margin-bottom: 30px;
`

const BackButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Subtitle>Página no encontrada</Subtitle>
      <Description>
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </Description>
      <BackButton to="/">Volver al Dashboard</BackButton>
    </NotFoundContainer>
  )
}

export default NotFound
